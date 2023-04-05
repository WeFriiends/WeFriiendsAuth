const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const mongoose = require("mongoose");
const oneDay = 1000 * 60 * 60 * 24;
// const cookieSession = require("cookie-session");
// app.use(cookieSession({
//     name: "session",
//     keys:['lama']
// }))
const session = require('express-session')
app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(
    cors(
    {origin: "http://localhost:3000",
    credentials: true
}
)
);
app.use(express.static('public'))

app.use(passport.initialize());
app.use(passport.session());
require("./models/User");
require("./services/google-facebook-auth");
require("./services/email-auth");
require("./routes/authRoutes")(app);

mongoose.connect(
    process.env.MONGODB_URL,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connection Successful!");
    app.listen(HTTP_PORT, () => {
        console.log("API listening on: " + HTTP_PORT);
    });
   
});

