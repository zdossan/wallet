import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { initDB } from "./config/db.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

if(process.env.NODE_ENV === "production") job.start()

// Middleware to parse JSON bodies
app.use(rateLimiter);
app.use(express.json());

/*app.use((req, res, next) => {
	console.log("Hey we hit a req, the method is:", req.method)
	next()
})*/

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req,res) => {
  res.status(200).json({status:"ok"})
})

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
//get post delete put
//only 100 requests per user every 15 minutes
