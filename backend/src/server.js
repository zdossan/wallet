import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { initDB } from "./config/db.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(rateLimiter);
app.use(express.json());

/*app.use((req, res, next) => {
	console.log("Hey we hit a req, the method is:", req.method)
	next()
})*/

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
//get post delete put
//only 100 requests per user every 15 minutes
