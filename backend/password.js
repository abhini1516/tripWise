const bcrypt = require("bcryptjs");
const hashedPassword = bcrypt.hashSync("abhini1516", 10);
console.log(hashedPassword);