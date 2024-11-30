const request = require("supertest");
const express = require("express");
const router = require("../../routes/userRoutes"); // Replace with your actual router file path
const User = require("../../models/userModel");
const userEmailVerificationModel = require("../../models/userEmailVerificationModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

jest.mock("../../models/userModel");
jest.mock("../../models/userEmailVerificationModel");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("User Authentication and Email Verification Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new user and send OTP", async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({ email: "testuser@example.com" });
      userEmailVerificationModel.prototype.save = jest.fn().mockResolvedValue({ otp: "123456" });

      const response = await request(app).post("/api/register").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User registered successfully. OTP sent to email.");
      expect(User.prototype.save).toHaveBeenCalled();
      expect(userEmailVerificationModel.prototype.save).toHaveBeenCalled();
    });
  });



describe("POST /verify-otp", () => {
    it("should verify OTP and mark user as verified", async () => {
      const mockOtpRecord = {
        email: "testuser@example.com",
        otp: "123456",
        expiredAt: new Date(Date.now() + 1 * 60 * 1000),
      };
  
      userEmailVerificationModel.findOne.mockResolvedValueOnce(mockOtpRecord);
      userEmailVerificationModel.findOneAndDelete.mockResolvedValueOnce({});
      User.findOneAndUpdate.mockResolvedValueOnce({ email: "testuser@example.com" });
  
      const response = await request(app).post("/api/verify-otp").send({
        email: "testuser@example.com",
        otp: "123456",
      });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Email verified successfully!");
      expect(userEmailVerificationModel.findOne).toHaveBeenCalledWith({
        email: "testuser@example.com", 
        otp: "123456"
      });
      expect(userEmailVerificationModel.findOneAndDelete).toHaveBeenCalledWith({ 
        email: "testuser@example.com" 
      });
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { email: "testuser@example.com" }, 
        { isVerified: true }
      );
    });
  
    it("should return 400 if the OTP is invalid", async () => {
      userEmailVerificationModel.findOne.mockResolvedValueOnce(null);
  
      const response = await request(app).post("/api/verify-otp").send({
        email: "testuser@example.com",
        otp: "wrongOtp",
      });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid OTP or email.");
    });
  
    it("should return 400 if the OTP has expired", async () => {
      const mockExpiredOtpRecord = {
        email: "testuser@example.com",
        otp: "123456",
        expiredAt: new Date(Date.now() - 1 * 60 * 1000),
      };
  
      userEmailVerificationModel.findOne.mockResolvedValueOnce(mockExpiredOtpRecord);
      userEmailVerificationModel.findOneAndDelete.mockResolvedValueOnce({});
  
      const response = await request(app).post("/api/verify-otp").send({
        email: "testuser@example.com",
        otp: "123456",
      });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("OTP has expired. Please request a new one.");
    });
  });

describe("POST /resend-otp", () => {
    it("should resend OTP for an unverified user", async () => {
      const mockUser = { 
        email: "testuser@example.com", 
        isVerified: false 
      };
  
      User.findOne.mockResolvedValueOnce(mockUser);
      userEmailVerificationModel.findOneAndUpdate.mockResolvedValueOnce({});
  
      const response = await request(app).post("/api/resend-otp").send({
        email: "testuser@example.com",
      });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("New OTP sent to email.");
    });
  
    it("should return 400 if user does not exist", async () => {
      User.findOne.mockResolvedValueOnce(null);
  
      const response = await request(app).post("/api/resend-otp").send({
        email: "nonexistent@example.com",
      });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User does not exist.");
    });
  
    it("should return 400 if user is already verified", async () => {
      const mockUser = { 
        email: "testuser@example.com", 
        isVerified: true 
      };
  
      User.findOne.mockResolvedValueOnce(mockUser);
  
      const response = await request(app).post("/api/resend-otp").send({
        email: "testuser@example.com",
      });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is already verified.");
    });
  });
  
  describe("POST /login", () => {
    it("should log in a verified user and return a token", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);
        
        // Mock jwt token generation
        const mockToken = 'fake-jwt-token';
        jwt.sign = jest.fn().mockReturnValue(mockToken);
    
        // Mock user finding and password comparison
        User.findOne = jest.fn().mockResolvedValue({
          _id: 'user123',
          email: "testuser@example.com",
          password: hashedPassword,
          isVerified: true,
          isAdmin: false
        });
    
        // Mock password comparison
        bcrypt.compare = jest.fn().mockResolvedValue(true);
    
        const response = await request(app)
          .post("/api/login")
          .send({
            email: "testuser@example.com",
            password: "password123",
          });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful.");
        expect(response.body.token).toBe(mockToken);
        expect(User.findOne).toHaveBeenCalledWith({ email: "testuser@example.com" });
        expect(bcrypt.compare).toHaveBeenCalled();
      });
  
    it("should handle login failure for unverified user", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        email: "testuser@example.com",
        isVerified: false,
      });
  
      const response = await request(app)
        .post("/api/login")
        .send({
          email: "testuser@example.com",
          password: "password123",
        });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User is not verified. Please verify your email.");
    });
  
    it("should handle incorrect password", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      
      User.findOne = jest.fn().mockResolvedValue({
        email: "testuser@example.com",
        password: hashedPassword,
        isVerified: true,
      });
  
      bcrypt.compare = jest.fn().mockResolvedValue(false);
  
      const response = await request(app)
        .post("/api/login")
        .send({
          email: "testuser@example.com",
          password: "wrongpassword",
        });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid credentials.");
    });
  
    it("should handle non-existent user", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
  
      const response = await request(app)
        .post("/api/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User does not exist.");
    });
  });

