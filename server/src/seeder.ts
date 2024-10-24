// Import other modules as usual
import dotenv from "dotenv";
import { bgGreen, bgRed } from "colorette";

// Data
import users from "./data/users";

// Models
import Admin from "./models/adminModel";

import connectDb from "./config/db";

dotenv.config();

connectDb();

const importData = async () => {
  try {
    await Admin.deleteMany();

    await Admin.insertMany(users);

    console.log(bgGreen("Data Imported!"));
    process.exit();
  } catch (error) {
    console.log(bgRed(`${error}`));
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Admin.deleteMany();

    console.log(bgRed("Data Destroyed"));
    process.exit();
  } catch (error) {
    console.log(bgRed(`${error}`));
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
