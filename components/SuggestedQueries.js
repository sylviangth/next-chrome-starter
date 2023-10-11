import { useEffect, useState } from "react";
import { RadioGroup, useRadio, VisuallyHidden, cn } from "@nextui-org/react";

export const CustomRadio = (props) => {
  const {
    Component,
    children,
    getBaseProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        `cursor-pointer border-2 border-default rounded-lg`,
        "data-[selected=true]:border-primary",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div {...getLabelWrapperProps()} className="px-3 py-1.5">
        {children && <span {...getLabelProps()} className={`flex items-center gap-3 text-sm`}>{children}</span>}
      </div>
    </Component>
  );
}

const getRelatedQueries = async (openAiApiKey, previousQueries) => {
  const url = `https://fymvbnibdm.us-west-2.awsapprunner.com/api/queries/get-related-queries?openai_api_key=${openAiApiKey}&previous_queries=${previousQueries}`;

  const headers = {
    Accept: 'application/json'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json', // Specify content type
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse response JSON
    return responseData.question;
  } catch (error) {
    console.log(error);
    console.error(error);
  }
};


const SuggestedQueries = ({ isLoading, disabled, previousMessages, setInput, handleSubmit }) => {
  
  const [ queries, setQueries ] = useState([]);

  const [ apiKey, setApiKey ] = useState(null);
  const fetchApiKey = () => {
    chrome.storage.local.get(["openAiApiKey"]).then((result) => {
      if (result["openAiApiKey"]) {
        setApiKey(result["openAiApiKey"]);
      }
    })
  }
  useEffect(() => {
    fetchApiKey();
  }, [])

  useEffect(() => {
    if (!isLoading && !disabled) {
      if (queries.length === 0 && previousMessages.length === 0) {
        setQueries([ "Summarize this" ])
      } else if ((queries.length === 0 || (queries.length === 1 && queries[0] === "Summarize this")) && apiKey && previousMessages.length > 0) {
        console.log("Called");
        getRelatedQueries(apiKey, previousMessages.map(m => m.content).join(", "))
          .then((data) => {
            if (data) {
              setQueries(data);
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }
  }, [queries, previousMessages, apiKey, disabled])

  const handleSelectQuery = (selectedIdx) => {
    setInput(queries[Number(selectedIdx)]);
    setQueries([]);
    handleSubmit(queries[Number(selectedIdx)]);
  }

  return (
    <section className="w-full pb-16">
      {(!disabled && !isLoading && queries.length > 0) && (
        <RadioGroup 
          label={previousMessages.length > 0 ? "Ask a follow-up question" : "Try asking"}
          orientation="horizontal"
          className="w-full flex flex-col items-start text-base px-2"
          onValueChange={handleSelectQuery}
        >
          { queries.map((item, idx) => (
            <CustomRadio key={idx} value={idx}>{item}</CustomRadio>
          ))}
        </RadioGroup>
      )}
    </section>
  )
}

export default SuggestedQueries;