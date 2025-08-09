import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(rateLimiter)
app.use(express.json())

/*app.use((req, res, next) => {
	console.log("Hey we hit a req, the method is:", req.method)
	next()
})*/

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
		id SERIAL PRIMARY KEY,
		user_id VARCHAR(255) NOT NULL,
		title VARCHAR(255) NOT NULL,
		amount DECIMAL(10,2) NOT NULL,
		category VARCHAR(255) NOT NULL,
		created_at DATE NOT NULL DEFAULT CURRENT_DATE
	)`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1); //status code 1 indicates an error,0 indicates success
  }
}

app.get("/", (req, res) => {
  res.send("It is working!xxx");
});

app.get("/api/transactions/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		
		const transactions = await sql `SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`
		res.status(200).json(transactions) 
	} catch (error) {
		console.log("Error getting the transactions", error);
		res.status(500).json({ message: "Internal server error" });
	}
});


app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category})
			RETURNING *`
			console.log(transaction)
			res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

console.log("my port: ", process.env.PORT);

app.delete("/api/transactions/:id", async (req, res) => {
	try {
		const { id } = req.params;

		if(isNaN(parseInt(id))){
			return res.status(400).json({ error: "Invalid transaction ID" });
		}

		const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

		if (result.length === 0) {
			return res.status(404).json({ error: "Transaction not found" });
		}

		res.status(200).json({ message: "Transaction deleted successfully" });
	} catch (error) {
		console.log("Error deleting transaction:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});
//income + expense -amount >0      amount<0
app.get("/api/transactions/summary/:userId",async (req, res) => {
	try{
		const {userId} = req.params

		const balanceResult = await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`

		const incomeResult = await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`

		const expensesResult = await sql`SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`

		res.status(200).json({
			balance: balanceResult[0].balance,
			income: incomeResult[0].income,
			expenses: expensesResult[0].expenses   
		})

	}
	catch(error){
		console.log("Error getting summary:", error);
		res.status(500).json({ error: "Internal server error" });
	}
})

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
//get post delete put
//only 100 requests per user every 15 minutes 


