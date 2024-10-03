import express from 'express';
import { verifyToken } from '../../utils/verifyToken.js';
import { createComment, deleteComment, editComment, getComments, getPostComments, getUserComments, likeComment } from '../../controllers/IT22577160/comment.controller.js';


const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:resourceId', getPostComments);
router.get('/getUserComments/:userId', getUserComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment)
router.get('/getComments', verifyToken, getComments)

export default router;