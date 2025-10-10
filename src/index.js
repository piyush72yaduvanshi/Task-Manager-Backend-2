import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/database.db.js";

dotenv.config({ path: "./.env" });

const port = process.env.PROT || 8080;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on port : ", port);
    });
  })
  .catch((err) => {
    console.log("Error :- ", err);
  });
