require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const { io } = require("./controllers/soketApi");

const CRouter = require("./routes/api/c");
const DRouter = require("./routes/api/d");
const adminRouter = require("./routes/api/admin");

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DataBase Connected!"))
  .catch((err) => console.log(err));

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const { setUser } = require("./middleware/auth");
app.use(setUser);

app.use(function (req, res, next) {
  req.io = io;
  next();
});
// const passport = require("passport");
// const flash = require("express-flash");
// const session = require("express-session");
// const methodOverride = require("method-override");

// app.use(flash());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(methodOverride("_method"));

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/c", CRouter);
app.use("/api/d", DRouter);
app.use("/api/admin", adminRouter);



if (process.env.NODE_ENV == "production") {
  app.get("*", (req, res) => {
    res.redirect("https://foodex-admin.vercel.app/");
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
