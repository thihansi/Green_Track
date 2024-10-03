import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./dbConfig/dbConnection.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import inventoryRoutes from "./routes/IT22577160/inventory.route.js";
import checkoutRoutes from "./routes/IT22577160/checkout.route.js";
import commentRoutes from "./routes/IT22577160/comment.route.js";
import pricingRoutes from "./routes/IT22003546_Routes/pricing.route.js";
import billingRoutes from "./routes/IT22003546_Routes/billing.route.js";
import paymentRoutes from "./routes/IT22003546_Routes/payment.route.js";
import wasteCollectionRoutes from "./routes/IT22350114/wasteCollection.route.js";


const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

dbConnection();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// IT22577160 - Inventory Management
// Use the inventory routes
app.use("/api/inventory", inventoryRoutes);
// checkout routes
app.use("/api/checkout", checkoutRoutes);
// comment routes
app.use("/api/comment", commentRoutes);


//IT22003546
app.use("/api/pricing", pricingRoutes)
app.use("/api/billing", billingRoutes)
app.use("/api/payment", paymentRoutes);



// IT22350114 - Real-Time Waste Update and Alert System
app.use("/api/wasteCollection", wasteCollectionRoutes);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
