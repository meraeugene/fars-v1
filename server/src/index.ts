import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import connectDb from "./config/db";
// import userRoutes from "./routes/userRoutes";
import uploadImageRoutes from "./routes/uploadImageRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import adminRoutes from "./routes/adminRoutes";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
// import job from "./cron/cron";
import http from "http"; // Import HTTP
import { Server } from "socket.io"; // Import Socket.IO

const port = process.env.PORT || 5000;

connectDb();
// job.start();

const app = express();
const server = http.createServer(app); // Create an HTTP server

// app.use(
//   cors({
//     origin: "",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

// Middleware configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Set up Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to your client's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Cookie parser middleware
app.use(cookieParser());

// app.use("/api/users", userRoutes);
app.use("/api/upload", uploadImageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  // any route that is not an api will be redirected to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(port, () => console.log(`Server running on port ${port} `));

export { io }; // Export io to use in other files like review controller
