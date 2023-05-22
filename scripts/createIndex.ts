const dotenv = require("dotenv");

const { PineconeClient } = require("@pinecone-database/pinecone");

const langDoc = require("langchain/document");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { CharacterTextSplitter } = require("langchain/text_splitter");

dotenv.config();

/**
 * To execute, run: `ts-node scripts/createIndex.ts`
 *
 * Script for creating a new Pinecone index and uploading documents to it. A few things to keep in mind:
 * 1) You need to have a Pinecone account and have created an index and provide pinecone credentials
 * 2) install `npm install -g ts-node` globally so you can run this script
 * 3) I had to install `npm install pdf-parse` globally to get this to work
 * 4) langchain is an evolving library. You can look at the docs for latest changes: https://js.langchain.com/docs/
 *
 */

(async () => {
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  });

  // referencing index we want to upload to
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);

  // loading pdf
  const loader = new PDFLoader("./scripts/navalPdf.pdf", {
    splitPages: false,
  });
  const docs = await loader.load();

  // splitting pdf into chunks
  const splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // uploading chunks to pinecone
  await PineconeStore.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
    pineconeIndex,
  });
})();
