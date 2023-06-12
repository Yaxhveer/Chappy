import auth from '../config/firebase.js';

export const VerifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodeValue = await auth.verifyIdToken(token)
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (e) {
    return res.json({ message: e });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decodeValue = await auth.verifyIdToken(token)
    if (decodeValue) {
      socket.user = decodeValue;
      return next();
    }
  } catch (e) {
    next(new Error("Internal Error"))
  }
};

