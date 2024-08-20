const crypto = require("crypto");

// web
// async function encode(key, ...data) {
//   const encoder = new TextEncoder();
//   const hmacKey = await window.crypto.subtle.importKey(
//     "raw",
//     encoder.encode(key),
//     { name: "HMAC", hash: { name: "SHA-256" } },
//     false,
//     ["sign"]
//   );

//   const request = data.join("");

//   const hmac = await window.crypto.subtle.sign(
//     { name: "HMAC" },
//     hmacKey,
//     encoder.encode(request)
//   );

//   return Array.from(new Uint8Array(hmac))
//     .map((byte) => byte.toString(16).padStart(2, "0"))
//     .join("");
// }

// node
function encode(key, ...data) {
  const hmac = crypto.createHmac("sha256", key);

  const request = data.join("");

  hmac.update(request, "utf8");

  return hmac.digest("hex");
}
const express = require("express");
const router = express.Router();
const TrustlypaySecureData = require("./TrustlypaySecureData");

router.get("/", function (req, res) {
  res.render("index");
});

router.post("/request/client", function (req, res) {
  const BASE_URL =
    "https://trustlypay.in/pgtrustlypay/gateway/v1/initialrequest";
  const clientId = "ryapay_live_AYMfem4Mkt1QzaGj";
  const clientSecret = "4gJwFcJBffa8gWIA";
  const txncurr = "INR";
  const username = req.body.username;
  const amount = req.body.amount;
  const emailId = req.body.emailID;
  const mobileNumber = req.body.mobileNumber;
  const prodid = "prod_mG0GZFwILdHs8sAB";
  const requestHashKey = "nZEg9hiaauBMpv15";
  const saltKey = "9D1BYQCARkRJfW4y";
  const encryptionRequestKey = "zbYd0QH2AJ91RAGt";

  let signature;
  try {
    signature = encode(
      requestHashKey,
      clientId,
      clientSecret,
      txncurr,
      amount,
      emailId,
      mobileNumber
    );
    console.log(signature);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
    return;
  }

  const options = {
    clientId,
    clientSecret,
    txnCurr: txncurr,
    username,
    amount,
    emailId,
    mobileNumber,
    prodId: prodid,
    signature,
    udf1: "Optional Parameter89_.",
  };

  let encrypt;
  try {
    const rsd = new TrustlypaySecureData();
    encrypt = rsd.encryption(
      JSON.stringify(options),
      saltKey,
      encryptionRequestKey
    );
    console.log(encrypt);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
    return;
  }

  const formHtml = `
    <html>
      <head>
        <title>client</title>
      </head>
      <body onload="document.my_form.submit()">
        <form method="post" name="my_form" action=${BASE_URL}>
          <input type="hidden" name="clientId" value="${clientId}">
          <input type="hidden" name="encrypt" value="${encrypt}">
          <input type="submit" style="display:none">
        </form>
      </body>
    </html>
  `;

  res.send(formHtml);
});

router.post("/response", (req, res) => {
  const rp = req.body;
  const secureData = req.body.secureData;

  const responseHashKey = "ynVyziQgHfyWQv1l";
  const responseSaltKey = "OvEaLVCTcN74EED4";
  const encryptionResponseKey = "k2oEhCZOf4MBoBcF";

  const rsd = new TrustlypaySecureData();
  let decrypt;
  try {
    decrypt = rsd.decryption(
      secureData,
      responseSaltKey,
      encryptionResponseKey
    );
  } catch (e1) {
    console.error(e1);
  }
  console.log(decrypt);

  const mapper = new ObjectMapper();
  let signature;
  try {
    rp = mapper.readValue(decrypt, ResponcePojo);

    if (rp.getSignature() === null) {
      res.render("thankyou", {
        status_code: rp.getStatus(),
        clientId: rp.getClientId(),
        desc: rp.getDescription(),
      });
      return;
    }

    signature = encode(
      responseHashKey,
      rp.getStatus(),
      rp.getOrderId(),
      rp.getTransactionId(),
      rp.getBankId(),
      rp.getDescription()
    );
    console.log(signature);

    if (signature.trim() === rp.getSignature().trim()) {
      res.render("thankyou", {
        status_code: rp.getStatus(),
        clientId: rp.getClientId(),
        order_id: rp.getOrderId(),
        bank_id: rp.getBankId(),
        txn_id: rp.getTransactionId(),
        txnCurr: rp.getTxnCurr(),
        amount: rp.getAmount(),
        txn_email: rp.getEmailId(),
        txn_mobile: rp.getMobileNumber(),
        signature: rp.getSignature(),
        date: rp.getDate(),
        desc: rp.getDescription(),
      });
      return;
    } else {
      res.render("thankyou", {
        status_code: rp.getStatus(),
        clientId: rp.getClientId(),
        order_id: rp.getOrderId(),
        bank_id: rp.getBankId(),
        txn_id: rp.getTransactionId(),
        txnCurr: rp.getTxnCurr(),
        amount: rp.getAmount(),
        txn_email: rp.getEmailId(),
        txn_mobile: rp.getMobileNumber(),
        signature: rp.getSignature(),
        date: rp.getDate(),
        desc: rp.getDescription(),
      });
      return;
    }
  } catch (e1) {
    console.error(e1);
  }
});
