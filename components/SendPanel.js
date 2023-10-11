import { useRef, useEffect } from "react";
import { Button, Link, Progress, Textarea } from '@nextui-org/react';
import { CHECKOUT_URL } from "./LicenseKeyInput";

const SendPanel = ({ input, setInput, licenseKey, apiKey, queriesCount, handleSubmit, isLoading }) => {

  const formRef = useRef(null);

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    } 
  }

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(input);
      }}
      ref={formRef}
      className="relative sticky bottom-6 flex flex-col gap-3"
    >

      <div className="w-full h-full flex flex-col items-center bg-white px-3 py-2 rounded-xl shadow-lg border-2 border-primary">

        {!licenseKey && queriesCount > 20 && (
          <p className="text-danger text-center">
            Oh no, you're out of free queries! <Link href={CHECKOUT_URL} className='font-bold' isExternal showAnchorIcon>Buy a license key here</Link> to unlock unlimited queries.
          </p>
        )}

        {!apiKey && (
          <p className="text-danger text-center">
            Oops! Looks like you forgot to enter your OpenAI API key in the Settings tab. Please do so to continue using Mindie.
          </p>
        )}

        <div className="w-full flex items-center gap-3">
          { isLoading ? (
            <Progress
              size="sm"
              isIndeterminate
              aria-label="Loading..."
              className='w-full'
            /> 
          ) : (
            <div className='w-full flex items-center gap-3'>
              <Textarea
                rows={1} minRows={1} radius="sm"
                onKeyDown={handleKeyDown}
                placeholder="Ask Mindie anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          )}
          <Button 
            variant='shadow' color={(!input || !input.trim()) ? "default" : "success"} radius="sm" className='text-white'
            endContent={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="flex-none w-3 h-3 bi bi-send" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
              </svg>
            }
            isDisabled={!input || !input.trim() || !apiKey || (!licenseKey && queriesCount > 20)}
            onClick={() => void handleSubmit(input)}
          >
            Send
          </Button>
        </div>

      </div>

    </form>
  )
}

export default SendPanel;