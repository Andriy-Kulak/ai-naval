import * as dotenv from "dotenv";
import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { Document } from "langchain/document";
dotenv.config();

import { PineconeClient } from "@pinecone-database/pinecone";

const pineconeStore = async () => {
  const pinecone = new PineconeClient();
  const embedder = new OpenAIEmbeddings();

  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT as string,
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX as string);

  const pineconeStore = await PineconeStore.fromExistingIndex(embedder, {
    pineconeIndex,
  });

  return pineconeStore;
};

export default pineconeStore;
