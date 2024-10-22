import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define a custom type for the extended request
interface CustomRequest extends Request {
  admin?: JwtPayload; // Add the admin property to store the decoded token
}

const jwtSecretKey = process.env.JWT_SECRET_KEY;

if (!jwtSecretKey) {
  throw new Error(
    "JWT secret key is not defined. Please set the JWT_SECRET_KEY environment variable."
  );
}

// Middleware to protect admin routes
const adminProtect = (
  req: CustomRequest, // Use the extended request type
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.jwt; // Get the token from cookies (or use headers if needed)

  if (!token) {
    res.status(403).json({
      message: "Session expired. Please log in again.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey) as JwtPayload; // Decode the token

    // Check if the decoded token has the role property and it's "admin"
    if (decoded.role !== "admin") {
      res
        .status(403)
        .json({ message: "Not authorized: Admin access required" });
      return;
    }

    // Attach decoded admin info to request
    req.admin = decoded;
    next(); // Call next() to continue
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};

export { adminProtect };
