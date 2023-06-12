import express from "express";
import { createChatRoom, getChatRoom, deleteChatRoom } from '../controllers/chatRoom.js'
import { param } from 'express-validator'

const router = express.Router();

router.post('/', createChatRoom);
router.get('/:userID', param('userID').notEmpty().escape(), getChatRoom);
router.delete('/:chatRoomID', param('chatRoomID').notEmpty().escape(), deleteChatRoom);
// router.get('/:firstUserID/:secondUserID', getChatRoomOfUsers);

export default router;