import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import main from "./models/db"; // Make sure the path is correct
import userRouter from "./routes/user.routes"; // Make sure the path is correct
import fileRouter from "./routes/files.routes"

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

app.get('/', (req: Request, res: Response) => {
  res.send("let us goo")
})

app.use('/uploads', express.static('uploads'))
app.use("/file", fileRouter);
app.use("/user", userRouter);
