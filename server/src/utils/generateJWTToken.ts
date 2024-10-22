import jwt from "jsonwebtoken";
import { Response } from "express";

const generateJWTToken = (res: Response, role: string) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  if (!jwtSecretKey) {
    // Handle the case where JWT_SECRET_KEY is not defined
    console.error(
      "JWT_SECRET_KEY is not defined in the environment variables."
    );
    // You might want to throw an error or handle it in a way that makes sense for your application.
    return;
  }

  const token = jwt.sign({ role }, jwtSecretKey, {
    expiresIn: "7d",
  });

  // Set JWT as HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    // Use "none" for cross-site environments
    // sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365 * 7, // 7 days
  });
};

export default generateJWTToken;
