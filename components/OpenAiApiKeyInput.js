import { Button, Input, Link } from "@nextui-org/react";
import { useState, useEffect } from "react";

const validateOpenAiApiKey = async (openAiApiKey) => {

  let url = "https://api.openai.com/v1/chat/completions";
  let data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Hello",
      }
    ],
    max_tokens: 100,
    temperature: 0.2
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    return false;
  }

  return true;
};

const OpenAiApiKeyInput = ({ apiKey, fetchApiKey }) => {
  
  const [ keyInput, setKeyInput ] = useState(apiKey || "");
  const [ error, setError ] = useState(null);
  const [ keyEditable, setKeyEditable ] = useState(false);

  const handleSaveKey = async () => {
    setError(null);
    const isValidKey = await validateOpenAiApiKey(keyInput);
    if (!isValidKey) {
      console.log("Invalid OpenAI API Key.");
      setError("Invalid OpenAI API Key.");
      return;
    } else {
      chrome.storage.local.set({ "openAiApiKey": keyInput }).then(() => {
        fetchApiKey();
      });
    }
  }

  const handleDeleteKey = () => {
    chrome.storage.local.remove(["openAiApiKey"]).then(() => {
      fetchApiKey();
    });
  }

  return (
    <>
      {
        apiKey ? (
          <div className="flex flex-col gap-4 w-full">
            <p className="w-full text-sm">
              Your API keys are stored LOCALLY in your browser. No one, including Mindie team, can access your keys.
            </p>
            <Input
              isDisabled={!keyEditable}
              type={keyEditable ? "text" : "password"}
              label="Your OpenAI API Key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full" radius="sm"
            />
            {
              !keyEditable ? (
                <div className="flex gap-2">
                  <Button 
                    size="md" radius="sm" color="primary" variant="flat"
                    onClick={() => setKeyEditable(true)}
                  >
                    Change key
                  </Button>
                  <Button 
                    size="md" radius="sm" color="danger" variant="flat"
                    onClick={handleDeleteKey}
                  >
                    Delete key
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    size="md" radius="sm" color="primary" variant="flat"
                    disabled={!keyInput || !keyInput.trim()}
                    onClick={() => void handleSaveKey()}
                  >
                    Save
                  </Button>
                  <Button 
                    size="md" radius="sm" color="danger" variant="flat"
                    onClick={() => setKeyEditable(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )
            }
            {error && <p className="text-danger">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <p className="w-full px-4 py-2.5 rounded-md font-medium text-sm text-default-600 bg-default-100">
              Your API keys are stored LOCALLY in your browser. No one, including Mindie team, can access your keys.
            </p>
            <div className="text-sm w-full flex items-center gap-2">
              <h3>
                Don&apos;t have a key?
              </h3>
              <Link
                href="https://platform.openai.com/account/api-keys"
                className="text-sm font-bold text-primary hover:text-primary-400"
                isExternal
                showAnchorIcon
              >
                Generate one here
              </Link>
            </div>
            <Input
              type={"text"}
              label="Input a valid OpenAI API Key"
              value={keyInput}
              onValueChange={setKeyInput}
              className="w-full" radius="sm"
            />
            {error && <p className="text-danger">{error}</p>}
            <div className="flex gap-2">
              <Button 
                size="md" radius="sm" color="primary" variant="flat"
                disabled={!keyInput || !keyInput.trim()}
                onClick={() => void handleSaveKey()}
              >
                Save
              </Button>
            </div>
          </div>
        )
      }
    </>
  )
}

export default OpenAiApiKeyInput;