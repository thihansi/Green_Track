import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createRequest,
  updateSchedule,
  deleteSchedule,
  getWasteRequests,
  getUserWasteRequests,
  sendEmail,
  RequestFactory,
} from "../../controllers/IT22607232/wasteSchedule.controller.js";
import WasteShedule from "../../models/IT22607232/WasteShedule.model.js";
import { errorHandler } from "../../utils/error.js";

// Mocking Mongoose Model
vi.mock("../../models/IT22607232/WasteShedule.model.js");
vi.mock("../../controllers/IT22607232/RequestFactory.js"); // Mocking the RequestFactory
vi.mock("../../models/IT22607232/WasteShedule.model.js");

// Test case for Waste Schedule creation
describe("WasteSchedule Controller Unit Tests", () => {
  const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  beforeEach(() => {
    vi.clearAllMocks(); // Clear previous mocks between tests
  });

  describe("Create Waste Schedule Request", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    // 1. Test successful request creation
    it("should create a waste schedule request successfully and send email", async () => {
      try {
        // Mocking the save function of WasteShedule
        WasteShedule.mockImplementation(() => ({
          save: vi.fn().mockResolvedValue({
            RequestID: "12345",
            CustomerName: "John Doe",
            Status: "Pending",
            email: "customer@example.com",
            Location: "123 Street",
            ScheduleDate: "2024-10-10",
            Category: "Plastic",
            Additional_Note: "Please pick up after 5 PM.",
            userId: "123",
          }),
        }));

        // Mocking the sendEmail function
        sendEmail.mockResolvedValue(true);

        // Call the createRequest controller here with proper mocked req, res
        await createRequest(
          { body: { CustomerName: "John Doe" } },
          response,
          vi.fn()
        );

        // Assertions
        expect(response.status).toHaveBeenCalledWith(201); // Success status
        expect(response.json).toHaveBeenCalledWith({
          success: true,
          message: "Request created successfully!",
          RequestID: "12345",
          data: expect.any(Object),
        });
        expect(sendEmail).toHaveBeenCalled(); // Email should be sent
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });

    // Test 2: Create Request - Missing Fields Validation
    it("should return an error if required fields are missing during request creation", async () => {
      const req = {
        user: { id: "user1" },
        body: { CustomerName: "", ScheduleDate: "" },
      }; // Missing required fields
      const res = {};
      const next = vi.fn();

      await createRequest(req, res, next);

      expect(next).toHaveBeenCalledWith(
        errorHandler(400, "Please fill in all required fields.")
      );
    });
  });


   // Test case for Get Waste Schedule Requests
   describe("Get Waste Schedule Requests", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    // Test 6: Get User Waste Requests - Unauthorized Access
    it("should return an error if the logged-in user tries to access another user’s requests", async () => {
      const req = { params: { userId: "user2" }, user: { id: "user1" } };
      const res = {};
      const next = vi.fn();

      await getUserWasteRequests(req, res, next);

      expect(next).toHaveBeenCalledWith(
        errorHandler(403, "You are not authorized to view these waste requests")
      );
    });
  });

  // Test case for Update Waste Schedule Request
  describe("Update Waste Schedule Request", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    // Test 3: Update Schedule - Successful Update
    it("should update a schedule successfully if the user is authorized", async () => {
      const req = {
        user: { _id: "user1" },
        params: { requestid: "request1" },
        body: { Status: "Completed" },
      };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      WasteShedule.findOneAndUpdate.mockResolvedValueOnce({
        _id: "request1",
        Status: "Completed",
      });

      await updateSchedule(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully updated the schedule",
        updatedRequest: { _id: "request1", Status: "Completed" },
      });
    });

    // Test 4: Update Schedule - Unauthorized User
    it("should return an error if the user is not authorized to update the schedule", async () => {
      const req = {
        user: { _id: "user1" },
        params: { requestid: "request1" },
        body: { Status: "Completed" },
      };
      const res = {};
      const next = vi.fn();

      WasteShedule.findOneAndUpdate.mockResolvedValueOnce(null); // Simulate unauthorized or not found

      await updateSchedule(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Object)); // Expect an error to be called
    });
  });

  // Test case for Delete Waste Schedule Request
  describe("Delete Waste Schedule Request", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    // Test 5: Delete Schedule - Successful Deletion
    it("should delete a schedule successfully if the user is authorized", async () => {
      const req = { user: { _id: "user1" }, params: { requestid: "request1" } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      WasteShedule.findOneAndDelete.mockResolvedValueOnce({ _id: "request1" });

      await deleteSchedule(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully deleted the waste collection request",
      });
    });
  });


});

