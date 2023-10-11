const ChatConfig = ({ favIconUrl, title }) => {

  return (
    <div className="w-full px-6 py-4 rounded-lg bg-default-100 flex flex-col items-center gap-2">
      <p className="text-xs text-default-500">You're chatting with</p>
      {favIconUrl && <img src={favIconUrl} alt={title} className="w-12 h-12 rounded-full" />}
      <h1 className="text-sm text-center font-medium">{title}</h1>
    </div>
  )
}

export default ChatConfig;