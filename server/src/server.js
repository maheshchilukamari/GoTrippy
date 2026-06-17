import app from "./app.js";
import { connectDB } from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
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
