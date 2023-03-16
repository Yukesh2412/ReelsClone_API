const express = require('express');
const mongoose = require('mongoose');
const userAgent = require('express-useragent')
const app = express();
const PORT = 3000
const MONGO_URI = "mongodb://localhost:27017/tiktok";

//Connect to DB
mongoose.connect(
    MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("DB connected");
    }
);

// import Routes
const uploadRoute = require('./routes/upload_videos');
const authRoute = require('./routes/auth');

// Middlewares
app.use(express.json());
app.use(userAgent.express());

//Routes Middlewares
app.use('/api/storage', uploadRoute);
app.use('/api/auth', authRoute)

app.listen(PORT, function(){
    console.log(`Server running on Port ${PORT}`)
})

