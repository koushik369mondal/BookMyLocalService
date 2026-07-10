require('dotenv').config();
console.log("--- Env Var Test ---");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? `Defined (length: ${process.env.EMAIL_PASS.length})` : "Undefined/Empty");
