import { Notification } from "./slices/notificationsSlice";

export interface ErrorResponse {
  data?: {
    error?: string;
    message?: string;
  };
  error?: string;
}

interface Reply {
  reply: string;
  name: string;
  createdAt?: Date;
}

export interface Review {
  _id: string;
  feedback: string;
  name: string;
  rating: number; // Assuming the rating is a number
  likes: number;
  liked: boolean;
  acknowledged: boolean;
  image: string;
  replies: Reply[]; // Array of Reply objects
}

export interface RootState {
  auth: {
    adminToken: string;
  };
  notifications: Notification[];
}
