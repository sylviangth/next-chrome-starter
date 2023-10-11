import { useEffect, useState } from "react";
import ChatHistory from "./ChatHistory";
import SendPanel from "./SendPanel";
import ChatConfig from "./ChatConfig";
import SuggestedQueries from "./SuggestedQueries";

const ChatWindow = ({ fetchQueriesCount, licenseKey, apiKey, queriesCount }) => {
  
  // SETUP

  const [ currentUrl, setCurrentUrl ] = useState("");
  const [ currentWebTitle, setCurrentWebTitle ] = useState("");
  const [ currentFavIconUrl, setCurrentFavIconUrl ] = useState("");

  const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  useEffect(() => {
    getCurrentTab()
      .then((result) => {
        setCurrentUrl(result.url);
        setCurrentWebTitle(result.title);
        setCurrentFavIconUrl(result.favIconUrl);
      })
      .catch((error) => console.error(error))
  }, [])

  // CHAT

  const [ messages, setMessages ] = useState([]);
  const [ input, setInput ] = useState("");
  const [ result, setResult ] = useState("");
  const [ isLoadingResponse, setIsLoadingResponse ] = useState(false);

  const handleSaveMessage = (role, content) => {
    console.log(role, content);
    const newMessage = {
      role: role,
      content: content
    }
    chrome.storage.local
    .get([currentUrl])
    .then((result) => {
      console.log("Get updated chat history");
      if (result[currentUrl]) {
        chrome.storage.local.set({ [currentUrl]: JSON.stringify([...JSON.parse(result[currentUrl]), newMessage]) })
          .then(() => {
            fetchChatHistory();
          });
      } else {
        chrome.storage.local.set({ [currentUrl]: JSON.stringify([newMessage]) })
          .then(() => {
            fetchChatHistory();
          });
      }
    });
  }

  const fetchChatHistory = () => {
    chrome.storage.local.get([currentUrl]).then((result) => {
      if (result[currentUrl]) {
        console.log(JSON.parse(result[currentUrl]));
        setMessages(JSON.parse(result[currentUrl]));
      }
    })
  }

  useEffect(() => {
    if (currentUrl) {
      fetchChatHistory();
    }
  }, [currentUrl])

  const handleSubmit = (query) => {
    // Save user message with input
    handleSaveMessage("user", query);
    setIsLoadingResponse(true);
    getContext(query)
      .then((context) => {
        getChatResponse(query, context)
          .then(() => {
            setIsLoadingResponse(false);
            fetchQueriesCount();
          })
          .catch((error) => {
            console.error(error);
            setIsLoadingResponse(false);
          })
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingResponse(false);
      })
  }

  const getContext = async (userQuery) => {
    const scrapeAll = false;
    const apiUrl = `https://fymvbnibdm.us-west-2.awsapprunner.com/api/context/get-context-from-url?openai_api_key=${apiKey}&query=${userQuery}&url=${currentUrl}&scrape_all=${scrapeAll}`;
    console.log(apiUrl);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.context;
    } catch (error) {
      throw error;
    }
  }

  const getChatResponse = async (query, context) => {
    setInput("");
    setResult("");

    let url = "https://api.openai.com/v1/chat/completions";
    let data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a world-class algorithm to answer questions."
        },
        ...messages,
        {
          role: "user",
          content: `
          Based on the following context, answer the following question:
          ## CONTEXT: ${context}
          ## QUESTION: ${query}
          `
        }
      ],
      stream: true,
      max_tokens: 300,
      temperature: 0.5
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.error("Error:", response.statusText);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let text = "";

    let resultString = ""; // Define resultString here to collect all results

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      text += decoder.decode(value, { stream: true });
      const lines = text.split("\n");
      text = lines.pop();

      for (const line of lines) {
        const message = line.replace(/^data: /, "").trim();

        if (message === "") {
          continue;
        }

        if (message === "[DONE]") {
          /*setResult((prev) => {
            let result = processString(prev);
            console.log(result);
            return result;
          });*/
          handleSaveMessage("assistant", resultString);
          setResult("");
          return;
        }

        try {
          const parsed = JSON.parse(message);
          let result = parsed.choices[0].delta.content || "";
          resultString += result;
          setResult(resultString);
        } catch (error) {
          console.error("Could not JSON parse stream message", {
            message,
            error
          });
        }
      }
    }
  }
 
  return (
    <section className="px-6 w-full h-[32rem] flex flex-col justify-between gap-4 overflow-hidden overflow-y-auto">

      <div className="w-full flex flex-col gap-4">

        <ChatConfig
          favIconUrl={currentFavIconUrl}
          title={currentWebTitle}
        />

        <ChatHistory 
          messages={messages} 
          latestMessage={result} 
          isLoading={isLoadingResponse} 
        />

        <SuggestedQueries
          isLoading={isLoadingResponse}
          disabled={!apiKey || (!licenseKey && queriesCount > 20)}
          previousMessages={messages.filter(m => m.role === 'user')}
          setInput={setInput}
          handleSubmit={handleSubmit}
        />

      </div>

      <SendPanel
        input={input} setInput={setInput}
        licenseKey={licenseKey}
        apiKey={apiKey}
        queriesCount={queriesCount}
        handleSubmit={handleSubmit}
        isLoading={isLoadingResponse}
      />

    </section>
  );
}

export default ChatWindow;