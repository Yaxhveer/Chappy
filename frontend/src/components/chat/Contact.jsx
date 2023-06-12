import { useState, useEffect } from "react";

import { getUser } from "../../services/services";
import UserLayout from "../layout/UserLayout";

export default function Contact({ chatRoom, onlineUsersID, currentUser }) {
  const [contact, setContact] = useState();

  useEffect(() => {
    const contactID = chatRoom.members?.find(
      (member) => member !== currentUser.uid
    );

    const fetchData = async () => {
      const res = await getUser(contactID);
      setContact(res);
    };

    fetchData();
  }, [chatRoom, currentUser]);

  return <UserLayout user={contact} onlineUsersID={onlineUsersID} />;
}
