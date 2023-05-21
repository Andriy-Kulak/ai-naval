## Research Project Creating AI Ravikant

This is a weekend project where I learned how to use open ai chatbot, langchain-js, elevenlabs, prompt engineering & using extra information like books to improve the experience when talking to chatbot.

I used the book, "ALMANACK OF NAVAL RAVIKANT" to create a vector database and index the data.

**This project is not related to real Naval Ravikant and is a research project only**

The way this app works is when the user asks a question, we look through the vector database and provide 4 most relevant context snippets from the book that are each 2,000 characters long and send it to open ai as additional context so that it can provide a better response

For more content, you can follow me on twitter [here](https://twitter.com/emergingbits)

### Setup

1. Grab an openai api key from [here](https://beta.openai.com/) and add it to your `.env` file that you will want to create in root folder
2. Grab an ElevenLabs api key from [here](https://beta.elevenlabs.io/speech-synthesis) and add it to your .env file
3. Clone a voice with ElevenLabs and add the model id to your .env file
4. Hit `npm install` to grab the necessary packages
5. Go to [pinecone](https://www.pinecone.io/) and create an index with these parameters:

- euclidian algo
- 1536 dimensions

When you finish that, you need to add vars with those values `PINECONE_ENVIRONMENT=`, `PINECONE_API_KEY=`
and `PINECONE_INDEX={name of index you created}`

6. If you don't have `ts-node` or `pdf-parse` installed, please install globally so you can run script to add indexing to pinecone

`npm install -g ts-node pdf-parse`

7. I ran the script to add indexing to pinecone `ts-node scripts/createIndex.ts`. Feel free to adjust it for your needs. You can use all kinds of file types including txt, pdf, etc.

8. Run `npm run dev` to start your server on `http://localhost:3000`

### Deploy to the world

1. Push all your changes to Github (or another git provider)
2. Head to vercel.app, import your repo, and hit deploy
3. Go to settings of the deployment, add your .env, and rebuild

### Other Useful Notes

1. Langchain docs: https://js.langchain.com/docs/

- great documentation for interacting with pinecone

2. When setting up eleven labs, you need to configure voices to get the proper `ELEVENLABS_VOICE_ID`

- https://docs.elevenlabs.io/api-reference/voices

3. Open AI has rate limits. This repo is using open ai 3.5. if you have access to 4.0, you can switch the model!

- https://platform.openai.com/account/rate-limits

To properly configure open ai for best experience, refer to deep learning course. Specifically I used chapter 8

- improve prompting with: https://learn.deeplearning.ai/chatgpt-prompt-eng/lesson/8/chatbot

4. Open AI does a fairly good job with translating but it's not perfect. Here is another provider for more precise translation:

- https://www.deepl.com/translator

### More docs

- https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone

## To Do

- update voice
- rename api
