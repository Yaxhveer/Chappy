import express from "express";
import {createMessage, getMessages} from '../controllers/message.js'
import { param } from "express-validator";

const router = express.Router();

router.post('/', createMessage);
router.get('/:chatRoomID', param('chatRoomID').notEmpty().escape(), getMessages);

export default router;