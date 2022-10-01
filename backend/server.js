const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
console.log(uri);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
<<<<<<< HEAD
}
);
=======
  // useCreateIndex: true
});
>>>>>>> 0e81ea4 (added sponsorship fund endpoints)

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// const exercisesRouter = require('./routes/exercises');
<<<<<<< HEAD
const usersRouter = require('./routes/users');
const emailRouter = require('./routes/email');
=======
const usersRouter = require("./routes/users");
const sponsorshipFundsRouter = require("./routes/SponsorshipFund");
>>>>>>> 0e81ea4 (added sponsorship fund endpoints)

app.use(express.json())
// app.use('/exercises', exercisesRouter);
<<<<<<< HEAD
app.use('/users', usersRouter);
app.use('/email', emailRouter);
=======
app.use("/users", usersRouter);
app.use("/sponsorshipfunds", sponsorshipFundsRouter);
>>>>>>> 0e81ea4 (added sponsorship fund endpoints)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
