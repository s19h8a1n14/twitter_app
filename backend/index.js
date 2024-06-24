const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const useragent = require("express-useragent");
const geoip = require("geoip-lite");

var nm = require("nodemailer");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(useragent.express());

let savedOTPS = {};
var transporter = nm.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const apikey = process.env.API_KEY;

const stripe = require("stripe")(apikey);

const endpointSecret = "whsec_zvljbIdJnnW3LusO35Z6Z34ten3hnrFl";

let session = "";

app.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.async_payment_failed":
        session = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        break;
      case "checkout.session.completed":
        session = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
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
        let emailto = session.customer_details.email;
        pLink = session.payment_link;

        if (pLink == "plink_1POOQsSIVZptqxDy4dCzwPUB") {
          // monthly subscription
          subscriptionNumber = 1;
          await userCollection.updateOne(
            { email: emailto },
            { $set: { isSubscribed: 1 } }
          );
          // set subscription expiry to 1 month from present date
          await userCollection.updateOne(
            { email: emailto },
            { $set: { subscriptionExpiry: Date.now() + 2592000000 } }
          );
        } else if (pLink == "plink_1POOOoSIVZptqxDyoBhxbfrT") {
          // yearly subsscription
          subscriptionNumber = 2;
          await userCollection.updateOne(
            { email: emailto },
            { $set: { isSubscribed: 2 } }
          );
          // set subscription expiry to 1 year from present date
          await userCollection.updateOne(
            { email: emailto },
            { $set: { subscriptionExpiry: Date.now() + 31536000000 } }
          );
        }
        subscriptionType = subscriptionNumber == 2 ? "Yearly" : "Monthly";
        amountPaid = subscriptionNumber == 2 ? "Rs 689" : "Rs 189";
        let info = await transporter.sendMail({
          from: process.env.USER_EMAIL,
          to: emailto,
          subject: "Subscription Successfull",
          text: `Your subscription is successfull`,
          html: `
          <div class="container mt-6 mb-7">
            <div class="row justify-content-center">
              <div class="col-lg-12 col-xl-7">
                <div class="card">
                  <div class="card-body p-5">
                    <h2>
                      Hey ${session.customer_details.name},
                    </h2>
                    <p class="fs-sm">
                      This is the receipt for a payment of <strong>${amountPaid}</strong> (Rupee) you made to Twitter Subscription.
                    </p>

                    <div class="border-top border-gray-200 pt-4 mt-4">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="text-muted mb-2">Payment No.</div>
                          <strong>#${session.subscription}</strong>
                        </div>
                        <div class="col-md-6 text-md-end">
                          <div class="text-muted mb-2">Payment Date</div>
                          <strong>${Date.now}</strong>
                        </div>
                      </div>
                    </div>

                    <div class="border-top border-gray-200 mt-4 py-4">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="text-muted mb-2">Client</div>
                          <strong>
                            ${session.customer_details.name}
                          </strong>
                          <p class="fs-sm">
                            
                            <br>
                            <a href="#!" class="text-purple">${session.customer_details.email}
                            </a>
                          </p>
                        </div>
                        <div class="col-md-6 text-md-end">
                          <div class="text-muted mb-2">Payment To</div>
                          <strong>
                            Twitter ${subscriptionType} Subscription
                          </strong>
                          <p class="fs-sm">
                            NIT Durgapur
                            <br>
                            <a href="#!" class="text-purple">balajikurakula8@gmail.com
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <table class="table border-bottom border-gray-200 mt-3">
                      <thead>
                        <tr>
                          <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0">Description</th>
                          <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm text-end px-0">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="px-0">${subscriptionType} Subscription</td>
                          <td class="text-end px-0">${amountPaid}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="mt-5">
                      <div class="d-flex justify-content-end">
                        <p class="text-muted me-3">Subtotal:</p>
                        <span>${amountPaid}</span>
                      </div>
                      <div class="d-flex justify-content-end">
                        
                      </div>
                      <div class="d-flex justify-content-end mt-3">
                        <h5 class="me-3">Total:</h5>
                        <h5 class="text-success">${amountPaid}</h5>
                      </div>
                    </div>
                  </div>
                  <a href="#!" class="btn btn-dark btn-lg card-footer-btn justify-content-center text-uppercase-bold-sm hover-lift-light">
                    <span class="svg-icon text-white me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>ionicons-v5-g</title><path d="M336,208V113a80,80,0,0,0-160,0v95" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><rect x="96" y="208" width="320" height="272" rx="48" ry="48" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></rect></svg>
                    </span>
                    Payment Status : ${session.payment_status}
                  </a>
                </div>
              </div>
            </div>
          </div>
          `,
        });

        console.log("Message sent: %s", info.messageId);

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/sendotp", (req, res) => {
  let email = req.body.email;
  let digits = "0123456789";
  let limit = 4;
  let otp = "";
  for (i = 0; i < limit; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  var options = {
    from: process.env.USER_EMAIL,
    to: `${email}`,
    subject: "Testing node emails",
    html: `<p>Enter the otp: ${otp} to upload video</p>`,
  };
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Couldn't send OTP. Please try again later.");
    } else {
      savedOTPS[email] = otp;
      setTimeout(() => {
        delete savedOTPS.email;
      }, 60000);
      res.send("Sent OTP successfully");
    }
  });
});

