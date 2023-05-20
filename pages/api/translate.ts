import { Message } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
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
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [
      {
        role: "system",
        content: `Imagine you are a spanish teacher having conversation with a student that is looking to improve their spanish. User will start the conversion with you and you will respond to them and ask about them. If they user asks you a question, you can help them restructure the question in spanish and continue the conversion. The user's name is ${userName}.`,
      },
      ...messages,
    ],
  });

  return response.data.choices[0].message?.content;
}
