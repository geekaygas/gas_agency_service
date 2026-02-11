const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
mongoose.set('strictQuery', false);
app.use(express.static(path.join(__dirname, 'public')));


const clientRoutes = require("./routes/clientRoutes");
const stockRoutes = require("./routes/stockRoutes");
const consumerRoutes = require("./routes/consumerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/authModel");
const driverRoutes = require("./routes/driverRoutes");

app.use("/api", consumerRoutes);
app.use("/api", clientRoutes);
app.use("/api", stockRoutes);
app.use("/api", bookingRoutes);
app.use("/api/auth", authRoutes)
app.use("/api", driverRoutes)


// Connect to MongoDB  
const connect = mongoose.connect(process.env.MONGO_URL);
connect
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
  setInterval(async () => {
    try {
      await User.deleteMany({
        isVerified: false,
        $or: [
          { otpExpiresAt: { $lt: new Date() } },
          { otpExpiresAt: null }
        ]
      });
    } catch (err) {
      console.error("Cleanup job failed:", err);
    }
  }, 2 * 60 * 1000); // 2 minutes


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});