describe("POST /forgot-password", () => {
    it("should send OTP for password reset", async () => {
      const mockUser = { email: "testuser@example.com" };
  
      User.findOne.mockResolvedValueOnce(mockUser);
      userEmailVerificationModel.findOneAndUpdate.mockResolvedValueOnce({});
  
      const response = await request(app).post("/api/forgot-password").send({
        email: "testuser@example.com",
      });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("OTP sent to your email.");
    });
  
    it("should return 404 if user does not exist", async () => {
      User.findOne.mockResolvedValueOnce(null);
  
      const response = await request(app).post("/api/forgot-password").send({
        email: "nonexistent@example.com",
      });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User with this email does not exist.");
    });
  });

describe("POST /verify-reset-otp", () => {
    it("should verify reset OTP successfully", async () => {
      const mockOtpRecord = {
        email: "testuser@example.com",
        otp: "123456",
        expiredAt: new Date(Date.now() + 1 * 60 * 1000),
      };
  
      userEmailVerificationModel.findOne.mockResolvedValueOnce(mockOtpRecord);
  
      const response = await request(app).post("/api/verify-reset-otp").send({
        email: "testuser@example.com",
        otp: "123456",
      });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("OTP verified successfully. You can now reset your password.");
    });
  
    it("should return 400 if reset OTP is invalid", async () => {
      userEmailVerificationModel.findOne.mockResolvedValueOnce(null);
  
      const response = await request(app).post("/api/verify-reset-otp").send({
        email: "testuser@example.com",
        otp: "wrongOtp",
      });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid OTP or email.");
    });
  
    it("should return 400 if reset OTP is expired", async () => {
      const mockExpiredOtpRecord = {
        email: "testuser@example.com",
        otp: "123456",
        expiredAt: new Date(Date.now() - 1 * 60 * 1000),
      };
  
      userEmailVerificationModel.findOne.mockResolvedValueOnce(mockExpiredOtpRecord);
      userEmailVerificationModel.findOneAndDelete.mockResolvedValueOnce({});
  
      const response = await request(app).post("/api/verify-reset-otp").send({
        email: "testuser@example.com",
        otp: "123456",
      });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("OTP has expired. Please request a new one.");
    });
  });


  //===============================================================


  describe("POST /reset-password", () => {
    it("should reset the user's password", async () => {
      const email = "testuser@example.com";
      const newPassword = "newPassword123";
  
      // Mock OTP record lookup
      userEmailVerificationModel.findOne.mockResolvedValueOnce({
        email,
        otp: "654321",
        expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      });
  
      // Mock user retrieval
      const hashedPassword = await bcrypt.hash("password123", 10);
      const mockUser = {
        email,
        password: hashedPassword,
        save: jest.fn(), // Mock the save method
      };
      User.findOne.mockResolvedValueOnce(mockUser);
  
      // Mock password hashing
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      jest.spyOn(bcrypt, "hash").mockResolvedValueOnce(newHashedPassword);
  
      // Mock OTP deletion
      userEmailVerificationModel.findOneAndDelete.mockResolvedValueOnce({});
  
      // Make the request
      const response = await request(app).post("/api/reset-password").send({
        email,
        newPassword,
        confirmPassword: newPassword,
      });
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password reset successfully.");
  
      // Check if the user's password was updated
      expect(mockUser.password).toBe(newHashedPassword);
      expect(mockUser.save).toHaveBeenCalled(); // Ensure save() was called
  
      // Ensure OTP record was deleted
      expect(userEmailVerificationModel.findOneAndDelete).toHaveBeenCalledWith({ email });
    });
  });







  describe("POST /reset-password", () => {
    it("should reset password successfully", async () => {
      const mockUser = { 
        email: "testuser@example.com",
        save: jest.fn().mockResolvedValue(true)
      };
  
      User.findOne.mockResolvedValueOnce(mockUser);
      userEmailVerificationModel.findOneAndDelete.mockResolvedValueOnce({});
  
      const response = await request(app).post("/api/reset-password").send({
        email: "testuser@example.com",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password reset successfully.");
    });
  
    it("should return 400 if passwords do not match", async () => {
      const response = await request(app).post("/api/reset-password").send({
        email: "testuser@example.com",
        newPassword: "newpassword123",
        confirmPassword: "differentpassword",
      });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Passwords do not match.");
    });
  
    it("should return 404 if user does not exist", async () => {
      User.findOne.mockResolvedValueOnce(null);
  
      const response = await request(app).post("/api/reset-password").send({
        email: "nonexistent@example.com",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User does not exist.");
    });
  });


//==================================END USER ROUTES TESTS==================================

//   describe('GET /user/:id', () => {
//     // Successful user retrieval
//     it('should return user details when valid ID is provided', async () => {
//       const mockUser = {
//         _id: '60d5ecb8b3b3a3001f3e1234',
//         name: 'John Doe',
//         email: 'testuser@example.com',
//         isAdmin: false
//       };
  
//       // Mock User.findById to return a user
//       User.findById = jest.fn().mockReturnValue({
//         select: jest.fn().mockResolvedValue(mockUser)
//       });
  
//       const response = await request(app)
//         .get(`/user/${mockUser._id}`)
//         .expect(200);
  
//       expect(response.body.user).toEqual(mockUser);
//       expect(response.body.user.password).toBeUndefined();
//     });
  
//     // User not found scenario
//     it('should return 404 when user does not exist', async () => {
//       const nonExistentUserId = '60d5ecb8b3b3a3001f3e9999';
  
//       // Mock User.findById to return null
//       User.findById = jest.fn().mockReturnValue({
//         select: jest.fn().mockResolvedValue(null)
//       });
  
//       const response = await request(app)
//         .get(`/user/${nonExistentUserId}`)
//         .expect(404);
  
//       expect(response.body.message).toBe('User not found.');
//     });
  
//     // Server error scenario
//     it('should handle server errors gracefully', async () => {
//       const userId = '60d5ecb8b3b3a3001f3e1234';
  
//       // Mock User.findById to throw an error
//       User.findById = jest.fn().mockReturnValue({
//         select: jest.fn().mockRejectedValue(new Error('Database connection failed'))
//       });
  
//       const response = await request(app)
//         .get(`/user/${userId}`)
//         .expect(500);
  
//       expect(response.body.message).toBe('Server error.');
//     });
  
//     // Invalid ObjectId scenario
//     it('should handle invalid MongoDB ObjectId', async () => {
//       const invalidUserId = 'invalid-id';
  
//       const response = await request(app)
//         .get(`/user/${invalidUserId}`)
//         .expect(500);
  
//       expect(response.body.message).toBe('Server error.');
//     });
//     it("should retrieve user details successfully", async () => {
//       const mockUser = {
//         _id: "60d5ecb8b3b3a3001f3e1234",
//         email: "testuser@example.com",
//         isAdmin: false,
//         isVerified: true,
//         imageUrl: "https://example.com/avatar.jpg"
//       };
  
//       // Mock User.findById
//       User.findById = jest.fn().mockReturnValue({
//         select: jest.fn().mockResolvedValue(mockUser)
//       });
  
//       // Make the request
//       const response = await request(app)
//         .get(`/user/${mockUser._id}`)
//         .send();
  
//       // Assertions
//       expect(response.status).toBe(200);
//       expect(response.body.user).toEqual(mockUser);
//       expect(response.body.user.password).toBeUndefined();
//     });
  
//     it("should return 404 when user is not found", async () => {
//       const nonExistentUserId = "60d5ecb8b3b3a3001f3e9999";
  
//       // Mock User.findById to return null
//       User.findById = jest.fn().mockReturnValue({
//         select: jest.fn().mockResolvedValue(null)
//       });
  
//       // Make the request
//       const response = await request(app)
//         .get(`/user/${nonExistentUserId}`)
//         .send();
  
//       // Assertions
//       expect(response.status).toBe(404);
//       expect(response.body.message).toBe("User not found.");
//     });


//   });




  describe("GET /getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { _id: "user1", name: "User One", email: "user1@example.com" },
        { _id: "user2", name: "User Two", email: "user2@example.com" },
      ];
  
      User.find.mockResolvedValueOnce(mockUsers);
  
      const response = await request(app).get("/api/getAllUsers");
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalled();
    });
  
    it("should return an empty array if no users are found", async () => {
      User.find.mockResolvedValueOnce([]);
  
      const response = await request(app).get("/api/getAllUsers");
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(User.find).toHaveBeenCalled();
    });
  
    it("should return 500 on server error", async () => {
      User.find.mockRejectedValueOnce(new Error("Database error"));
  
      const response = await request(app).get("/api/getAllUsers");
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
      expect(User.find).toHaveBeenCalled();
    });
  });  
});
