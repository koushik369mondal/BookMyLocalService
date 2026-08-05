const bookingService = require("../booking/booking.service");

/**
 * Fetch checkout details for a booking
 */
const getCheckoutDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      console.warn(`[CHECKOUT 404] Booking not found: '${bookingId}' requested by user '${req.user?.id}'`);
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
        reason: "BOOKING_NOT_FOUND"
      });
    }

    const customerId = booking.customerId || booking.customer?.id;
    const isOwner = customerId && customerId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isAdmin && !isOwner) {
      console.warn(`[CHECKOUT 403] Authorization denied for GET checkout details. User ID: '${req.user?.id}' (role: '${req.user?.role}'), Booking ID: '${bookingId}', Booking Customer ID: '${customerId}'`);
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access checkout for this booking.",
        reason: "BOOKING_OWNERSHIP_MISMATCH"
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error in getCheckoutDetails controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve checkout details."
    });
  }
};

/**
 * Submit checkout (save billing, payment method info & finalize booking payment)
 */
const submitCheckout = async (req, res) => {
  try {
    const { bookingId, fullName, email, phone, street, city, state, zipCode, paymentMethod, discount, cardNumber } = req.body;

    const missingFields = [];
    if (!bookingId) missingFields.push("bookingId");
    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!street) missingFields.push("street");
    if (!city) missingFields.push("city");
    if (!state) missingFields.push("state");
    if (!zipCode) missingFields.push("zipCode");
    if (!paymentMethod) missingFields.push("paymentMethod");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required checkout fields: ${missingFields.join(", ")}.`,
        missingFields
      });
    }

    if (!/^\d{6}$/.test(zipCode)) {
      return res.status(400).json({
        success: false,
        message: "PIN code must be 6 digits."
      });
    }

    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      console.warn(`[CHECKOUT 404] Booking not found for submit: '${bookingId}' requested by user '${req.user?.id}'`);
      return res.status(404).json({
        success: false,
        message: "Booking not found in database.",
        reason: "BOOKING_NOT_FOUND"
      });
    }

    const customerId = booking.customerId || booking.customer?.id;
    const isOwner = customerId && customerId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isAdmin && !isOwner) {
      console.warn(`[CHECKOUT 403] Authorization denied for SUBMIT checkout. User ID: '${req.user?.id}' (role: '${req.user?.role}'), Booking ID: '${bookingId}', Booking Customer ID: '${customerId}'`);
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this booking.",
        reason: "BOOKING_OWNERSHIP_MISMATCH"
      });
    }

    const isDeclineName = fullName && fullName.toLowerCase().includes("error");
    const isDeclineCard = paymentMethod === "card" && cardNumber && cardNumber.replace(/\s+/g, "").includes("0000");

    if (isDeclineName || isDeclineCard) {
      return res.status(400).json({
        success: false,
        message: "Transaction declined. Please verify your payment credentials and try again."
      });
    }

    const status = "upcoming";
    const paymentStatus = paymentMethod === "cash" ? "pending" : "paid";

    const updateData = {
      billingName: fullName,
      billingEmail: email,
      billingPhone: phone,
      street,
      city,
      state,
      zipCode,
      paymentMethod,
      status,
      paymentStatus
    };

    if (discount !== undefined) {
      const disc = parseFloat(discount) || 0;
      updateData.discount = disc;
      const basePrice = booking.price || 0;
      const platformFee = booking.platformFee || 49.00;
      const tax = booking.tax || Math.round(basePrice * 0.18 * 100) / 100;
      updateData.total = Math.max(0, Math.round((basePrice + platformFee + tax - disc) * 100) / 100);
    }

    const updatedBooking = await bookingService.updateBooking(bookingId, updateData);

    return res.status(200).json({
      success: true,
      message: "Payment completed successfully.",
      data: updatedBooking
    });
  } catch (error) {
    console.error("Error in submitCheckout controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to process checkout payment."
    });
  }
};

/**
 * Complete payment authorization
 */
const processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, cardNumber } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "bookingId and paymentMethod are required."
      });
    }

    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      console.warn(`[PAYMENT 404] Booking not found for payment: '${bookingId}' requested by user '${req.user?.id}'`);
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
        reason: "BOOKING_NOT_FOUND"
      });
    }

    const customerId = booking.customerId || booking.customer?.id;
    const isOwner = customerId && customerId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isAdmin && !isOwner) {
      console.warn(`[CHECKOUT 403] Authorization denied for PROCESS payment. User ID: '${req.user?.id}' (role: '${req.user?.role}'), Booking ID: '${bookingId}', Booking Customer ID: '${customerId}'`);
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this booking.",
        reason: "BOOKING_OWNERSHIP_MISMATCH"
      });
    }

    const isDeclineName = booking.billingName && booking.billingName.toLowerCase().includes("error");
    const isDeclineCard = paymentMethod === "card" && cardNumber && cardNumber.replace(/\s+/g, "").includes("0000");

    if (isDeclineName || isDeclineCard) {
      return res.status(400).json({
        success: false,
        message: "Transaction declined. Please verify your payment credentials and try again."
      });
    }

    const status = "upcoming";
    const paymentStatus = paymentMethod === "cash" ? "pending" : "paid";

    const updatedBooking = await bookingService.updateBooking(bookingId, {
      status,
      paymentStatus,
      paymentMethod
    });

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully.",
      data: updatedBooking
    });
  } catch (error) {
    console.error("Error in processPayment controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to process payment."
    });
  }
};

const crypto = require("crypto");
const { razorpay, key_id, key_secret } = require("../../config/razorpay");

/**
 * Step 1: Create Razorpay Order
 * Endpoint: POST /api/payment/create-order or /api/create-order
 */
const createOrder = async (req, res) => {
  try {
    let { amount, currency = "INR", receipt, bookingId } = req.body;

    if (!amount && bookingId) {
      const booking = await bookingService.getBookingById(bookingId);
      if (booking && booking.total) {
        amount = Math.round(booking.total * 100);
      }
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required (in paise or Rupees)."
      });
    }

    let amountInPaise = parseInt(amount, 10);
    if (amountInPaise < 100 && amountInPaise >= 1) {
      amountInPaise = Math.round(amountInPaise * 100);
    }

    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least 100 paise (₹1)."
      });
    }

    const receiptId = receipt || `rcpt_${bookingId || Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: String(receiptId).substring(0, 40)
    };

    console.log(`[DEBUG] /create-order request received from user: '${req.user?.id || "unauthenticated"}' for bookingId: '${bookingId}'`);
    console.log(`[RAZORPAY CREATE ORDER] Creating order for Amount: ${options.amount} paise, Currency: ${options.currency}, Receipt: ${options.receipt}`);
    const order = await razorpay.orders.create(options);
    console.log("[DEBUG] /create-order Razorpay order created successfully:", { id: order.id, amount: order.amount, key_id });

    return res.status(200).json({
      success: true,
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: key_id,
      data: {
        order_id: order.id,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: key_id
      }
    });
  } catch (error) {
    console.error("[RAZORPAY CREATE ORDER ERROR]:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.error?.description || error.description || error.message || "Failed to create Razorpay order."
    });
  }
};

/**
 * Step 3: Verify Razorpay Payment Signature
 * Endpoint: POST /api/payment/verify-payment or /api/verify-payment
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required verification fields: razorpay_payment_id, razorpay_order_id, and razorpay_signature are required."
      });
    }

    console.log(`[RAZORPAY VERIFY] Verifying Payment ID: '${razorpay_payment_id}', Order ID: '${razorpay_order_id}'`);

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn(`[RAZORPAY VERIFY FAILED] Signature mismatch for Order ID: '${razorpay_order_id}'`);
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Verification failed."
      });
    }

    console.log(`[RAZORPAY VERIFY SUCCESS] Signature verified successfully for Order ID: '${razorpay_order_id}'`);

    let updatedBooking = null;
    if (bookingId) {
      updatedBooking = await bookingService.updateBooking(bookingId, {
        status: "upcoming",
        paymentStatus: "paid",
        paymentMethod: "razorpay"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment signature verified successfully.",
      data: {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        booking: updatedBooking
      }
    });
  } catch (error) {
    console.error("[RAZORPAY VERIFY ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify Razorpay payment."
    });
  }
};

module.exports = {
  getCheckoutDetails,
  submitCheckout,
  processPayment,
  createOrder,
  verifyPayment
};
