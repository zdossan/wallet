import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

async function initDB(){
	try{
		await sql`CREATE TABLE IF NOT EXISTS transactions(
		id SERIAL PRIMARY KEY,
		user_id VARCHAR(255) NOT NULL,
		title VARCHAR(255) NOT NULL,
		amount DECIMAL(10,2) NOT NULL,
		category VARCHAR(255) NOT NULL,
		created_at DATE NOT NULL DEFAULT CURRENT_DATE
	)`
	console.log("Database initialized successfully");
	}
	catch(error){
		console.error("Error initializing database:", error);
		process.exit(1); //status code 1 indicates an error,0 indicates success
	}
}

app.get("/",(req,res)=>{
	res.send("It's working");
})

console.log("my port: ", process.env.PORT);

initDB().then(() => {
	app.listen(PORT,()=>{
	console.log("Server is running on PORT:", PORT);
})
})
//get post delete put