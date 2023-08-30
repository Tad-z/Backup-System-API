import express, { Application } from "express";
import dotenv from "dotenv";
import main from "./models/db"; // Make sure the path is correct
import userRouter from "./routes/user.routes"; // Make sure the path is correct

dotenv.config();

const app: Application = express();
const PORT: number = 3000;

main()
  .then(() => {
    app.listen(PORT, (): void => {
      console.log("SERVER IS UP ON PORT:", PORT);
    });
    console.log("DB connected");
  })
  .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
