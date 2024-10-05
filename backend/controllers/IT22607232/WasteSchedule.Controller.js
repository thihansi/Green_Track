import WasteShedule from '../../models/IT22607232/WasteShedule.model.js';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { text } from "express";
dotenv.config();


// Send Email
export const sendEmail = async (req, res, next) => {
    /*try {*/
      const { to, subject, text } = req.body;
  
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      // Send mail with defined transport object
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
      });
  };



//create waste schedule
  export const WasteSchedule = async (req, res, next) => {
    try {
      const newWasteSchedule = await WasteShedule.create(req.body);
  
      if (!newWasteSchedule) {
        return res.status(404).json({ msg: "Waste Sheduling failed" });
      }
  
      // Send email notification for confirmation of the request
      const subject = `New Waste Collection Request has Assigned: ${newWasteSchedule.RequestID}`;
      const text = `Category: ${newWasteSchedule.Category}\nAssignDate: ${newWasteSchedule.ScheduleDate}\nName: ${newWasteSchedule.CustomerName}`;
      sendEmail({ body: { to: newWasteSchedule.email, subject, text } });
  
      res.status(200).json({ WasteShedule: newWasteSchedule, message: 'Waste Collection Request has placed successfully' });
    } catch (error) {
      console.error('Error scheduling requst:', error);
      res.status(500).json({ error: 'Failed to place request' });
    }
  };

//get all waste schedules
export const allSchedules = async (req, res, next) => {
  try {
    const Scheduling = await WasteShedule.find();
    if (!Scheduling) {
      res.status(404).json({ msg: "Shedule not found" });
    }
    res.status(200).json(Scheduling);
  } catch (error) {
    next(error);
    res.status(500).json({ error: error });
  }
};

//Get waste schedule by id
export const oneSchedule = async (req, res,next) => {
  try {
    let requestid = req.params.requestid;
    const oneSchedule = await WasteShedule.findOne({_id: requestid});

    if (!oneSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json(oneSchedule);
  } catch (error) {
    console.error("Error retrieving schedule:", error);
    next(error);
    return res.status(500).json({ error: "Internal server error" });
   
  }
};


// Update Schedule by Resident
export const updateSchedule = async (req, res, next) => {
  try {
    const requetsId = req.params.requestid; //get request id from the request
    const updateRequestData = req.body; //declaring updated data

    const updatedRequest = await WasteShedule.findByIdAndUpdate(requetsId, updateRequestData, { new: true });

    if (!updatedRequest) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({ message: "Successfully Schedule Updated", updatedRequest });
  } catch (error) {
    console.error("Error updating Scheduling:", error);
    next(error); //pass error to error handling middleware
  }
};


//delete Schedule by Resident
export const deleteSchedule = async(req,res,next)=>{
  try{
    await WasteShedule.findByIdAndDelete(req.params.requestid)
    res.status(200).json({ message: "Successfully Deleted Placed Waste Collection Request" })
  }
  catch (error){
    return res.status(500).json({msg: error.message})
  
  }
}