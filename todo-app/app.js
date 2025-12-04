// app.js
const express = require("express");
const mongoose = require("mongoose");
const layout = require("express-ejs-layouts");
const path = require("path");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// تنظیمات EJS
app.set("view engine", "ejs");
app.use(layout);
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/", todoRoutes);

// --- بخش مهم: تغییر نحوه اتصال ---
const PORT = 3000;
const DB_URI = ""; 
// مثال: "mongodb+srv://user:pass@cluster0.xyz.mongodb.net/todoapp?retryWrites=true&w=majority"

mongoose.connect(DB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    // فقط وقتی دیتابیس وصل شد، سرور را روشن کن
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log("❌ MongoDB Connection Error:");
    console.error(err); // چاپ کامل خطا برای دیباگ
  });