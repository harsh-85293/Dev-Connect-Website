const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

// ENV config
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "";
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || "";
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";

function generateXVerify(payloadBase64, path) {
  const toSign = payloadBase64 + path + PHONEPE_SALT_KEY;
  const hash = crypto.createHash("sha256").update(toSign).digest("hex");
  return hash + "###" + PHONEPE_SALT_INDEX;
}

// Create PhonePe Pay Page session
router.post("/payments/phonepe/create", userAuth, async (req, res) => {
  try {
    if (!PHONEPE_MERCHANT_ID || !PHONEPE_SALT_KEY) {
      return res.status(500).json({ message: "PhonePe credentials not configured on server" });
    }

    const {
      amount = 9900, // in paise
      membershipTier = "silver", // silver | gold
      productName = "DevConnect Premium",
      productDescription = "Unlock premium features",
    } = req.body || {};

    const merchantTransactionId = `${req.user._id.toString()}_${Date.now()}`;
    const merchantUserId = req.user._id.toString();

    const redirectUrl = `${process.env.FRONTEND_BASE_URL || "http://localhost:5173"}/checkout/phonepe/success?txnId=${merchantTransactionId}&tier=${membershipTier}`;
    const callbackUrl = `${process.env.BACKEND_BASE_URL || "http://localhost:3000"}/payments/phonepe/callback`; // optional server callback

    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId,
      amount,
      redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl,
      paymentInstrument: { type: "PAY_PAGE" },
      deviceContext: { deviceOS: "WEB" },
      paymentScope: "LOCAL",
      // Note: We will pass membership tier back via query params; metadata is limited here
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const path = "/pg/v1/pay";
    const xVerify = generateXVerify(payloadBase64, path);

    const url = `${PHONEPE_BASE_URL}${path}`;
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
    };

    const phonepeRes = await axios.post(url, { request: payloadBase64 }, { headers });

    if (phonepeRes?.data?.success && phonepeRes?.data?.data?.instrumentResponse?.redirectInfo?.url) {
      return res.status(200).json({ url: phonepeRes.data.data.instrumentResponse.redirectInfo.url, txnId: merchantTransactionId });
    }

    return res.status(500).json({ message: phonepeRes?.data?.message || "Failed to create PhonePe session" });
  } catch (err) {
    console.error("PhonePe create error:", err?.response?.data || err.message);
    return res.status(500).json({ message: err?.response?.data?.message || err.message || "PhonePe create failed" });
  }
});

// Optional server callback (not strictly needed for this demo)
router.post("/payments/phonepe/callback", async (req, res) => {
  res.status(200).send("OK");
});

// Confirm PhonePe payment and set tier
router.post("/payments/phonepe/confirm", userAuth, async (req, res) => {
  try {
    const { txnId, membershipTier } = req.body || {};
    if (!txnId) {
      return res.status(400).json({ message: "txnId is required" });
    }
    if (!PHONEPE_MERCHANT_ID || !PHONEPE_SALT_KEY) {
      return res.status(500).json({ message: "PhonePe credentials not configured on server" });
    }

    const statusPath = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${txnId}`;
    const xVerify = generateXVerify("", statusPath); // For status, signature is sha256(path + saltKey)
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
    };
    const url = `${PHONEPE_BASE_URL}${statusPath}`;
    const statusRes = await axios.get(url, { headers });

    const isPaid = statusRes?.data?.success && statusRes?.data?.code === "PAYMENT_SUCCESS";
    if (!isPaid) {
      return res.status(400).json({ message: statusRes?.data?.message || "Payment not completed" });
    }

    // Activate membership
    const tier = membershipTier === 'gold' ? 'gold' : 'silver';
    req.user.isPremium = true;
    req.user.membershipTier = tier;
    req.user.premiumActivatedAt = new Date();
    await req.user.save();

    return res.status(200).json({ message: "Premium activated", user: req.user });
  } catch (err) {
    console.error("PhonePe confirm error:", err?.response?.data || err.message);
    return res.status(500).json({ message: err?.response?.data?.message || err.message || "PhonePe confirm failed" });
  }
});

module.exports = router;


