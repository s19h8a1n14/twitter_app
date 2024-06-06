const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../.env" });

var nm = require("nodemailer");

const app = express();
const port = process.env.PORT;

app.use(cors());

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

const endpointSecret = process.env.ENDPOINT_SECRET;

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
      const result = await userCollection.insertOne(user);
      res.send(result);
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
