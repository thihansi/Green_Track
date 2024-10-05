import mongoose from "mongoose";

const WasteSheduleSchema = new mongoose.Schema(
  {
    RequestID: {
      type: String,
      required: true,
    },
    CustomerName: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    ScheduleDate: {
      type: Date,
      required: true,
    },

    Location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    Additional_Note: {
      type: String,
      required: false,
    },
    Status: {
      type: String,
      default: "Pending",
      required: true,
    },
  },
  { timestamps: true }
);

const WasteSchedule = mongoose.model("WasteSchedule", WasteSheduleSchema);
export default WasteSchedule;