app.post("/verify", (req, res) => {
  let otpReceived = req.body.otp;
  let email = req.body.email;
  if (savedOTPS[email] == otpReceived) {
    res.send("Verified");
  } else {
    res.status(400).send("Invalid OTP");
  }
});

//const uri = `mongodb+srv://balajikurakula8:balaji@cluster0.bw7ylmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {});

const ALLOWED_START_HOUR = 9; // 9 AM
const ALLOWED_END_HOUR = 17; // 5 PM

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

    app.get("/userBookmarks", async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.findOne({ email: email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const bookmarkedPostIds = user.bookmarks.map(
        (bookmarkId) => new mongoose.Types.ObjectId(bookmarkId)
      );

      const bookmarkedPosts = await postCollection
        .find({ _id: { $in: bookmarkedPostIds } })
        .toArray();

      // Reverse the order of the posts
      const reversedBookmarkedPosts = bookmarkedPosts.reverse();

      res.json(reversedBookmarkedPosts);
    });

    app.get("/userPostCount", async (req, res) => {
      try {
        const email = req.query.email;
        const postCount = await postCollection.countDocuments({
          email: email,
        });
        res.send({ email, postCount });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch post count" });
      }
    });

    app.get("/userId", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send("Email is required");
      }
      try {
        const user = await userCollection.findOne({ email: email });
        //console.log(user._id);
        const userid = String(user._id);
        //console.log(userid);
        if (user) {
          res.json({ userId: userid });
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        res.status(500).send("Error fetching user ID");
      }
    });

    app.post("/posts", async (req, res) => {
      try {
        const post = req.body;

        const user = await userCollection.findOne({ email: post.email });
        if (!user) {
          return res.status(400).json({ error: "User not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const postCount = await postCollection.countDocuments({
          email: post.email,
          createdAt: { $gte: today },
        });

        const dailyLimit = 5;

        const canPost = user.subscription || postCount < dailyLimit;

        if (canPost) {
          const result = await postCollection.insertOne({
            ...post,
            createdAt: new Date(),
          });
          let points = user.points || 0;
          points += 2;

          await userCollection.updateOne(
            { email: post.email },
            { $set: { points } }
          );
          res.send(result);
        } else {
          res.status(400).json({ error: "Daily post limit reached" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      user.points = 0;
      user.subscription = false;
      user.isSubscribed = 0;
      user.postCount = 0;
      user.subscriptionExpiry = Date.now();

      // Capture user agent information
      const userAgent = req.useragent;
      const browser = userAgent.browser;
      const os = userAgent.os;
      const device = userAgent.isMobile
        ? "Mobile"
        : userAgent.isDesktop
        ? "Desktop"
        : "Unknown";

      // Capture IP address
      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      // Get geographical information from IP address (optional)
      const geo = geoip.lookup(ipAddress);

      user.browser = browser;
      user.os = os;
      user.device = device;
      user.ipAddress = ipAddress;
      user.geo = geo;
      user.bookmarks = [];
      user.likes = [];
      user.retweets = [];

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post("/login", async (req, res) => {
      const { email } = req.body;

      //console.log(email);

      const user = await userCollection.findOne({ email: email });

      //console.log(user);

      // Capture user agent information
      const userAgent = req.useragent;
      const browser = userAgent.browser;
      const os = userAgent.os;
      const device = userAgent.isMobile
        ? "Mobile"
        : userAgent.isDesktop
        ? "Desktop"
        : "Unknown";

      // Capture IP address
      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      const currentHour = new Date().getHours();

      console.log(currentHour);

      if (
        device === "Desktop" &&
        (currentHour < ALLOWED_START_HOUR || currentHour >= ALLOWED_END_HOUR)
      ) {
        console.log("Desktop logins are only allowed between 9 AM and 5 PM.");
        return res
          .status(400)
          .send("Mobile logins are only allowed between 9 AM and 5 PM.");
      }

      // Get geographical information from IP address (optional)
      const geo = geoip.lookup(ipAddress);
      if (user) {
        await userCollection.updateOne(
          { email: email },
          {
            $push: {
              loginHistory: {
                date: new Date(),
                browser: browser,
                os: os,
                device: device,
                ipAddress: ipAddress,
                geo: geo,
              },
            },
          }
        );
        res.status(200).send("Login successful.");
      } else {
        res.status(404).send("User not found.");
      }
    });

    app.patch("/monthly", async (req, res) => {
      const email = req.query.email;

      try {
        const user = await userCollection.findOne({ email });
        //console.log(user);

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        const newPoints = user.points - 4;

        if (newPoints < 0) {
          return res.status(400).send({ message: "Insufficient points" });
        }

        await userCollection.updateOne(
          { email: email },
          {
            $set: {
              subscription: true,
              isSubscribed: 1,
              subscriptionExpiry: Date.now() + 2592000000, // 1 month in milliseconds
              points: newPoints,
            },
          }
        );

        res.status(200).send({ message: "Subscription updated successfully" });
      } catch (error) {
        console.error("Error updating subscription:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.patch("/monthly", async (req, res) => {
      const email = req.query.email;

      try {
        const user = await userCollection.findOne({ email });
        //console.log(user);

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        const newPoints = user.points - 8;

        if (newPoints < 0) {
          return res.status(400).send({ message: "Insufficient points" });
        }

        await userCollection.updateOne(
          { email: email },
          {
            $set: {
              subscription: true,
              isSubscribed: 2,
              subscriptionExpiry: Date.now() + 2592000000, // 1 month in milliseconds
              points: newPoints,
            },
          }
        );

        res.status(200).send({ message: "Subscription updated successfully" });
      } catch (error) {
        console.error("Error updating subscription:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.patch("/posts/:id/upvote", async (req, res) => {
      try {
        const { id } = req.params;
        const email = req.query.email;
        const post = await postCollection.findOne({
          _id: new mongoose.Types.ObjectId(id),
        });
        if (!post) {
          return res.status(404).send("Post not found");
        }

        const user = await userCollection.findOne({ email: email });
        const userId = String(user._id);

        const index = post.upvotes.findIndex(
          (likeId) => likeId === String(userId)
        );

        if (index === -1) {
          // like the post
          post.upvotes.push(userId);
        } else {
          // dislike the post
          post.upvotes = post.upvotes.filter((likeId) => likeId !== userId);
        }

        const updateDoc = { $set: { upvotes: post.upvotes } };
        const options = { upsert: true };

        const updatedPost = await postCollection.updateOne(
          { _id: new mongoose.Types.ObjectId(id) }, // Corrected selector
          updateDoc,
          options
        );

        res.json(updatedPost);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });

    app.patch("/posts/:id/like", async (req, res) => {
      try {
        const { id } = req.params;
        const email = req.query.email;
        const post = await postCollection.findOne({
          _id: new mongoose.Types.ObjectId(id),
        });
        if (!post) {
          return res.status(404).send("Post not found");
        }

        const postId = String(post._id);
        //console.log(postId);

        const user = await userCollection.findOne({ email: email });
        const userId = String(user._id);

        const postEmail = post.email;
        const postUser = await userCollection.findOne({ email: postEmail });

        //console.log(postUser);

        const index = post.likes.findIndex(
          (likeId) => likeId === String(userId)
        );

        if (index === -1) {
          // like the post
          post.likes.push(userId);
          postUser.likes.push(postId);
        } else {
          // dislike the post
          post.likes = post.likes.filter((likeId) => likeId !== userId);
          postUser.likes = postUser.likes.filter((likeId) => likeId !== postId);
        }

        const updateDoc = { $set: { likes: post.likes } };
        const options = { upsert: true };

        const updatedPost = await postCollection.updateOne(
          { _id: new mongoose.Types.ObjectId(id) }, // Corrected selector
          updateDoc,
          options
        );

        await userCollection.updateOne(
          { email: postEmail },
          { $set: { likes: postUser.likes } }
        );

        res.json(updatedPost);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });

    app.patch("/posts/:id/bookmark", async (req, res) => {
      try {
        const { id } = req.params;
        const email = req.body.email;
        const post = await postCollection.findOne({
          _id: new mongoose.Types.ObjectId(id),
        });
        if (!post) {
          return res.status(404).send("Post not found");
        }

        //const email = post.email;
        const user = await userCollection.findOne({ email: email });

        //console.log("User:", user);
        const userId = String(user._id);
        //console.log("User ID:", userId);

        const index = post.bookmarks.findIndex(
          (likeId) => likeId === String(userId)
        );

        //console.log("Index:", index);
        const postId = String(post._id);

        //console.log("Post ID:", postId);

        if (index === -1) {
          // Add post's ID to user's bookmarks if not already bookmarked
          user.bookmarks.push(postId);
          //console.log("User bookmarks:", user.bookmarks);
          post.bookmarks.push(userId);
          //console.log("Post bookmarks:", post.bookmarks); // Assuming you want to track who bookmarked the post
        } else {
          // If already bookmarked, remove the post's ID from user's bookmarks
          user.bookmarks = user.bookmarks.filter(
            (bookmarkId) => bookmarkId !== postId
          );
          //console.log("User bookmarks:", user.bookmarks);
          post.bookmarks = post.bookmarks.filter((likeId) => likeId !== userId);
          //console.log("Post bookmarks:", post.bookmarks);
        }

        const updateDoc = { $set: { bookmarks: post.bookmarks } };
        const options = { upsert: true };

        const updatedPost = await postCollection.updateOne(
          { _id: new mongoose.Types.ObjectId(id) }, // Corrected selector
          updateDoc,
          options
        );

        await userCollection.updateOne(
          { email: email },
          { $set: { bookmarks: user.bookmarks } }
        );

        res.json(updatedPost);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });

    app.patch("/posts/:id/retweet", async (req, res) => {
      try {
        const { id } = req.params;
        const email = req.query.email;
        console.log(email);
        const post = await postCollection.findOne({
          _id: new mongoose.Types.ObjectId(id),
        });
        if (!post) {
          return res.status(404).send("Post not found");
        }

        const postId = String(post._id);

        const user = await userCollection.findOne({ email: email });
        const userId = String(user._id);

        const postEmail = post.email;
        const postUser = await userCollection.findOne({ email: postEmail });

        const index = post.retweets.findIndex(
          (likeId) => likeId === String(userId)
        );

        if (index === -1) {
          // like the post
          post.retweets.push(userId);
          postUser.retweets.push(postId);
        } else {
          // dislike the post
          post.retweets = post.retweets.filter((likeId) => likeId !== userId);
          postUser.retweets = postUser.retweets.filter(
            (likeId) => likeId !== postId
          );
        }

        const updateDoc = { $set: { retweets: post.retweets } };
        const options = { upsert: true };

        const updatedPost = await postCollection.updateOne(
          { _id: new mongoose.Types.ObjectId(id) }, // Corrected selector
          updateDoc,
          options
        );

        await userCollection.updateOne(
          { email: postEmail },
          { $set: { retweets: postUser.retweets } }
        );

        res.json(updatedPost);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });

    app.patch("/userUpdates/:email", async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.post("/videos", async (req, res) => {
      try {
        const { url } = req.body;
        if (!url) {
          return res.status(400).json({ error: "Video URL is required" });
        }

        // Create a new video with initial upvote
        const video = { url, upvotes: 1 };
        const result = await videoCollection.insertOne(video);

        res.send(result);
      } catch (err) {
        console.error("Error saving video:", err);
        res.status(500).json({ error: "Failed to save video" });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
