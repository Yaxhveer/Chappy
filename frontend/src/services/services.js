import { app } from '../config/firebase'
import { getAuth } from 'firebase/auth'
import { io } from 'socket.io-client'

const auth = getAuth(app);

const url = "http://localhost:8000";

export const getUserToken = async () => {
    const user = auth.currentUser;
    const token = user && ( await user.getIdToken());
    return token;
}

export const socketConnection = async () => {
    const tk = await getUserToken();

    const socket = io(url,{
        auth: {
            token : tk
        }
    });

    return socket;
}

const getHeaders = async () => {
  const token = await getUserToken();

  const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  return headers;
};

export const getAllUsers = async () => {
    const header = await getHeaders();

    try {
        const res = await fetch(`${url}/user`, {
            method: "GET",
            headers: header
        })
        return res.json();
    } catch (e) {
        console.error(e);
   }
};

export const getUser = async (userID) => {
    const header = await getHeaders();
    try {
        const res = await fetch(`${url}/user/${userID}`, {
            method: "GET",
            headers: header
        })
        return res.json();
    } catch (e) {
        console.error(e);
    }
};

export const getChatRoom = async (userID) => {
    const header = await getHeaders();
    try {
        const res = await fetch(`${url}/room/${userID}`, {
            method: "GET",
            headers: header
        })
        return res.json();
    } catch (e) {
        console.error(e);
    }
}

export const deleteChatRoom = async (chatRoomID) => {
    const header = await getHeaders();
    try {
        const res = await fetch(`${url}/room/${chatRoomID}`, {
            method: "DELETE",
            headers: header
        })
        return res.json();
    } catch (e) {
        console.error(e);
    }
}

// export const getChatRoomUsers = async (firstUserID, secondUserID) => {
//     const header = await getHeaders();
//     try {
//         const res = await fetch(`${url}/room/${firstUserID}/${secondUserID}`, {
//             method: "GET",
//             headers: header
//         })
//         return res.json();
//     } catch (e) {
//         console.error(e);
//     }
// }

export const createChatRoom = async (firstUserID, secondUserID) => {
    const header = await getHeaders();
    const users = {firstUserID: firstUserID, secondUserID: secondUserID};
    try {
        const res = await fetch(`${url}/room`, {
            method: "POST",
            headers: header,
            body: JSON.stringify(users)
        })
        return res.json();
    } catch (e) {
        console.error(e);
    }
}

export const getMessages = async (chatRoomID) => {
    const header = await getHeaders();
    try {
        const res = await fetch(`${url}/message/${chatRoomID}`, {
            method: "GET",
            headers: header,
        })
        return res.json();
    } catch (e) {
        console.error(e);
    }
}

export const sendMessage = async (msg, chat_room_id, userID) => {
    const header = await getHeaders();
    const data = {msg: msg, chatRoomID:chat_room_id, userID: userID};
    try {
        const res = await fetch(`${url}/message`, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data)
        })
        return res.json();
    } catch (e) {
        console.error(e);
    }
}