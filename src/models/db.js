const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  // mongoose.set('serverTimezone', 'Asia/Kolkata');
  mongoose
    .connect(process.env.MongoDb_url, {
      dbName: "test",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
    })
    .then(() => {
      console.log("MongoDB Connected ..");
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

module.exports = connectDB;
