import app from "./app.js";
import { connectDB } from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/User.js";

const port = process.env.PORT || 5000;

const ensureSuperAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return;

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) return;

  await User.create({
    name: process.env.ADMIN_NAME || "GoTrippy Admin",
    email: adminEmail,
    passwordHash: adminPassword,
    role: "SUPER_ADMIN",
    status: "ACTIVE"
  });

  console.log(`Seeded first super admin: ${adminEmail}`);
};

connectDB()
  .then(async () => {
    await ensureSuperAdmin();

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: (origin, callback) => {
          if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) || origin === process.env.CLIENT_URL) {
            callback(null, true);
            return;
          }
          callback(new Error("Not allowed by CORS"));
        },
        credentials: true
      }
    });

    app.set("io", io);

    io.on("connection", (socket) => {
      socket.on("booking:join", (bookingId) => {
        if (bookingId) socket.join(`booking:${bookingId}`);
      });
    });

    httpServer.listen(port, () => {
      console.log(`GoTrippy API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  });
