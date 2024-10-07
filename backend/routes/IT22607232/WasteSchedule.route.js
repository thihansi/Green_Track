import express from 'express';
import { verifyToken } from '../../utils/verifyToken.js';
import {sendEmail,allSchedules,oneSchedule,updateSchedule,deleteSchedule,createRequest,getWasteRequests,getUserWasteRequests} from '../../controllers/IT22607232/WasteSchedule.Controller.js';


const router = express.Router();

router.post('/create-request', verifyToken, createRequest);
router.get('/get-user-requests', verifyToken, getWasteRequests);
router.get('/get-specific-requests/:userId', verifyToken, getUserWasteRequests);
router.post('/sendemail', verifyToken, sendEmail);
router.get('/allschedules', verifyToken, allSchedules);
router.get('/oneschedule/:requestid', verifyToken, oneSchedule);
router.put('/updateschedule/:requestid', verifyToken, updateSchedule);
router.delete('/deleteschedule/:requestid', verifyToken, deleteSchedule);

export default router;