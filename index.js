// create express application
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// require routes
const userRoutes = require("./routes/userroutes.js");
const routerBook = require("./routes/book.routes.js");
const stripeRoutes = require("./middelwares/payment.js")


// create express app
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

// application routes
app.use("/api/users", userRoutes);
app.use("/api/book" , routerBook);
app.use("/api/stripe" , stripeRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
  });
});

// socket io chat

const http = require("http")
const {Server} = require("socket.io")

const server = http.createServer(app)
const io = new Server(server , {
    cors: {
        origin : ["http://localhost:3000","http://localhost:3001","http://localhost:3002","http://localhost:5000"],
        methods : ["GET" , "POST"]
    }
})

io.on("connection" , (socket) =>{
  console.log(`user connected ${socket.id}`);

  socket.on("join_room" , (data)=>{
    socket.join(data)
    console.log(`User With ID: ${socket.id} joined room: ${data}`);
})

socket.on("send_message" , (data)=>{
  socket.to(data.room).emit("receive_message" , data)
})

  socket.on('disconnect' , ()=>{
      console.log("a user disconnected" , socket.id);
  })
})



// Connect to MongoDB and start the server
mongoose
  .connect("mongodb://127.0.0.1:27017/gradproj")
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(8080, () => {
      const serverUrl = `http://localhost:8080`;
      console.log(`Server is running at: ${serverUrl}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });