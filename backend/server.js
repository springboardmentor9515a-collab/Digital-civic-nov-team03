import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

import connectDB from "./db.js";

import User from "./models/User.js";
import Petition from "./models/petitions/Petition.js";
import Signature from "./models/signatures/Signature.js";
import Poll from "./models/polls/Poll.js";
import Vote from "./models/votes/Vote.js";

import petitionRoutes from "./routes/petitionRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const SECRET = process.env.JWT_SECRET;

console.log("Starting DB connection...");

connectDB()
  .then(() => {
    console.log("DB connected, starting server...");
    app.listen(PORT, () => {
      console.log("Server running on", PORT);
    });
  })
  .catch((err) => {
    console.error("DB Error:", err);
  });

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ message: "No token" });

  try {
    const t = h.split(" ")[1];
    req.user = jwt.verify(t, SECRET);
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const u = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      role,
    });

    await u.save();
    res.json({ id: u._id, email: u.email });
  } catch (e) {
    if (e.code === 11000)
      return res.status(409).json({ message: "email_exists" });
    res.status(500).json({ message: "error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const u = await User.findOne({ email: email.toLowerCase() });
    if (!u) return res.status(401).json({ message: "invalid" });

    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ message: "invalid" });

    const token = jwt.sign(
      { id: u._id, email: u.email, role: u.role },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: u._id, name: u.name, email: u.email },
    });
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
});

app.use("/api/petitions", petitionRoutes);
app.use("/api/polls", pollRoutes);

app.post("/api/petitions/:id/sign", auth, async (req, res) => {
  try {
    const s = new Signature({
      petitionId: req.params.id,
      userId: req.user.id,
    });

    await s.save();
    res.status(201).json(s);
  } catch (e) {
    if (e.code === 11000)
      return res.status(409).json({ message: "already_signed" });
    res.status(500).json({ message: "error" });
  }
});

app.get("/api/users", async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
});

app.get("/api/signatures", async (req, res) => {
  res.json(await Signature.find());
});

app.get("/api/votes", async (req, res) => {
  res.json(await Vote.find());
});
