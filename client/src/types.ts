export interface ErrorResponse {
  data?: {
    error?: string;
    message?: string;
  };
  error?: string;
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
}

export interface RootState {
  auth: {
    adminToken: string;
  };
}
