import React from 'react'

type ChatContentProps = {
  messages: Message[];
};

const ChatContent = ({ messages }: ChatContentProps) => {
  return (
    <div className="max-h-96 h-64 px-6 py-1 overflow-auto border-[1px] rounded-[8px] border-black p-2">
      {messages?.map((message: Message, index: number) => (
        <div
          key={index}
          className={`py-2 flex flex-row w-full ${
            message.origin === 'self' ? "justify-end" : "justify-start"
          }`}
        >
          
          <div className={`${message.origin === 'self' ? "order-2" : "order-1"}`}>
            {
              message.origin === 'self' ? <div className="order-1 ml-2">You</div> : <div className="order-2 mr-2">Rec</div>
            }
          </div>
          <div
            className={`px-2 w-fit py-3 flex flex-col bg-[#39A7FF] rounded-lg text-white ${
              message.origin === 'self' ? "order-1 mr-2" : "order-2 ml-2"
            }`}
          >
            <span className="text-xs text-gray-200">
              {message.from.split(':')[1]}&nbsp;-&nbsp;
              {new Date(Number(message.timestamp)).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
            <span className="text-md">{message.message.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContent;
