import WasteShedule from '../../models/IT22607232/WasteShedule.model.js';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import User from "../../models/user.model.js";
import { errorHandler } from "../../utils/error.js";
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


// Create Waste Schedule
export const createRequest = async (req, res, next) => {
  try {
    const {
      Status,
      Additional_Note,
      email,
      Location,
      ScheduleDate,
      Category,
      CustomerName,
      RequestID,
      userId,
    } = req.body;

    // Check if userId matches the logged-in user's ID
    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not authorized to create this Request"));
    }

    // Additional validation can be added here (e.g., check required fields)
    if (!Status || !CustomerName || !ScheduleDate || !Location || !Category) {
      return next(errorHandler(400, "Please fill in all required fields."));
    }

    const newRequest = new WasteShedule({
      Status,
      Additional_Note,
      email,
      Location,
      ScheduleDate,
      Category,
      CustomerName,
      RequestID,
      userId,
    });

    await newRequest.save();

    // Send email notification
    const subject = `New Waste Request Created: ${newRequest.RequestID}`;
    const text = `Dear ${newRequest.CustomerName},\n\nYour waste request has been created successfully.\n\nDetails:\n- Status: ${newRequest.Status}\n- Category: ${newRequest.Category}\n- Schedule Date: ${newRequest.ScheduleDate}\n- Location: ${newRequest.Location}\n- Additional Notes: ${newRequest.Additional_Note}\n\nThank you for using our service!
    Green Trucker Waste Management`;

    await sendEmail({
      body: { to: newRequest.email, subject, text }
    });

    // Respond with the newly created request
    res.status(201).json({
      success: true,
      message: "Request created successfully!",
      RequestID: newRequest.RequestID,
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error.message || error);
    next(error);
  }
};





// Get all waste requests for a specific resource
export const getWasteRequests = async (req, res, next) => {
  try {
     const wasteRequests = await WasteShedule.find({ resourceId: req.params.resourceId }).sort({ createdAt: -1 });
     res.status(200).json(wasteRequests);
  } catch (error) {
     next(error);
  }
};

// Get all waste requests for the logged-in user
export const getUserWasteRequests = async (req, res, next) => {
  try {
     // Verify that the user making the request is the same as the userId parameter
     if (req.params.userId !== req.user.id) {
        return next(errorHandler(403, "You are not authorized to view these waste requests"));
     }

     const userWasteRequests = await WasteShedule.find({ userId: req.params.userId });
     if (!userWasteRequests) {
        return next(errorHandler(404, "No waste requests found for this user"));
     }
     res.status(200).json(userWasteRequests);
  } catch (error) {
     next(error);
  }
};



//Get ALL  Schedules By Admin
export const allSchedules = async (req, res, next) => {
    try {
      const Scheduling = await WasteShedule.find();
      if (!Scheduling) {
        res.status(404).json({ msg: "Schedule not found" });
      }
      res.status(200).json(Scheduling);
    } catch (error) {
      next(error);
      res.status(500).json({ error: error });
    }
};
  

// Get one schedule by ID for the logged-in user
export const oneSchedule = async (req, res, next) => {
  try {
    let requestid = req.params.requestid;
    const oneSchedule = await WasteShedule.findOne({ _id: requestid, userRef: req.user._id }); 

    if (!oneSchedule) {
      return res.status(404).json({ message: 'Schedule not found or you are not authorized to view this' });
    }
    res.status(200).json(oneSchedule);
  } catch (error) {
    console.error('Error retrieving schedule:', error);
    next(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Schedule by Resident (logged-in user)
export const updateSchedule = async (req, res, next) => {
  try {
    const requestId = req.params.requestid;
    const updateRequestData = req.body;

    const updatedRequest = await WasteShedule.findOneAndUpdate(
      { _id: requestId, userRef: req.user._id }, 
      updateRequestData,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Schedule not found or you are not authorized to update this' });
    }

    res.status(200).json({ message: 'Successfully updated the schedule', updatedRequest });
  } catch (error) {
    console.error('Error updating scheduling:', error);
    next(error);
  }
};

// Delete Schedule by Resident (logged-in user)
export const deleteSchedule = async (req, res, next) => {
  try {
    const deletedRequest = await WasteShedule.findOneAndDelete({ _id: req.params.requestid, userRef: req.user._id }); 

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Schedule not found or you are not authorized to delete this' });
    }

    res.status(200).json({ message: 'Successfully deleted the waste collection request' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};