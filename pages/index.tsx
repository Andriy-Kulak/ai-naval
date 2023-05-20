import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { FaMicrophone, FaTwitter } from "react-icons/fa";
import Beatloader from "react-spinners/BeatLoader";
import base64ToBlob from "@/utils/basetoblob";
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  Text,
  Textarea,
  VStack,
  useToast,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { handleEnterKeyPress } from "@/utils";
import NameInput from "@/components/NameInput";
import { Message } from "@/types";
import useIsChrome from "@/hooks/useIsChrome";

let SpeechRecognition: { new (): SpeechRecognition };

if (typeof window !== "undefined") {
  SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
}

function Home() {
  const isChrome = useIsChrome();
  const micRef = useRef<SpeechRecognition>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const toast = useToast();

  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition | null>(null);

  // on the first translate, we need to get the user's name
  // on subsequent translates, we can use the name from state
  const translate = async (props?: { name?: string }) => {
    if (!text && !props?.name)
      return toast({
        title: "Enter text to translate first!",
        status: "error",
      });

    if (!userName && !props?.name)
      return toast({
        title: "Enter your name first!",
        status: "error",
      });

    const message = { role: "user", content: text };

    if (!props?.name) {
      addMessage({ role: "user", content: text });
      setText("");
    }

    if (!audioRef.current)
      return toast({ title: "Error enabling audio", status: "error" });

    setLoading(true);

    // response for chat gpt
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, message],
        userName: userName || props?.name,
      }),
    });

    const { audioDataBase64, translatedText } = await response.json();

    addMessage({ role: "assistant", content: translatedText });

    const audioBlob = base64ToBlob(audioDataBase64, "audio/mpeg");
    const audioURL = URL.createObjectURL(audioBlob);

    audioRef.current.src = audioURL;
    await audioRef.current.play();

    setText("");

    try {
      setLoading(false);
    } catch (e: any) {
      console.log("Error:", e.message);
    }
  };

  // this is a hack to allow mobile browsers to play audio without user interaction
  const startAudioForPermission = async () => {
    if (!audioRef.current) return;
    await audioRef.current.play();
  };

  // testing
  const handleListen = async (mic: any) => {
    if (!SpeechRecognition)
      return alert("Speech recognition is not available in your browser.");

    mic.continuous = true;
    mic.interimResults = true;
    mic.lang = "es-ES";

    if (isListening) mic.start();
    if (!isListening) mic.stop();

    mic.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setText(transcript);
      mic.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.log(event.error);
      };
    };
  };

  useEffect(() => {
    const mic = new SpeechRecognition();

    micRef.current = mic;

    const audio = new Audio();
    audioRef.current = audio;

    return () => {
      mic.stop();
    };
  }, []);

  useEffect(() => {
    handleListen(micRef.current);
  }, [isListening]);

  const userBgColor = useColorModeValue("blue.500", "blue.300");
  const assistantBgColor = useColorModeValue("gray.100", "gray.700");
  const userColor = "white";
  const assistantColor = "black";

  const [userName, setUserName] = useState<null | string>(null);

  const assistantName = "Tutor";

  return (
    <>
      <Head>
        <title>tu tutor</title>
      </Head>
      <VStack pt={40} px={4} spacing={4} h="100vh" maxW="600px" mx="auto">
        <Heading as="h1" color="black">
          Your Tutor in Spanish
        </Heading>
        <Text color="black">
          Start a conversation with AI tutor in Spanish. For more tutorials &
          content, you can follow me on Twitter{" "}
          <Link
            href="https://twitter.com/emergingbits"
            color="#1DA1F2"
            isExternal
          >
            <Icon as={FaTwitter} fontSize="md" />
          </Link>
        </Text>
        <Text color="black" as="i">
          <b> Microphone works well in Google Chrome only (for now).</b>
        </Text>

        {!userName ? (
          <NameInput
            onEnter={(name) => {
              startAudioForPermission();
              setUserName(name);
              translate({ name });
            }}
          />
        ) : (
          <>
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              <audio ref={audioRef} />;
              return (
                <Box
                  key={index}
                  alignSelf={isUser ? "flex-end" : "flex-start"}
                  backgroundColor={isUser ? userBgColor : assistantBgColor}
                  color={isUser ? userColor : assistantColor}
                  borderRadius="lg"
                  px={4}
                  py={2}
                  maxWidth="70%"
                  position="relative"
                >
                  <Text
                    fontSize="xs"
                    position="absolute"
                    color="black"
                    top={-4}
                    left={2}
                  >
                    {isUser ? userName : assistantName}
                  </Text>
                  <Text fontSize="sm">{message.content}</Text>
                </Box>
              );
            })}
            <VStack w="100%" spacing={4}>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleEnterKeyPress(() => {
                  translate();
                })}
              />
            </VStack>

            <HStack w="100%" spacing={4}>
              <Button
                h={9}
                variant="outline"
                onClick={() => {
                  translate();
                }}
                isLoading={loading}
                spinner={<Beatloader size={8} />}
              >
                Send
              </Button>
              {isChrome && (
                <Icon
                  as={FaMicrophone}
                  cursor="pointer"
                  color={isListening ? "red.500" : "gray.500"}
                  onClick={() => {
                    if (isListening === true) {
                      translate();
                    }
                    setIsListening(!isListening);
                    setText("");
                  }}
                />
              )}
            </HStack>
          </>
        )}
      </VStack>
    </>
  );
}

export default Home;
