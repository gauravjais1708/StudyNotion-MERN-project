const mongoose = require("mongoose");

require("dotenv").config();
exports.connect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("MongoDB connected successfully"))
        .catch((error) => {
            console.log("db connected failed", error)
            console.error(error);
            process.exit(1);
        })
};