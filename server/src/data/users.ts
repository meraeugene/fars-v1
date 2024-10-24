import bcrypt from "bcryptjs";

const users = [
  {
    pin: bcrypt.hashSync("0969", 10),
  },
];

export default users;
