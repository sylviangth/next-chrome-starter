import ChatScrollAnchor from "./ChatScrollAnchor";
import MessageItem from "./MessageItem";

const ChatHistory = ({ messages, latestMessage, isLoading }) => {

  return (
    <ul className="flex flex-col gap-4 w-full divide-y">
      { messages.length > 0 ?
        messages.map((m, idx) => {
          if (m.role === 'user') {
            return (
              <li key={idx} className='w-full pt-4'>
                <div className='flex gap-4 items-start'>
                  <div className='flex-none w-8 h-8 rounded-full flex items-center justify-center text-indigo-600 bg-indigo-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                  </div>
                  <MessageItem
                    msgContent={m.content}
                  />
                </div>
              </li>
            )
          } else {
            return (
              <li key={idx} className="w-full pt-4">
                <div className='w-full flex gap-4 items-start'>
                  <img
                    alt="Mindie Avatar"
                    src="/icons/icon48.png"
                    className="flex-none w-8 h-8 rounded-full"
                    width={100}
                    height={100}
                  />
                  <MessageItem
                    msgContent={m.content}
                  />
                </div>
              </li>
            )
          }
        })
        : (
          <div className='w-full flex items-center justify-center text-center'>
            <p className='text-gray-400 text-sm'>No messages so far to display.</p>
          </div>
        )
      }
      { latestMessage !== "" && (
        <li className="w-full pt-4">
          <div className='w-full flex gap-4 items-start'>
            <img
              alt="Mindie Avatar"
              src="/icons/icon48.png"
              className="flex-none w-8 h-8 rounded-full"
              width={100}
              height={100}
            />
            <MessageItem
              msgContent={latestMessage}
            />
          </div>
        </li>
      ) }
      <ChatScrollAnchor trackVisibility={isLoading || (messages ? true : false)} />
    </ul>
  )
}

export default ChatHistory;