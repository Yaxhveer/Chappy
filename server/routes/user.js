import express from "express";
import {getAllUsers, getUser} from '../controllers/user.js'
import { param } from "express-validator";

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userID', param('userID').notEmpty().escape(), getUser);

export default router;