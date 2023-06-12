import { useState, useEffect, useRef } from "react";

import Picker from "emoji-picker-react";

export default function ChatForm({ handleFormSubmit }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiObject, event) => {
    let newMessage = message + emojiObject.emoji;
    setMessage(newMessage);
  };

  const handleChatFormSubmit = async (e) => {
    e.preventDefault();

    await handleFormSubmit(message);
    setMessage("");
  };

  return (
    <div ref={scrollRef} className="relative">
      {showEmojiPicker && (
        <div className="dark:bg-zinc-900 absolute bottom-20 left-2"><Picker onEmojiClick={handleEmojiClick} width={280} height={360}/></div>
      )}
      <form onSubmit={handleChatFormSubmit}>
        <div className="flex items-center justify-between w-full p-3 bg-zinc-200 border-b border-zinc-400 dark:bg-zinc-900 dark:border-zinc-700">
          <button type='button'
            className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none rounded-lg text-sm p-2.5"
            onClick={(e) => {
              e.preventDefault();
              setShowEmojiPicker(!showEmojiPicker);
            }} 
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>

          </button>

          <input
            type="text"
            placeholder="Write a message"
            className="block w-full py-2 pl-4 mx-3 outline-none bg-zinc-200 border border-zinc-400 text-zinc-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-900 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none rounded-lg text-sm p-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
