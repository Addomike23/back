const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter');
const welcomeText = require("./models/welcome.json")
const productRouter = require("./routers/productRouter")
const subscribeRoute = require('./routers/subscribeRouter')
const testimonialRouter = require("./routers/testimonialRouter")
const payStackRouter = require("./routers/payStackRouter")
// middleware

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));




const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://front-ymd5.onrender.com/"];
// const allowedOrigins = "https://front-ymd5.onrender.com/"
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization"
}));


app.use(
  "/images",
  express.static("uploads", {
    setHeaders: (res, path, stat) => {
      res.setHeader("Access-Control-Allow-Origin", "https://front-ymd5.onrender.com/"); // ✅ only one string
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      // res.setHeader("Content-Security-Policy", "img-src 'self' http://localhost:5000 data:;");
    },
  })
);

app.use(
  "/profile",
  express.static("profilePic", {
    setHeaders: (res, path, stat) => {
      res.setHeader("Access-Control-Allow-Origin", "https://front-ymd5.onrender.com/"); // ✅ only one string
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      // res.setHeader("Content-Security-Policy", "img-src 'self' http://localhost:5000 data:;");
    },
  })
);


app.get('/api/welcome-text', (req, res) => {
  res.json(welcomeText)
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

}).catch((err) => {
  console.log(err);
});


// routes middleware
app.use('/auth', authRouter);
app.use('/api', productRouter)
app.use('/api', subscribeRoute)
app.use('/api', testimonialRouter)
app.use('/api', payStackRouter)






