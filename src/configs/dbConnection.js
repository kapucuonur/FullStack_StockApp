"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// MongoDB Connection:

const mongoose = require("mongoose")

const dbConnection = function () {
  mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("* DB Connected *", mongoose.connection.name))
    .catch((err) => console.error("* DB Not Connected *", err))

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err)
  })

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected")
  })

  process.on("SIGINT", async () => {
    await mongoose.connection.close()
    console.log("🔌 MongoDB connection closed")
    process.exit(0)
  })
}

/* ------------------------------------------------------- */
module.exports = {
  mongoose,
  dbConnection,
}
