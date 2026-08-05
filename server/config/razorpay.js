const Razorpay = require("razorpay");

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TLvwTXbLFNy4u0";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "iQdIl4E7wWlUk3wH5bQkQadE";

if (!key_id || !key_secret) {
  console.warn("[RAZORPAY CONFIG WARNING] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment.");
}

const razorpay = new Razorpay({
  key_id,
  key_secret
});

module.exports = {
  razorpay,
  key_id,
  key_secret
};
