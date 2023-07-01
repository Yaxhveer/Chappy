import { useEffect, useRef, useState } from "react";

import { getAllUsers, getChatRoom, socketConnection, deleteChatRoom } from "../../services/services";
import { useAuth } from "../../contexts/AuthContext";

import ChatRoom from "../chat/ChatRoom";
import Welcome from "../chat/Welcome";
import AllUsers from "../chat/AllUsers";
import SearchUsers from "../chat/SearchUsers";

export default function ChatLayout() {
  const [users, SetUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [currentChat, setCurrentChat] = useState();
  const [onlineUsersID, setonlineUsersID] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const socket = useRef();
  
  const allUserRef = useRef();
  const chatRoomRef = useRef();


  const { currUser, setError } = useAuth();

  useEffect(() => {
    const getSocket = async () => {
      const res = await socketConnection();
      socket.current = res;
      socket.current.emit("addUser", currUser?.uid);
      socket.current.on("getUsers", (users) => {
        const userID = users?.map((u) => u[0]);
        setonlineUsersID(userID);
      });
    };

    getSocket();
  }, [currUser.uid]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getChatRoom(currUser?.uid);
      console.log("chatroom: ",res);
      setChatRooms(res);
    };

    fetchData();
  }, [currUser.uid, currentChat]);

  useEffect(() => {
    setError("");
    
    const fetchData = async () => {
      const res = await getAllUsers();
      console.log("allUsers: ", res);
      SetUsers(res);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
    setFilteredRooms(chatRooms);
  }, [users, chatRooms]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery);

    const searchedUsers = users?.filter((user) => {
      return user.displayName
        .toLowerCase()
        .includes(newSearchQuery.toLowerCase());
    });
    setFilteredUsers(searchedUsers);
  };

  const handleOpenChat = () => {
    allUserRef.current.classList.add("hidden");
    chatRoomRef.current.classList.remove("hidden");
  }

  const handleReturn = () => {
    chatRoomRef.current.classList.add("hidden");
    allUserRef.current.classList.remove("hidden");
  }

  const handleDeleteChat = async () => {
    await deleteChatRoom(currentChat.chat_room_id);
    setCurrentChat();
    handleReturn();
  }

  return (
    <div className="box-border mx-auto">
      <div className="ss:w-auto min-w-full bg-zinc-200 border-x border-b border-zinc-400 dark:bg-zinc-900 dark:border-zinc-700 rounded ss:grid ss:grid-cols-3">
        <div ref={allUserRef} className="flex flex-col bg-zinc-200 border-r border-zinc-400 dark:bg-zinc-900 dark:border-zinc-700 lg:col-span-1 ss:block">
          <SearchUsers handleSearch={handleSearch} />

          <AllUsers
            users={searchQuery !== "" ? filteredUsers : users}
            chatRooms={searchQuery !== "" ? filteredRooms : chatRooms}
            setChatRooms={setChatRooms}
            onlineUsersID={onlineUsersID}
            currentUser={currUser}
            changeChat={handleChatChange}
            handleOpenChat={handleOpenChat}
          />
        </div>
        <div ref={chatRoomRef} className="col-span-2 ss:block hidden ">
        {currentChat ? (
          <ChatRoom
            currentChat={currentChat}
            currentUser={currUser}
            socket={socket}
            handleDeleteChat={handleDeleteChat}
            handleReturn={handleReturn}
          />
        ) : (
          <Welcome />
        )}
        </div>
      </div>
    </div>
  );
}