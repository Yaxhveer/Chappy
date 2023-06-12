import auth from "../config/firebase.js";

export const getAllUsers = async (req, res) => {
  const maxResults = 20;
  let users = [];

  try {
    const userRecords = await auth.listUsers(maxResults);

    userRecords.users.forEach((user) => {
      const { uid, email, displayName, photoURL } = user;
      users.push({ uid, email, displayName, photoURL });
    });
    console.log(3.1, `All users: ${users}`);
    res.status(200).json(users);
  } catch (e) {
    res.json({ done: false, message: e });
    console.log(3.1, e);
  }
};

export const getUser = async (req, res) => {
  try {
    console.log(3.2, req.params.userID);
    const userRecord = await auth.getUser(req.params.userID);

    const { uid, email, displayName, photoURL } = userRecord;

    console.log(3.2, `User: ${{ uid, email, displayName, photoURL }}`)
    res.status(200).json({ uid, email, displayName, photoURL });
  } catch (e) {
    res.json({ done: false, message: e });
    console.log(3.2, e);
  }
};
