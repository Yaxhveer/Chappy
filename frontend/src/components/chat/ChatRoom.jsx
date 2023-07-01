import { useState, useEffect, useRef } from "react";

import { getMessages, sendMessage } from "../../services/services";

import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({ currentChat, currentUser, socket, handleDeleteChat, handleReturn}) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);

  const scrollRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMessages(currentChat.chat_room_id);
      setMessages(res);
    };

    fetchData();
  }, [currentChat.chat_room_id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setIncomingMessage({
        message_data: data.message,
        sender: data.senderID,
        time_id: data.time
      });
    });
  }, [socket]);

  useEffect(() => {
    incomingMessage && setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage]);

  const handleFormSubmit = async (message) => {
    const receiverID = currentChat.members.find(
      (member) => member !== currentUser.uid
    );

    const res = await sendMessage(message, currentChat.chat_room_id, currentUser.uid);
    setMessages([...messages, res]);

    socket.current.emit("sendMessage", {
      senderID: currentUser.uid,
      receiverID: receiverID,
      message: message,
      time: res.time_id
    });
  };

  return (
    <>
      <div className="w-full">
        <div className="p-3 bg-zinc-200 border-b border-zinc-400 dark:bg-zinc-900 dark:border-zinc-700">
          <div className="flex justify-between">
            <div className="flex">
              <button
                type="button"
                  className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none rounded-lg text-sm p-2.5"
                  onClick={handleReturn}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <Contact chatRoom={currentChat} currentUser={currentUser} />
            </div>
            <button
              type="button"
              className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none rounded-lg text-sm p-2.5"
              onClick={handleDeleteChat}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative w-full p-6 overflow-y-auto h-[30rem] bg-zinc-200 border-b border-zinc-400 dark:bg-zinc-900 dark:border-zinc-700">
          <ul className="space-y-2">
            { messages?.map((message, index) => (
              <div key={index} ref={scrollRef}>
                <Message message={message} self={currentUser.uid} />
              </div>
            ))}
          </ul>
        </div>

        <ChatForm handleFormSubmit={handleFormSubmit} currentChat={currentChat}/>
      </div>
    </>
  );
}
