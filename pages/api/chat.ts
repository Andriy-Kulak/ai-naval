import { Message } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import pineconeStore from "@/utils/pineconeStore";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function translate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages, userName } = req.body;

  const translatedText = await askOpenAI({ messages, userName });

  const TRIAL_URL = "https://api.elevenlabs.io";
  const API_PATH = `/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;
  const API_KEY = process.env.ELEVENLABS_KEY as string;

  const OPTIONS = {
    method: "POST",
    body: JSON.stringify({
      text: translatedText,
      model_id: "eleven_monolingual_v1",
    }),
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      accept: "audio/mpeg",
    },
  };

  const response = await fetch(TRIAL_URL + API_PATH, OPTIONS);

  const audioData = await response.arrayBuffer();
  const audioDataBase64 = Buffer.from(audioData).toString("base64");

  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ audioDataBase64, translatedText }));
}

async function askOpenAI({
  messages,
  userName,
}: {
  messages: Message[];
  userName: string;
}) {
  const pinecone = await pineconeStore();

  // console.log("data.length ============>", data.length);
  //  console.log("data first [0]", data[0]);

  console.log("messages", messages);

  // updated the message content to include context snippets
  if (messages?.length > 0) {
    const lastMsgContent = messages[messages.length - 1].content;

    const data = await pinecone.similaritySearch(lastMsgContent, 4);

    console.log("data.length ============>", data.length);

    const updatedMsgContent = `
    user question/statement: ${lastMsgContent}
    context snippets:
    ---
    1) ${data?.[0]?.pageContent}
    ---
    2) ${data?.[1]?.pageContent}
    ---
    3) ${data?.[2]?.pageContent}
    ---
    4) ${data?.[3]?.pageContent}
    `;

    messages[messages.length - 1].content = updatedMsgContent;
  }

  console.log("messages after", messages);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [
      {
        role: "system",
        content: `
        Imagine you are Naval Ravikant and you want to give advice to the user you're interacting with that may ask you questions or advice. The user's name is ${userName}.
        I will provide you context snippets from "The Almanack of Naval Ravikant" from a vecor database to help you answer the user's questions.
        Introduce youself to ${userName}. Don't mention context snippets when replying to user and only mention yourself by your first name.
        `,
      },
      ...(messages || [
        {
          role: "user",
          content: "Hi There!",
        },
      ]),
    ],
  });

  return response.data.choices[0].message?.content;
}
