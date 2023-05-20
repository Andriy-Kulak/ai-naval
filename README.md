## Tu Tutor

Weekend project where I learned how to use open ai chatpot, eleven labs, prompt engineering to have an ai tutor to speak with and improve my spanish! I took some inspiration & code from Aleem's [Espanol Love Repo](https://github.com/aleemrehmtulla/espanol-love) :-)

For more content, you can follow me on twitter [here](https://twitter.com/emergingbits)

### Setup

1. Grab an openai api key from [here](https://beta.openai.com/) and add it to your .env file
2. Grab an ElevenLabs api key from [here](https://beta.elevenlabs.io/speech-synthesis) and add it to your .env file
3. Clone a voice with ElevenLabs and add the model id to your .env file
4. Hit `npm install` to grab the necessary packages
5. Run `npm run dev` to start your server on `http://localhost:3000`

### Deploy to the world

1. Push all your changes to Github (or another git provider)
2. Head to vercel.app, import your repo, and hit deploy
3. Go to settings of the deployment, add your .env, and rebuild

### Other Useful Notes

When setting up eleven labs, you need to configure voices to get the proper `ELEVENLABS_VOICE_ID`

- https://docs.elevenlabs.io/api-reference/voices

Open AI has rate limits. This repo is using open ai 3.5. if you have access to 4.0, you can switch the model!

- https://platform.openai.com/account/rate-limits

To properly configure open ai for best experience, refer to deep learning course. Specifically I used chapter 8

- improve prompting with: https://learn.deeplearning.ai/chatgpt-prompt-eng/lesson/8/chatbot

Open AI does a fairly good job with translating but it's not perfect. Here is another provider for more precise translation:

- https://www.deepl.com/translator
