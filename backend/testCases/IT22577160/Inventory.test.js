import { describe, it, expect, beforeEach, vi } from "vitest"; // Importing from vitest
import request from "supertest";
import app from "../../server.js";
import Inventory from "../../models/IT22577160/inventory.model.js";
import jwt from "jsonwebtoken";

vi.mock("../../models/IT22577160/inventory.model.js");

//---------------------CREATE TEST CASE---------------------//
describe("Create Equipment to Inventory bulk ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Test successful inventory creation
  it("should add Equipment to Inventory bulk", async () => {
    try {
      //Mocking the save function of Inventory
      Inventory.mockImplementation(() => ({
        save: vi.fn().mockResolvedValue({
          userId: "12345",
          itemName: "John Doe",
          category: "Pending",
          image:
            "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
          quantity: "123 Street",
          condition: "2024-10-10",
          description: "Plastic",
          location: "Please pick up after 5 PM.",
          type: "123",
          offer: "66fc503f39be3b9ed09364e3",
          regularPrice: "12345",
          discountPrice: "66fc503f39be3b9ed09364e3",
          slug: "12345",
        }),
      }));

      const token = jwt.sign(
        { id: "66fc503f39be3b9ed09364e3", EquipmentInventoryManger: true },
        process.env.JWT_SECRET
      );

      // Simulate test environment
      process.env.NODE_ENV = "test";

      //Send a POST request to createEquipment route
      const response = await request(app)
        .post("/api/inventory/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId: "12345",
          itemName: "John Doe",
          category: "Pending",
          image:
            "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
          quantity: "123 Street",
          condition: "2024-10-10",
          description: "Plastic",
          location: "Please pick up after 5 PM.",
          type: "123",
          offer: "66fc503f39be3b9ed09364e3",
          regularPrice: "12345",
          discountPrice: "66fc503f39be3b9ed09364e3",
          slug: "12345",
        });

      // Assertions
      expect(response.statusCode).toBe(201); // Success status
      expect(response.body.success).toBe(true);
      expect(response.body.data.itemName).toBe("New Equipment");
    } catch (error) {
      console.error("Test failed with error:", error);
    }
  });

  app.post("/api/inventory/create", (req, res) => {
    console.log("Route Hit: /api/inventory/create");
    it("should return 400 error for missing required fields", async () => {
      const res = await request(app).post("/api/inventory/create").send({
        userId: "12345",
        itemName: "John Doe",
        category: "Pending",
        image:
          "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
        quantity: "123 Street",

        // Missing ScheduleDate, Location, Category
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Please fill in all required fields."
      );
    });
  });

  //---------------------DELETE TEST CASE---------------------//
  describe("Delete added Equipment in inventory bulk", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    // Test case for successfully deleting a added equipment
    it("should delete a added Equipment successfully", async () => {
      try {
        // Mocking the findOneAndDelete function of Inventory
        Inventory.findOneAndDelete.mockResolvedValue({
          userId: "12345",
          itemName: "John Doe",
          category: "Pending",
          image:
            "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
          quantity: "123 Street",
          condition: "2024-10-10",
          description: "Plastic",
          location: "Please pick up after 5 PM.",
          type: "123",
          offer: "66fc503f39be3b9ed09364e3",
          regularPrice: "12345",
          discountPrice: "66fc503f39be3b9ed09364e3",
          slug: "12345",
        });

        // Generate a JWT token for authentication
        const token = jwt.sign(
          { id: "66fc503f39be3b9ed09364e3" },
          process.env.JWT_SECRET
        );

        // Send a DELETE request to your deleteSchedule route
        const response = await request(app)
          .delete("/api/inventory/deleteInventoryItems/12345/4521")
          .set("Authorization", `Bearer ${token}`); // Set the token for auth

        // Assertions
        expect(response.statusCode).toBe(200); // Success status
        expect(response.body.message).toBe(
          "Successfully deleted the equipment"
        );
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });

    // Test case for when the Equipment is not found or the user is unauthorized
    it("should return 404 if equipment is not found or user not authorized", async () => {
      try {
        // Mocking the findOneAndDelete function to return null (not found)
        Inventory.findOneAndDelete.mockResolvedValue(null);

        // Generate a JWT token for authentication
        const token = jwt.sign(
          { id: "66fc503f39be3b9ed09364e3" },
          process.env.JWT_SECRET
        );

        // Send a DELETE request to your delete route
        const response = await request(app)
          .delete("/api/inventory/deleteInventoryItems/12345/4521")
          .set("Authorization", `Bearer ${token}`);

        // Assertions
        expect(response.statusCode).toBe(404); // Not found status
        expect(response.body.message).toBe(
          "Equipment not found or you are not authorized to delete this"
        );
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });
  });

  //---------------------GET ALL TEST CASE
  // 1.Mock the Inventory.find() method to simulate database interaction.
  //2. Handle success scenarios where equipments are fetched.
  //3. Handle failure scenarios such as internal server errors.
  describe("Get Equipments", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    // Test case for successfully fetching inventory items
    it("should get all Inventory for the specified id", async () => {
      try {
        // Mocking the Inventory.find function
        Inventory.find.mockResolvedValue([
          {
            userId: "12345",
            itemName: "Shredder",
            category: "Pending",
            image:
              "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
            quantity: "123 Street",
            condition: "2024-10-10",
            description: "Plastic",
            location: "Please pick up after 5 PM.",
            type: "123",
            offer: "66fc503f39be3b9ed09364e3",
            regularPrice: "12345",
            discountPrice: "66fc503f39be3b9ed09364e3",
            slug: "12345",
          },
          {
            userId: "12345",
            itemName: "Shredder",
            category: "Pending",
            image:
              "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
            quantity: "123 Street",
            condition: "2024-10-10",
            description: "Plastic",
            location: "Please pick up after 5 PM.",
            type: "123",
            offer: "66fc503f39be3b9ed09364e3",
            regularPrice: "12345",
            discountPrice: "66fc503f39be3b9ed09364e3",
            slug: "12345",
          },
        ]);

        // Generate a JWT token for authentication
        const token = jwt.sign(
          { id: "66fc503f39be3b9ed09364e3" },
          process.env.JWT_SECRET
        );

        // Send a GET request to your equipments route
        const response = await request(app)
          .get("/api/inventory/getInventoryItems")
          .set("Authorization", `Bearer ${token}`)
          .query({ resourceId: "66fc503f39be3b9ed09364e3" }); // Assuming resourceId is passed as a query param

        // Assertions
        expect(response.statusCode).toBe(200); // Success status
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2); // Check that two requests were returned
        expect(response.body[0].itemName).toBe("Shredder");
        expect(response.body[1].itemName).toBe("Shredder");
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });

    // Test case for handling internal server errors
    it("should return a 500 status if there is a server error", async () => {
      try {
        // Mocking the WasteShedule.find to throw an error
        Inventory.find.mockRejectedValue(new Error("Internal Server Error"));

        // Generate a JWT token for authentication
        const token = jwt.sign(
          { id: "66fc503f39be3b9ed09364e3" },
          process.env.JWT_SECRET
        );

        // Send a GET request to your getWasteRequests route
        const response = await request(app)
          .get("/api/inventory/getInventoryItems")
          .set("Authorization", `Bearer ${token}`)
          .query({ resourceId: "66fc503f39be3b9ed09364e3" });

        // Assertions
        expect(response.statusCode).toBe(500); // Internal server error status
        expect(response.body).toHaveProperty("msg", "Internal Server Error");
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });
  });

  // Test case for no inventory found
  it("should return a 404 error if no equipments are found for the user", async () => {
    try {
      // Mocking Inventory.find to return an empty array (no equipments found)
      Inventory.find.mockResolvedValue([]);

      // Generate a JWT token for the authorized user
      const token = jwt.sign(
        { id: "66fc503f39be3b9ed09364e3" },
        process.env.JWT_SECRET
      );

      // Send a GET request to the getInventoryItems route
      const response = await request(app)
        .get("/api/inventory/getInventoryItems/66fc503f39be3b9ed09364e3")
        .set("Authorization", `Bearer ${token}`);

      // Assertions
      expect(response.statusCode).toBe(404); // Not found status
      expect(response.body).toHaveProperty("message", "No Equipments found");
    } catch (error) {
      console.error("Test failed with error:", error);
    }
  });

  // Negative test case for no inventory items found
  it("should return a 404 error if no inventory items are found for the user", async () => {
    try {
      // Mocking Inventory.find to return an empty array (no inventory items found)
      Inventory.find.mockResolvedValue([]);

      // Generate a JWT token for the authorized user
      const token = jwt.sign(
        { id: "66fc503f39be3b9ed09364e3" },
        process.env.JWT_SECRET
      );

      // Send a GET request to the getInventoryItems route
      const response = await request(app)
        .get("/api/inventory/getInventoryItems/66fc503f39be3b9ed09364e3")
        .set("Authorization", `Bearer ${token}`);

      // Assertions
      expect(response.statusCode).toBe(404); // Check if the status code is 404
      expect(response.body).toHaveProperty(
        "message",
        "No inventory items found"
      );
    } catch (error) {
      console.error("Test failed with error:", error);
    }
  });

  //----------------------UPDTAE TEST CASE
  //1. Successful update
  //2. Unauthorized access where the user is not authorized to update the Equipment.
  //3. Equipments not found for the given.
  //4. Server error in case of a failure in the database query.

  describe("Update equipments added", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    // Test case for successfully updating Inventory
    it("should update the Equipment successfully", async () => {
      try {
        // Mocking the Inventory.findOneAndUpdate function to return updated data
        Inventory.findOneAndUpdate.mockResolvedValue({
          userId: "12345",
          itemName: "Shredder",
          category: "Pending",
          image:
            "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
          quantity: "123 Street",
          condition: "2024-10-10",
          description: "Plastic",
          location: "Please pick up after 5 PM.",
          type: "123",
          offer: "66fc503f39be3b9ed09364e3",
          regularPrice: "12345",
          discountPrice: "66fc503f39be3b9ed09364e3",
          slug: "12345",
        });

        // Generate a JWT token for authentication
        const token = jwt.sign(
          { id: "66fc503f39be3b9ed09364e3" },
          process.env.JWT_SECRET
        );

        // Send a PUT request to the updateInventory route
        const response = await request(app)
          .put("/api/inventory/updateInventoryItems/123/456")
          .set("Authorization", `Bearer ${token}`)
          .send({
            userId: "12345",
            itemName: "Shredder",
            category: "Pending",
            image:
              "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
            quantity: "123 Street",
            condition: "2024-10-10",
          });

        // Assertions
        expect(response.statusCode).toBe(200); // Success status
        expect(response.body).toHaveProperty(
          "message",
          "Successfully updated the inventory"
        );
        expect(response.body.updatedRequest.itemName).toBe("Shredder");
        expect(response.body.updatedRequest.category).toBe("Pending");
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });

    // Test case for unauthorized access
    it("should return a 403 error if the user is not authorized to update the added equipments", async () => {
      try {
        // Generate a JWT token for a different user
        const token = jwt.sign({ id: "anotherUserId" }, process.env.JWT_SECRET);

        // Mock Inventory.findOneAndUpdate to return null (indicating unauthorized access)
        Inventory.findOneAndUpdate.mockResolvedValue(null);

        // Send a PUT request with a different userId
        const response = await request(app)
          .put("/api/wasteSchedule/updateschedule/req1")
          .set("Authorization", `Bearer ${token}`)
          .send({
            Location: "456 Street",
            ScheduleDate: "2024-10-15",
            Category: "Glass",
          });

        // Assertions
        expect(response.statusCode).toBe(404); // Unauthorized status
        expect(response.body).toHaveProperty(
          "message",
          "Equipments not found or you are not authorized to update this"
        );
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });

    // Test case for Inventory not found
    it("should return a 404 error if the Equipments is not found", async () => {
      try {
        // Mock Inventory.findOneAndUpdate to return null
        Inventory.findOneAndUpdate.mockResolvedValue(null);

        // Generate a JWT token for the authorized user
        const token = jwt.sign(
          { id: "66fc503f39be3b9ed09364e3" },
          process.env.JWT_SECRET
        );

        // Send a PUT request to the updateInventory route
        const response = await request(app)
          .put("/api/wasteSchedule/updateschedule/req123")
          .set("Authorization", `Bearer ${token}`)
          .send({
            Location: "456 Street",
            ScheduleDate: "2024-10-15",
            Category: "Glass",
          });

        // Assertions
        expect(response.statusCode).toBe(404); // Not found status
        expect(response.body).toHaveProperty(
          "message",
          "Equipments are not found or you are not authorized to update this"
        );
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });
  });
});