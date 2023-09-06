"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./models/db")); // Make sure the path is correct
const user_routes_1 = __importDefault(require("./routes/user.routes")); // Make sure the path is correct
const files_routes_1 = __importDefault(require("./routes/files.routes"));
const folder_routes_1 = __importDefault(require("./routes/folder.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
(0, db_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        console.log("SERVER IS UP ON PORT:", PORT);
    });
    console.log("DB connected");
})
    .catch(console.error);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send("let us goo");
});
app.use('/uploads', express_1.default.static('uploads'));
app.use('/folder', folder_routes_1.default);
app.use("/file", files_routes_1.default);
app.use("/user", user_routes_1.default);
