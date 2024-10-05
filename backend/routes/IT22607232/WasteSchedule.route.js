import express from 'express';
import { verifyToken } from '../../utils/verifyToken.js';
import {WasteSchedule,sendEmail,allSchedules,oneSchedule,updateSchedule,deleteSchedule} from '../../controllers/IT22607232/WasteSchedule.Controller.js';


const router = express.Router();

router.post('/schedule', verifyToken, WasteSchedule);
router.post('/sendemail', verifyToken, sendEmail);
router.get('/allschedules', verifyToken, allSchedules);
router.get('/oneschedule/:requestid', verifyToken, oneSchedule);
router.put('/updateschedule/:requestid', verifyToken, updateSchedule);
router.delete('/deleteschedule/:requestid', verifyToken, deleteSchedule);

export default router;