import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import generateJWTToken from "../utils/generateJWTToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import Admin from "../models/adminModel";

// Ensure JWT secret key is defined
const jwtSecretKey = process.env.JWT_SECRET_KEY;

if (!jwtSecretKey) {
  throw new Error(
    "JWT secret key is not defined. Please set the JWT_SECRET_KEY environment variable."
  );
}

// @desc Validate admin PIN
// @route POST /api/admin/login
const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { pin } = req.body;

  // Validate the provided PIN
  if (!pin) {
    return res.status(400).json({ message: "PIN is required" }); // Error if PIN is empty
  }

  const admin = await Admin.findOne();

  if (!admin) {
    return res.status(500).json({ message: "Admin data not found" });
  }

  const isMatch = await bcrypt.compare(pin, admin.pin);

  if (!isMatch) {
    return res.status(403).json({
      message: "Invalid PIN. Please check the PIN you entered and try again.",
    });
  }

  generateJWTToken(res, "admin");

  return res.status(200).json({ message: "Login successful", success: true });
});

/// @desc Reset admin PIN
// @route PUT /api/admin/reset-pin
const resetAdminPin = asyncHandler(async (req: Request, res: Response) => {
  const { newPin, oldPin } = req.body;

  // Validate inputs
  if (!oldPin || !newPin) {
    return res
      .status(400)
      .json({ message: "Both old PIN and new PIN are required" });
  }

  // Validate PIN lengths
  if (oldPin.length < 4) {
    return res
      .status(400)
      .json({ message: "Old PIN must be at least 4 digits" });
  }

  if (newPin.length < 4) {
    return res
      .status(400)
      .json({ message: "New PIN must be at least 4 digits" });
  }

  const admin = await Admin.findOne();

  if (!admin) {
    return res.status(500).json({ message: "Admin data not found" });
  }

  // Compare oldPin with hashed PIN
  const isMatch = await bcrypt.compare(oldPin, admin.pin);

  // Validate old PIN match
  if (!isMatch) {
    return res.status(403).json({
      message: "The old PIN you entered is incorrect. Please try again.",
    });
  }

  // Ensure the new PIN is different from the old (plain-text comparison)
  const newPinIsSame = await bcrypt.compare(newPin, admin.pin);
  if (newPinIsSame) {
    return res.status(400).json({
      message: "The new PIN must be different from the old PIN.",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPin = await bcrypt.hash(newPin, salt);

  // Reset the PIN
  admin.pin = hashedNewPin;
  await admin.save();

  return res.status(200).json({
    message: "Admin PIN has been reset successfully",
  });
});

// @desc Verify token and check expiration
// @route GET /api/admin/verify-token
const verifyToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.jwt; // Assuming the token is stored in cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey) as JwtPayload;
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp && decoded.exp < now) {
      // Token is expired
      res.clearCookie("jwt"); // Clear the cookie
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }

    // Token is valid and not expired
    return res.status(200).json({ message: "Token is valid.", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
});

// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access Public
const adminLogout = asyncHandler(async (req: Request, res: Response) => {
  try {
    // use this if same site ang backend and client host
    res.clearCookie("jwt");

    //  use this if different site ang backend and client host
    // res.clearCookie("jwt", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development", // secure: true in production
    //   sameSite: "none", // Ensure cookies can be shared between different domains
    // });

    // Respond with a 200 OK status and a success message
    res.status(200).json({ message: "Log out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export { adminLogin, adminLogout, verifyToken, resetAdminPin };
