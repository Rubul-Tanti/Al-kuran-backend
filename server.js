const express = require("express");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./middleware/Error");
const Env = require("./config/envConfig");
const corsConfig = require("./config/corsConfig");
const ConnectToDb = require("./db/config");
const router = require("./routes/index");
const multerErrorHandler = require("./middleware/multerErrorHandler");

const app = express();
const port = Env.port;

// Core middlewares
app.use(corsConfig);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB + cloud
ConnectToDb();
cloudinaryConfig();

// Routes
app.get("/", (req, res) => {
  res.send("hhi");
});
app.use("/user/v1", router);

// Error handlers
app.use(multerErrorHandler);
app.use(globalErrorHandler);

app.listen(port || 3000, () => {
  console.log(`Server running on port ${port}`);
});
