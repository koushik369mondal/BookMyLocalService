const loginController = require("./login.controller");
const registerController = require("./register.controller");
const otpController = require("./otp.controller");
const userController = require("./user.controller");

module.exports = {
    ...loginController,
    ...registerController,
    ...otpController,
    ...userController
};
