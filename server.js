const express = require("express");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./middleware/Error");
const connectToSocket=require("./socket")
const Env = require("./config/envConfig");
const cors=require("cors")
const corsConfig = require("./config/corsConfig");
const ConnectToDb = require("./db/config");
const router = require("./routes/index");
const multerErrorHandler = require("./middleware/multerErrorHandler");
const {Server}=require("socket.io")
const http=require("http")
const app = express();
const server=http.createServer(app)
const port = Env.port;
const io=new Server(server,  {cors: {
    origin: ["http://localhost:5173","https://al-quran-kappa-one.vercel.app"], // frontend URL
    methods: ["GET", "POST"],
    credentials: true, // if using cookies/auth
  }},)
// Core middlewares
app.use(corsConfig);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB + cloud
ConnectToDb();
cloudinaryConfig();

app.use("/user/v1", router);
connectToSocket(io)
// Error handlers
app.use(multerErrorHandler);
app.use(globalErrorHandler);

server.listen(port || 3000, () => {
  console.log(`Server running on port ${port}`);
});
