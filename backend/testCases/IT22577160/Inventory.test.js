import { describe, it, expect, vi, beforeEach, response } from "vitest";
import {
  createInventory,
  getInventoryItems,
  deleteInventoryItems,
  updateInventoryItems,
} from "../../controllers/IT22577160/inventory.controller.js";
import { errorHandler } from "../../utils/error.js";
import Inventory from "../../models/IT22577160/inventory.model.js";

// Mock the Inventory model
vi.mock("../../models/IT22577160/inventory.model.js");

//---------------------CREATE TEST CASE---------------------//
//Test case for Inventory creation
describe("InventoryController Unit Tests", () => {
  describe("Create Equipment to Inventory bulk ", () => {
    let req, res, next;
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
            itemName: "Shredder",
            category: "WasteBin",
            image:
              "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
            quantity: 2,
            condition: 1,
            description: "Made with Plastic",
            location: "123 Street",
            type: "Recycle",
            offer: true,
            regularPrice: 1000,
            discountPrice: 50,
            slug: "shredder-wastebin-12345",
          }),
        }));

        //Assertions
        expect(response.statusCode).toBe(201); // Success status
        expect(response.body.success).toBe(true);
        expect(response.body.data.itemName).toBe("New Equipment");
      } catch (error) {
        console.error("Test failed with error:", error);
      }
    });

    // Test case 2: Create Inventory - Authorization Test
    // negative test case
    it("should not allow creating inventory if the user is not an EquipmentInventoryManager", async () => {
      const req = { user: { EquipmentInventoryManger: false }, body: {} };
      const res = {};
      const next = vi.fn();

      await createInventory(req, res, next);

      //Assertions
      expect(next).toHaveBeenCalledWith(
        errorHandler(403, "You are not authorized to create a listing")
      );
    });

    // Test case 3: Create Inventory - Validation Test
    // negative test case
    it("should not create inventory if required fields are missing", async () => {
      const req = {
        user: { EquipmentInventoryManger: true },
        body: { itemName: "" },
      };
      const res = {};
      const next = vi.fn();

      await createInventory(req, res, next);

      //Assertions
      expect(next).toHaveBeenCalledWith(
        errorHandler(400, "Please Provide all the required fields")
      );
    });
  });
});

//---------------------GET ALL TEST CASE---------------------//
//Get Equipment from Inventory bulk
describe("Get Equipment from Inventory bulk ", () => {
  // Test case 4: Get Inventory Items - Query Parsing Test
  it("should parse query parameters and get all the items", async () => {
    const req = {
      query: {
        startIndex: "5",
        limit: "10",
        order: "asc",
        category: "Electronics",
      },
    };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    Inventory.find.mockResolvedValueOnce([]); // Mocking Inventory.find()
    Inventory.countDocuments.mockResolvedValueOnce(0); // Mocking Inventory.countDocuments()

    await getInventoryItems(req, res, next);

    //Assertions
    expect(req.pagination).toEqual({
      startIndex: 5,
      limit: 10,
      sortDirection: 1,
    });
    expect(req.filters).toEqual({ category: "Electronics" });
  });
});

//----------------------UPDATE TEST CASE---------------------//
//Update Equipment from Inventory bulk
describe("updateInventoryItems", () => {
  let req, res, next;

  beforeEach(() => {
    // Reset the mocks and set up the mock request, response, and next function
    vi.clearAllMocks();

    req = {
      params: {
        postId: "12345",
      },
      body: {
        itemName: "Updated Item",
        description: "Updated Description",
        location: "Updated Location",
        category: "Updated Category",
        quantity: 10,
        type: "Updated Type",
        image: "updated-image.jpg",
        condition: "Updated Condition",
        regularPrice: 100,
        discountPrice: 80,
        offer: "20% Off",
      },
      user: {
        EquipmentInventoryManger: true, // Mocking the required user property
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  // Test case 5: Update Inventory Items - Success Test
  it("should update an inventory item successfully and return the updated item", async () => {
    // Arrange: Mock the findByIdAndUpdate function to return the updated resource
    const mockUpdatedResource = {
      _id: "12345",
      ...req.body,
    };
    Inventory.findByIdAndUpdate.mockResolvedValue(mockUpdatedResource);

    // Act: Call the wrapped updateInventoryItems function
    await updateInventoryItems(req, res, next);

    // Assert: Check that the correct methods were called with the expected arguments
    expect(Inventory.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.postId,
      {
        $set: {
          itemName: req.body.itemName,
          description: req.body.description,
          location: req.body.location,
          category: req.body.category,
          quantity: req.body.quantity,
          type: req.body.type,
          image: req.body.image,
          condition: req.body.condition,
          regularPrice: req.body.regularPrice,
          discountPrice: req.body.discountPrice,
          offer: req.body.offer,
        },
      },
      { new: true }
    );
    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedResource);
    expect(next).not.toHaveBeenCalled();
  });

  //Test case 6: Update Inventory Items - Authorization Test
  // negative test case
  it("should not allow updating inventory if the user is not authorized", async () => {
    const req = {
      user: { id: "user1" },
      params: { userId: "user2" },
      body: {},
    };
    const res = {};
    const next = vi.fn();

    await updateInventoryItems(req, res, next);

    expect(next).toHaveBeenCalledWith(
      errorHandler(403, "You are not authorized to create a listing")
    );
  });
});

//---------------------DELETE TEST CASE---------------------//
// Test case 7: Delete Inventory Items - Authorization Test
describe("Delete Inventory Items", () => {
  beforeEach(() => {
    // Clear previous mocks
    vi.clearAllMocks();

    // Mock the delete operation
    Inventory.findByIdAndDelete = vi.fn();
  });

  // Test case 8: Delete Inventory Items - Success Test
  it("should return 200 and success message when the inventory item is deleted", async () => {
    const req = {
      params: { id: "someItemId" }, // Replace with your actual test ID
      user: { EquipmentInventoryManger: true }, // Mock the user object
    };
    const res = {
      status: vi.fn().mockReturnThis(), // Chainable
      json: vi.fn(),
    };
    const next = vi.fn();

    await deleteInventoryItems(req, res, next); // Call the delete function

    // Assertions to verify the expected behavior
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "The resource has been deleted successfully",
    });
  });

  // Test case 9: Delete Inventory Items - negative Test
  it("should call next with error when an error occurs", async () => {
    const req = {
      user: {
        EquipmentInventoryManager: true,
      },
      params: {
        itemId: "invalid-id", // Use an invalid ID to trigger an error
      },
    };
    const res = {};
    const next = vi.fn();

    // Simulate an error scenario by throwing an error from the mock
    Inventory.findByIdAndDelete.mockRejectedValueOnce(
      new Error("Database error")
    );

    await deleteInventoryItems(req, res, next);

    //Assertions
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
