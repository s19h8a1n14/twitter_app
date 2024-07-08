require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const moment = require("moment");
const bodyParser = require("body-parser");
const nm = require("nodemailer");
const useragent = require('express-useragent');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const app = express();
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 5000;

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
let session = "";
let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

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
      let subscriptionType = "";

      const userCollections = client.db("database").collection("users");

      const user = await userCollections.findOne({
        email: session.customer_details.email,
      });
      if (user) {
        await userCollections.updateOne(
          { email: session.customer_details.email },
          {
            $set: {
              isSubscribed: true,
              subscriptionExpiry: Date.now() + 2592000000, // Set expiry 30 days from now
            },
          }
        );
      }

      let emailto = `${session.customer_details.email}`;
      if (session.payment_link === "plink_1PP5lnRuhCWG0gwCRGx3QyGf") {
        subscriptionType = "Basic";
        await userCollections.updateOne(
          { email: emailto },
          {
            $set: {
              subscriptionType: "Basic",
            },
          }
        );
      } else if (session.payment_link === "plink_1PQ6ixRuhCWG0gwCmTBRgq3d") {
        subscriptionType = "Premium";
        await userCollections.updateOne(
          { email: emailto },
          {
            $set: {
              subscriptionType: "Premium",
            },
          }
        );
      } else if (session.payment_link === "plink_1PQqQmRuhCWG0gwCpERyX0n5") {
        subscriptionType = "PremiumPlus";
        await userCollections.updateOne(
          { email: emailto },
          {
            $set: {
              subscriptionType: "PremiumPlus",
            },
          }
        );
      }
      let amountPaid = session.amount_total / 100;
      let info = await transport.sendMail({
        from: process.env.EMAIL,
        to: emailto,
        subject: `Thank you for subscribing to Twitter ${subscriptionType} Plan`,
        html: `
        <div>
        <h3>Dear ${session.customer_details.name},</h3>

        <p>Your Payment of ${amountPaid} is Succesfully received.Enjoy your " ${subscriptionType}" Plan for a month.</p>
        </div>
        `,
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
app.use(bodyParser.urlencoded({ extended: true }));

//to get userInfo 
app.use(useragent.express());
app.use(requestIp.mw());
app.use((req, res, next) => {
  const ip = req.clientIp;
  const geo = geoip.lookup(ip);
  req.geoip = geo;
  next();
});

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
      pass: process.env.PASSWORD,
    },
  }
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  // useNewUrlParser: true, useUnifiedTopology: true 
});

