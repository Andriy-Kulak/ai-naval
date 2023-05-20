import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { handleEnterKeyPress } from "@/utils";

const NameInput = ({ onEnter }: { onEnter: (name: string) => void }) => {
  const [name, setName] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Box width="100%">
      <FormControl id="name" mt={4}>
        <FormLabel>What is your name?</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={handleChange}
          onKeyDown={handleEnterKeyPress(() => {
            onEnter(name);
          })}
          placeholder="Enter your name"
        />
      </FormControl>
      <Button
        colorScheme="blue"
        onClick={() => onEnter(name)}
        isDisabled={!name.trim()}
      >
        Submit
      </Button>
    </Box>
  );
};

export default NameInput;
