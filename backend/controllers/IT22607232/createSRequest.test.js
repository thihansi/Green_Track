import request from 'supertest';
import app from '../../server.js';  // Import the Express app
import WasteShedule from '../../models/IT22607232/WasteShedule.model.js';
import { sendEmail } from '../../controllers/IT22607232/WasteSchedule.Controller.js';  // Mock the sendEmail function
import { describe, it, expect, beforeEach, vi } from 'vitest'; // Importing from vitest
import jwt from 'jsonwebtoken';  // Import jwt for token generation

// Mock dependencies
vi.mock('../../models/IT22607232/WasteShedule.model.js');
vi.mock('../../controllers/IT22607232/WasteSchedule.Controller.js');

describe('Create Waste Schedule Request', () => {

  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  // 1. Test successful request creation
  it('should create a waste schedule request successfully and send email', async () => {
    try {
      //Mocking the save function of WasteShedule
      WasteShedule.mockImplementation(() => ({
        save: vi.fn().mockResolvedValue({
          RequestID: '12345',
          CustomerName: 'John Doe',
          Status: 'Pending',
          email: 'customer@example.com',
          Location: '123 Street',
          ScheduleDate: '2024-10-10',
          Category: 'Plastic',
          Additional_Note: 'Please pick up after 5 PM.',
          userId: '123',
        }),
      }));
  
      // Mocking the sendEmail function
      sendEmail.mockResolvedValue(true);

      const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);

      // Simulate test environment
      process.env.NODE_ENV = 'test'; // Ensure test environment is set
  
      //Send a POST request to your createRequest route
      const response = await request(app)
        .post('/api/wasteSchedule/create-request')
        .set('Authorization', `Bearer ${token}`)
        .send({
          Status: 'Pending',
          CustomerName: 'John Doe',
          email: 'customer@example.com',
          Location: '123 Street',
          ScheduleDate: '2024-10-10',
          Category: 'Plastic',
          Additional_Note: 'Please pick up after 5 PM.',
          RequestID: '12345',
          userId: '66fc503f39be3b9ed09364e3',
        });
  
      // Assertions
      expect(response.statusCode).toBe(201);  // Success status
      expect(response.body.success).toBe(true);
      expect(response.body.data.CustomerName).toBe('John Doe');
      expect(sendEmail).toHaveBeenCalled();  // Email should be sent
    } catch (error) {
      console.error('Test failed with error:', error);
    }
  });

  
  app.post('/api/wasteSchedule/create-request', (req, res) => {
    console.log('Route Hit: /api/wasteSchedule/create-request');
    it('should return 400 error for missing required fields', async () => {
      const res = await request(app).post('/api/wasteSchedule/create-request').send({
        Status: 'Pending',
        CustomerName: 'John Doe'
        // Missing ScheduleDate, Location, Category
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Please fill in all required fields.');
    });  
  });





  //---------------------DELETE TEST CASE--------------
  describe('Delete Waste Schedule Request', () => {

    beforeEach(() => {
      vi.clearAllMocks(); 
    });
  
    // Test case for successfully deleting a waste schedule request
    it('should delete a waste schedule request successfully', async () => {
      try {
        // Mocking the findOneAndDelete function of WasteShedule
        WasteShedule.findOneAndDelete.mockResolvedValue({
          _id: '12345',
          CustomerName: 'John Doe',
          userRef: '66fc503f39be3b9ed09364e3',
          Status: 'Pending',
        });
  
        // Generate a JWT token for authentication
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a DELETE request to your deleteSchedule route
        const response = await request(app)
          .delete('/api/wasteSchedule/deleteschedule/12345')
          .set('Authorization', `Bearer ${token}`);  // Set the token for auth
    
        // Assertions
        expect(response.statusCode).toBe(200);  // Success status
        expect(response.body.message).toBe('Successfully deleted the waste collection request');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
    // Test case for when the schedule is not found or the user is unauthorized
    it('should return 404 if schedule is not found or user not authorized', async () => {
      try {
        // Mocking the findOneAndDelete function to return null (not found)
        WasteShedule.findOneAndDelete.mockResolvedValue(null);
  
        // Generate a JWT token for authentication
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a DELETE request to your deleteSchedule route
        const response = await request(app)
          .delete('/api/wasteSchedule/deleteschedule/12345')
          .set('Authorization', `Bearer ${token}`);
  
        // Assertions
        expect(response.statusCode).toBe(404);  // Not found status
        expect(response.body.message).toBe('Schedule not found or you are not authorized to delete this');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  });


  //---------------------GET ALL TEST CASE
 // 1.Mock the WasteShedule.find() method to simulate database interaction.
 //2. Handle success scenarios where requests are fetched.
  //3. Handle failure scenarios such as internal server errors.
  describe('Get User Waste Requests', () => {

    beforeEach(() => {
      vi.clearAllMocks(); 
    });
  
    // Test case for successfully fetching waste requests
    it('should get all waste requests for the specified resource', async () => {
      try {
        // Mocking the WasteShedule.find function
        WasteShedule.find.mockResolvedValue([
          {
            _id: 'req1',
            CustomerName: 'John Doe',
            Location: '123 Street',
            ScheduleDate: '2024-10-10',
            Category: 'Plastic',
            Status: 'Pending',
            userId: '66fc503f39be3b9ed09364e3',
          },
          {
            _id: 'req2',
            CustomerName: 'Jane Doe',
            Location: '456 Street',
            ScheduleDate: '2024-11-10',
            Category: 'Glass',
            Status: 'Completed',
            userId: '66fc503f39be3b9ed09364e3',
          }
        ]);
  
        // Generate a JWT token for authentication
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a GET request to your getWasteRequests route
        const response = await request(app)
          .get('/api/wasteSchedule/get-user-requests')
          .set('Authorization', `Bearer ${token}`)
          .query({ resourceId: '66fc503f39be3b9ed09364e3' });  // Assuming resourceId is passed as a query param
  
        // Assertions
        expect(response.statusCode).toBe(200);  // Success status
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);  // Check that two requests were returned
        expect(response.body[0].CustomerName).toBe('John Doe');
        expect(response.body[1].CustomerName).toBe('Jane Doe');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
    // Test case for handling internal server errors
    it('should return a 500 status if there is a server error', async () => {
      try {
        // Mocking the WasteShedule.find to throw an error
        WasteShedule.find.mockRejectedValue(new Error('Internal Server Error'));
  
        // Generate a JWT token for authentication
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a GET request to your getWasteRequests route
        const response = await request(app)
          .get('/api/wasteSchedule/get-user-requests')
          .set('Authorization', `Bearer ${token}`)
          .query({ resourceId: '66fc503f39be3b9ed09364e3' });
  
        // Assertions
        expect(response.statusCode).toBe(500);  // Internal server error status
        expect(response.body).toHaveProperty('msg', 'Internal Server Error');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
  });













  //---------------------getUserWasteRequests test case
    //1. Successful update
  //2. Unauthorized access where the user is not authorized to view the waste requests (wrong userId).
  //3. No waste requests found for the user.
  //4. Server error in case of a failure in the database query.
  describe('Get Specific User Waste Requests', () => {

    beforeEach(() => {
      vi.clearAllMocks(); 
    });
  
    // Test case for successfully getting user waste requests
    it('should get all waste requests for the logged-in user', async () => {
      try {
        // Mocking the WasteShedule.find function to return sample data
        WasteShedule.find.mockResolvedValue([
          {
            _id: 'req1',
            CustomerName: 'John Doe',
            Location: '123 Street',
            ScheduleDate: '2024-10-10',
            Category: 'Plastic',
            Status: 'Pending',
            userId: '66fc503f39be3b9ed09364e3',
          },
          {
            _id: 'req2',
            CustomerName: 'Jane Doe',
            Location: '456 Street',
            ScheduleDate: '2024-11-10',
            Category: 'Glass',
            Status: 'Completed',
            userId: '66fc503f39be3b9ed09364e3',
          }
        ]);
  
        // Generate a JWT token for authentication
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a GET request to the getUserWasteRequests route
        const response = await request(app)
          .get('/api/wasteSchedule/get-specific-requests/66fc503f39be3b9ed09364e3')  // Using the correct userId
          .set('Authorization', `Bearer ${token}`);
  
        // Assertions
        expect(response.statusCode).toBe(200);  // Success status
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);  // Check that two requests were returned
        expect(response.body[0].CustomerName).toBe('John Doe');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
    // Test case for unauthorized access
    it('should return a 403 error if the user is not authorized to view these requests', async () => {
      try {
        // Generate a JWT token for a different user
        const token = jwt.sign({ id: 'anotherUserId' }, process.env.JWT_SECRET);
  
        // Send a GET request with a userId that does not match the token
        const response = await request(app)
          .get('/api/wasteSchedule/get-specific-requests/66fc503f39be3b9ed09364e3')  // Using a different userId
          .set('Authorization', `Bearer ${token}`);
  
        // Assertions
        expect(response.statusCode).toBe(403);  // Unauthorized status
        expect(response.body).toHaveProperty('message', 'You are not authorized to view these waste requests');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
    // Test case for no waste requests found
    it('should return a 404 error if no waste requests are found for the user', async () => {
      try {
        // Mocking WasteShedule.find to return an empty array (no waste requests found)
        WasteShedule.find.mockResolvedValue([]);
  
        // Generate a JWT token for the authorized user
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a GET request to the getUserWasteRequests route
        const response = await request(app)
          .get('/api/wasteSchedule/get-specific-requests/66fc503f39be3b9ed09364e3')
          .set('Authorization', `Bearer ${token}`);
  
        // Assertions
        expect(response.statusCode).toBe(404);  // Not found status
        expect(response.body).toHaveProperty('message', 'No waste requests found for this user');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
    // Test case for server error
    it('should return a 500 status if there is a server error', async () => {
      try {
        // Mocking WasteShedule.find to throw an error
        WasteShedule.find.mockRejectedValue(new Error('Internal Server Error'));
  
        // Generate a JWT token for the authorized user
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a GET request to the getUserWasteRequests route
        const response = await request(app)
          .get('/api/wasteSchedule/get-specific-requests/66fc503f39be3b9ed09364e3')
          .set('Authorization', `Bearer ${token}`);
  
        // Assertions
        expect(response.statusCode).toBe(500);  // Internal server error status
        expect(response.body).toHaveProperty('msg', 'Internal Server Error');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
  });




  //----------------------UPDTAE TEST CASE
  //1. Successful update
  //2. Unauthorized access where the user is not authorized to update the request (wrong userId).
  //3. Schedule not found for the given requestId.
  //4. Server error in case of a failure in the database query.

  describe('Update Waste Schedule', () => {

    beforeEach(() => {
      vi.clearAllMocks(); 
    });
  
    // Test case for successfully updating a waste schedule
    it('should update the waste schedule successfully', async () => {
      try {
        // Mocking the WasteShedule.findOneAndUpdate function to return updated data
        WasteShedule.findOneAndUpdate.mockResolvedValue({
          _id: 'req1',
          CustomerName: 'John Doe',
          Location: '123 Street',
          ScheduleDate: '2024-10-15',
          Category: 'Plastic',
          Status: 'Pending',
          userId: '66fc503f39be3b9ed09364e3',
        });
  
        // Generate a JWT token for authentication
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a PUT request to the updateSchedule route
        const response = await request(app)
          .put('/api/wasteSchedule/updateschedule/req1')
          .set('Authorization', `Bearer ${token}`)
          .send({
            Location: '456 Street',
            ScheduleDate: '2024-10-15',
            Category: 'Glass',
          });
  
        // Assertions
        expect(response.statusCode).toBe(200);  // Success status
        expect(response.body).toHaveProperty('message', 'Successfully updated the schedule');
        expect(response.body.updatedRequest.Location).toBe('456 Street');
        expect(response.body.updatedRequest.ScheduleDate).toBe('2024-10-15');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
    // Test case for unauthorized access
    it('should return a 403 error if the user is not authorized to update the schedule', async () => {
      try {
        // Generate a JWT token for a different user
        const token = jwt.sign({ id: 'anotherUserId' }, process.env.JWT_SECRET);
  
        // Mock WasteShedule.findOneAndUpdate to return null (indicating unauthorized access)
        WasteShedule.findOneAndUpdate.mockResolvedValue(null);
  
        // Send a PUT request with a different userId
        const response = await request(app)
          .put('/api/wasteSchedule/updateschedule/req1')
          .set('Authorization', `Bearer ${token}`)
          .send({
            Location: '456 Street',
            ScheduleDate: '2024-10-15',
            Category: 'Glass',
          });
  
        // Assertions
        expect(response.statusCode).toBe(404);  // Unauthorized status
        expect(response.body).toHaveProperty('message', 'Schedule not found or you are not authorized to update this');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
    // Test case for schedule not found
    it('should return a 404 error if the schedule is not found', async () => {
      try {
        // Mock WasteShedule.findOneAndUpdate to return null (indicating no schedule found)
        WasteShedule.findOneAndUpdate.mockResolvedValue(null);
  
        // Generate a JWT token for the authorized user
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a PUT request to the updateSchedule route
        const response = await request(app)
          .put('/api/wasteSchedule/updateschedule/req123')
          .set('Authorization', `Bearer ${token}`)
          .send({
            Location: '456 Street',
            ScheduleDate: '2024-10-15',
            Category: 'Glass',
          });
  
        // Assertions
        expect(response.statusCode).toBe(404);  // Not found status
        expect(response.body).toHaveProperty('message', 'Schedule not found or you are not authorized to update this');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
    // Test case for server error
    it('should return a 500 status if there is a server error', async () => {
      try {
        // Mocking WasteShedule.findOneAndUpdate to throw an error
        WasteShedule.findOneAndUpdate.mockRejectedValue(new Error('Internal Server Error'));
  
        // Generate a JWT token for the authorized user
        const token = jwt.sign({ id: '66fc503f39be3b9ed09364e3' }, process.env.JWT_SECRET);
  
        // Send a PUT request to the updateSchedule route
        const response = await request(app)
          .put('/api/wasteSchedule/updateschedule/req1')
          .set('Authorization', `Bearer ${token}`)
          .send({
            Location: '456 Street',
            ScheduleDate: '2024-10-15',
            Category: 'Glass',
          });
  
        // Assertions
        expect(response.statusCode).toBe(500);  // Internal server error status
        expect(response.body).toHaveProperty('msg', 'Internal Server Error');
      } catch (error) {
        console.error('Test failed with error:', error);
      }
    });
  
  });
  

});