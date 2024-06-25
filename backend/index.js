require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const moment = require("moment");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var bodyParser = require("body-parser");
const nm = require("nodemailer");
const app = express();

const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173']
}));


const port = process.env.PORT || 5000;

const [basic, premium, premiumplus] = ['price_1PNau1RuhCWG0gwCMsPoa8QD', 'price_1PNayoRuhCWG0gwCZFtFjF2k', 'price_1PNb12RuhCWG0gwC0mdZWZD0'];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shanmukh-9be27-default-rtdb.firebaseio.com",
});

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const stripeSession = async (plan) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan,
          quantity: 1
        }
      ],
      success_url: "http://localhost:3000/home/feed",
      cancel_url: "http://localhost:3000/Premium",
    });
    return session;
  } catch (error) {
    return error
  }
};

app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
  const { plan, customerId } = req.body;
  let planId = null;
  if (plan == 99) {
    planId = basic;
  } else if (plan == 299) {
    planId = premium;
  } else if (plan == 499) {
    planId = premiumplus;
  }

  try {
    const session = await stripeSession(planId);
    const user = await admin.auth().getUser(customerId);

    await admin.database().ref("users").child(user.uid).update({
      subscription: { sessionId: session.id }
    });
    console.log(session);
    return res.json({ session });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: 'An error occurred' }); // Send a generic error message
  }

});


let session = "";
let endpointSecret = "whsec_CQRYLwsXnvQbzB8UbxMXJypzIDm5vdwy";

app.post('/webhooks', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      session = event.data.object;
      console.log(session);
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.completed':
      session = event.data.object;
      console.log(session);
      const userCollection = client.db("database").collection("users");
      const user = await userCollection.findOne({
        email: session.customer_details.email,
      });
      if (user) {
        await userCollection.updateOne(
          {
            email: session.customer_details.email,
          },
          {
            $set: { subscription: true },
          }
        );
      }
      let emailto = `${session.customer_details.email}`;
      if (session.payment_link === "plink_1PP5lnRuhCWG0gwCRGx3QyGf") {
        // subscriptionNumber = 1;
        await userCollection.updateOne(
          { email: emailto },
          { $set: { isSubscribed: 1 } }
        );
        // set subscription expiry to 1 month from present date
        await userCollection.updateOne(
          { email: emailto },
          { $set: { subscriptionExpiry: Date.now() + 2592000000 } }
        );
      } else if (session.payment_link === "plink_1PQ6ixRuhCWG0gwCmTBRgq3d") {
        // subscriptionNumber = 2;
        await userCollection.updateOne(
          { email: emailto },
          { $set: { isSubscribed: 2 } }
        );
        // set subscription expiry to 1 month from present date
        await userCollection.updateOne(
          { email: emailto },
          { $set: { subscriptionExpiry: Date.now() + 2592000000 } }
        );

      } else if (session.payment_link === "plink_1PQqQmRuhCWG0gwCpERyX0n5") {
        // subscriptionNumber = 3;
        await userCollection.updateOne(
          { email: emailto },
          { $set: { isSubscribed: 3 } }
        );
        // set subscription expiry to 1 month from present date
        await userCollection.updateOne(
          { email: emailto },
          { $set: { subscriptionExpiry: Date.now() + 2592000000 } }
        );

      }
      let info = await transport.sendMail({
        from: process.env.EMAIL,
        to: `${session.customer_details.email}`,
        subject: "Thank you for subscribing to our service",
        html: `<p>Payment  is successful</p>`,
      });
      console.log("message sent", info.messageId);
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post("/sendotp", (req, res) => {
  let email = req.body.email;
  let digits = "0123456789";
  let limt = 4;
  let otp = "";
  for (let i = 0; i < limt; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  var Options = {
    from: "varadaraju758@gmail.com",
    to: email,
    subject: "OTP for verification",
    html: `<p>Enter OTP for verification is ${otp}</p>`,
  };
  transport.sendMail(Options, function (error, info) {
    if (error) {
      res.status(500).send("Failed to send OTP");
    } else {
      savedOtps[email] = otp;
      setTimeout(() => {
        delete savedOtps[email];
      }, 60000);
      res.send("OTP sent successfully");
    }
  });

});

app.post("/verifyotp", (req, res) => {
  let receivedOtp = req.body.otp;
  let email = req.body.email;
  if (savedOtps[email] == receivedOtp) {
    res.send("verified");
  } else {
    res.status(500).send("Invalid OTP");
  }
});



let savedOtps = {};
var transport = nm.createTransport(
  {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      // pass: "nmav zdty chrj zqgc",
      pass: process.env.PASSWORD,
    },
  }
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});



// const uri = `mongodb+srv://varadaraju758:Shanmukh@cluster0.e5kvfke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri=process.env.MONGO_URI;


const client = new MongoClient(uri, {});


async function run() {
  try {
    await client.connect();
    const postCollection = client.db("database").collection("posts");
    const userCollection = client.db("database").collection("users");
    const videoCollection = client.db("database").collection("videos");



    app.get("/posts", async (req, res) => {
      const posts = (await postCollection.find().toArray()).reverse();
      res.json(posts);
    });

    app.get("/users", async (req, res) => {
      const user = await userCollection.find().toArray();
      res.json(user);
    });

    app.get("/loggedInUser", async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.find({ email: email }).toArray();
      res.send(user);
    });

    app.get("/userPosts", async (req, res) => {
      const email = req.query.email;
      const posts = (
        await postCollection.find({ email: email }).toArray()
      ).reverse();
      res.send(posts);
    });

    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
      // console.log(result);
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post("/videos", async (req, res) => {
      
      try {
        const video = req.body;
      const upvotedvideo = { video, upvotes: 1 };
      const result = await videoCollection.insertOne(upvotedvideo);
      res.send(result);

      } catch (error) {
         console.log(error);
         res.status(500).send("Error in uploading video");
      }
    });

    app.patch("/userUpdates/:email", async (req, res) => {
      // const filter = req.params;
      const profile = req.body;
      console.log("profile",profile.profileimage);
      console.log("profile",profile.coverImage);
      const options = { upsert: true };
      console.log("options",options);
      const updateDoc = { $set: profile };
      console.log("updateDoc",updateDoc);
      const result = await userCollection.updateOne( updateDoc, options);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
