import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  name: string;
  createdAt: string;
  feedback: string;
}

const initialState: Notification[] = [];

const authSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.push(action.payload); // Add a new notification
    },
    clearNotifications: () => {
      return []; // Clears the notifications array
    },
  },
});

export const { addNotification, clearNotifications } = authSlice.actions;

export default authSlice.reducer;
