import mongoose, { Schema, Document } from "mongoose";

interface AdminDocument extends Document {
  pin: string;
}

const adminSchema = new Schema<AdminDocument>({
  pin: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