async function run() {
  try {
    await client.connect();
    const postCollections = client.db("database").collection("posts");
    const userCollections = client.db("database").collection("users");
    const videoCollections = client.db("database").collection("videos");
    const imageCollections = client.db("database").collection("images");

    app.get("/timeline", async (req, res) => {
      const currentTime = new Date();

      // Set hours, minutes, and seconds to 0 for cleaner comparison
      currentTime.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds(), 0);

      const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 8, 0, 0); // 8 AM
      const endTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 24, 0, 0); // 8 PM (adjust for desired end time)

      // const device = req.useragent.isMobile ? "Mobile" : req.useragent.isDesktop ? "Desktop" : "Tablet";
      const device = req.useragent.isDesktop ? "Desktop" : req.useragent.isMobile ? "Mobile" : "Tablet";
      if (device === "Mobile") {
        if (currentTime >= startTime && currentTime < endTime) { // Use < for excluding end time
          console.log("Access granted (within 8 AM to 8 PM)");
          res.send("Acess granted")
        } else {
          console.log("Access denied (outside 8 AM to 8 PM)");
          res.send("Access denied")
        }
      }
      else {
        res.send("Access granted")
      }
    });

    app.get("/posts", async (req, res) => {
      const posts = (await postCollections.find().toArray()).reverse();
      res.json(posts);
    });

    app.get("/users", async (req, res) => {
      const user = await userCollections.find().toArray();
      res.json(user);
    });

    app.get("/images", async (req, res) => {
      const images = await imageCollections.find().toArray();
      res.json(images);
    });

    app.get("/videos", async (req, res) => {
      const videos = await videoCollections.find().toArray();
      res.json(videos);
    });

    app.get("/deviceInfo", async (req, res) => {
      const email = req.query.email;
      const user = await userCollections.findOne({ email: email });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const deviceInfo =
      {
        browser: req.useragent.browser,
        // os: req.useragent.os.name,
        // osVersion:req.useragent.os.major,
        os: req.useragent.os,
        device: req.useragent.isDesktop ? "Desktop" : req.useragent.isMobile ? "Mobile" : "Tablet",
        ip: req.clientIp,
        country: req.geoip,
        loginTime: new Date(),
      };
      user.deviceInfo = deviceInfo;
      if (deviceInfo.browser === "Chrome" || deviceInfo.device === "Mobile") {
        user.isdeviceCompatible = false;
      }
      else {
        user.isdeviceCompatible = true;
      }
      const result = await userCollections.updateOne({ email }, { $set: user });
      res.json(user);
    });

    app.get("/loggedInUser", async (req, res) => {
      const email = req.query.email;
      const user = await userCollections.find({ email: email }).toArray();
      res.send(user);
    });

    app.get("/userPosts", async (req, res) => {
      const email = req.query.email;
      const posts = (
        await postCollections.find({ email: email }).toArray()
      ).reverse();
      res.send(posts);
    });

    app.get("/userstat", async (req, res) => {
      const postId = req.query.postId;
      const post = await postCollections.findOne({ _id: new mongoose.Types.ObjectId(postId) });
      if (!post) {
        return res.status(404).send("Post not found");
      }
      const email = post.email;
      const user = await userCollections.findOne({ email: email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      const { isSubscribed, subscriptionType, subscriptionExpiry, Points, TotalLikes, postCount } = user;
      res.json({
        isSubscribed,
        subscriptionType,
        subscriptionExpiry,
        Points,
        TotalLikes,
        postCount
      })
    });

    app.get("/userStatus", async (req, res) => {
      const email = req.query.email;
      const user = await userCollections
        .findOne({ email: email })
      if (!user) {
        return res.status(404).send("User not found")
      }
      const { isSubscribed, subscriptionType, subscriptionExpiry, Points, TotalLikes, postCount } = user;
      const posts = await postCollections.find({ email: email }).toArray();
      let totalLikes = 0;
      posts.forEach(post => {
        totalLikes += post.Likes;
      });
      await userCollections.updateOne({ email: email }, { $set: { TotalLikes: totalLikes } });
      res.json({ isSubscribed, subscriptionType, subscriptionExpiry, Points, TotalLikes, postCount });
    });

    app.post("/posts", async (req, res) => {
      const post = req.body;
      const user = await userCollections.findOne({ email: post.email });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const posts = await postCollections.find({ email: post.email, createdAt: { $gte: today } }).toArray();
      let PostsperDay = 5;
      if (user.isSubscribed) {
        if (user.subscriptionType === "Basic") {
          PostsperDay = 20;
          user.Points += 200;
        }
        else if (user.subscriptionType === "Premium") {
          PostsperDay = 50;
          user.Points += 500;
        }
      }
      const canPost = posts.length < PostsperDay || user.Points >= 10;

      if (canPost || user.subscriptionType === "PremiumPlus") {
        const result = await postCollections.insertOne({
          ...post,
          createdAt: new Date(),
        });
        let points = user.Points;
        if(PostsperDay===0)
        points -= 10;
        let pointstodeduct = user.deductedPoints;
        if(PostsperDay===0)
        pointstodeduct += 10;

        await userCollections.updateOne(
          { email: post.email },
          { $set: { Points: points, postCount: posts.length + 1, deductedPoints: pointstodeduct } }
        );
        res.send(result);
      }
      else {
        res.status(400).json({ error: "Limit Reached" });
      }
    });

    app.patch("/posts/:id/like", async (req, res) => {
      const { id } = req.params;
      const post = await postCollections.findOne({ _id: new mongoose.Types.ObjectId(id) });
      const result = await postCollections.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { Likes: post.Likes + 1 } });
      res.send(result);
    });

    app.patch("/posts/:id/dislike", async (req, res) => {
      const { id } = req.params;
      const post = await postCollections.findOne({ _id: new mongoose.Types.ObjectId(id) });
      const result = await postCollections.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { Likes: post.Likes - 1 } });
      res.send(result);
    });


    app.patch("/posts/:id/save", async (req, res) => {
      const { id } = req.params;
      const post = await postCollections.findOne({ _id: new mongoose.Types.ObjectId(id) });
      const result = await postCollections.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { saved: post.saved + 1 } });
      res.send(result);
    });

    app.patch("/posts/:id/unsave", async (req, res) => {
      const { id } = req.params;
      const post = await postCollections.findOne({ _id: new mongoose.Types.ObjectId(id) });
      const result = await postCollections.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { saved: post.saved - 1 } });
      res.send(result);
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      const existingUser = await userCollections.findOne({ email: user.email });
      if (!existingUser) {
        user.isSubscribed = false;
        user.subscriptionType = "";
        user.subscriptionExpiry = Date.now();
        user.profileImage = "https://www.pngitem.com/pimgs/m/146-1462217_profile-icon-orange-png-transparent-png.png";
        user.postCount = 0;
        user.Points = 50;
        user.TotalLikes = 0;
        user.deductedPoints = 0;

        const deviceInfo = {
          browser: req.useragent.browser,
          os: req.useragent.os,
          device: req.useragent.isDesktop ? "Desktop" : req.useragent.isMobile ? "Mobile" : "Tablet",
          ip: req.clientIp,
          country: req.geoip,
          loginTime: new Date(),
        };
        if (deviceInfo.browser === "Chrome" || deviceInfo.device === "Mobile") {
          user.isdeviceCompatible = false;
        }
        else {
          user.isdeviceCompatible = true;
        }
        user.deviceInfo = deviceInfo;
        const result = await userCollections.insertOne(user);
        res.send(result);
      }
    });

    app.post("/images", async (req, res) => {
      try {

        const image = req.body;
        const imageObject = { image, Likes: 0 };
        const result = await imageCollections.insertOne(imageObject);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error in uploading image");
      }
    });

    app.post("/videos", async (req, res) => {
      try {
        const video = req.body;
        const object = { video, Likes: 0 };
        const result = await videoCollections.insertOne(object);
        res.send(result);

      } catch (error) {
        console.log(error);
        res.status(500).send("Error in uploading video");
      }
    });

    app.patch("/userUpdates/:email", async (req, res) => {
      const filter = req.params;
      console.log("filter", filter);
      const profile = req.body;
      console.log("profile", profile.profileImage);
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      console.log("updateDoc", updateDoc);
      const result = await userCollections.updateOne(filter, updateDoc, options);
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
