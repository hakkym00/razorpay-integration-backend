const express = require("express");
const Razorpay = require("razorpay");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const port = 5000;
dotenv.config();

app.use(cors());
app.use(express.json());

const instance = new Razorpay({
  key_id: process.env.KEY__ID, //input your test razorpay key id
  key_secret: process.env.KEY__SECRET, //input your test razorpay key secret
});

const secret = "123456789"; // input webhook String secret for verificatiom

app.post("/verification", (req, res) => {
  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);
  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    //   Process payment
  } else {
    //   pass it
  }

  res.json({ status: "ok" });
});

//To create order

app.get("/razorpay", async (req, res) => {
  const options = {
    amount: "500000",
    currency: "INR",
    receipt: "receipt#1",
    payment_capture: 1,
  };
  try {
    const order = await instance.orders.create(options);
    if (order) {
      res.send({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
      });
      console.log(order);
    }
  } catch (error) {
    res.status(404).send("PaymentId Not Found");
  }
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
