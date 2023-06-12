import { useState, useEffect } from "react";

import { createChatRoom } from "../../services/services";
import Contact from "./Contact";
import UserLayout from "../layout/UserLayout";

export default function AllUsers({ users, chatRooms, setChatRooms, onlineUsersID, currentUser, changeChat, handleOpenChat}) {
  const [selectedChat, setSelectedChat] = useState();
  const [nonContacts, setNonContacts] = useState([]);
  const [contactIDs, setContactIDs] = useState([]);

  useEffect(() => {
    const IDs = chatRooms?.map((chatRoom) => {
      return chatRoom?.members?.find((member) => member !== currentUser.uid);
    });
    setContactIDs(IDs);
  }, [chatRooms, currentUser?.uid]);

  useEffect(() => {
    setNonContacts(
      users?.filter(
        (f) => f.uid !== currentUser?.uid && !contactIDs.includes(f.uid)
      )
    );
  }, [contactIDs, users, currentUser?.uid]);

  const changeCurrentChat = (index, chat) => {
    setSelectedChat(index);
    changeChat(chat);
    handleOpenChat(chat)
  };

  const handleNewChatRoom = async (user) => {
    const res = await createChatRoom(currentUser.uid, user.uid);
    setChatRooms((prev) => [...prev, res]);
    changeChat(res);
    handleOpenChat(res);
  };

  return (
    <>
      <ul className="overflow-auto h-fit">
        <h2 className="my-2 mb-2 ml-2 text-zinc-900 dark:text-white">ChatRooms</h2>
        <li>
          {chatRooms?.map((chatRoom, index) => (
            <div
              key={index}
              className={
                index === selectedChat
                  ? "bg-zinc-300 dark:bg-zinc-700 flex items-center px-3 py-2 text-sm"
                  : "transition duration-150 ease-in-out cursor-pointer bg-zinc-200 border-b border-zinc-400 hover:bg-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-700 flex items-center px-3 py-2 text-sm"
              }
              onClick={() => changeCurrentChat(index, chatRoom)}
            >
              <Contact
                chatRoom={chatRoom}
                onlineUsersID={onlineUsersID}
                currentUser={currentUser}
              />
            </div>
          ))}
        </li>
        <h2 className="my-2 mb-2 ml-2 text-zinc-900 dark:text-white">
          Other Users
        </h2>
        <li>
          {nonContacts?.map((nonContact, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-2 text-sm bg-zinc-200 border-b border-zinc-400 hover:bg-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-700 cursor-pointer"
              onClick={() => handleNewChatRoom(nonContact)}
            >
              <UserLayout user={nonContact} onlineUsersID={onlineUsersID} />
            </div>
          ))}
        </li>
      </ul>
    </>
  );
}
