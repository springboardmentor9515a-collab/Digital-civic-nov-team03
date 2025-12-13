require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const User = require("./models/User");
const Petition = require("./models/petitions/Petition");
const Signature = require("./models/signatures/Signature");
const Poll = require("./models/polls/Poll");
const Vote = require("./models/votes/Vote");

const app = express();
app.use(express.json());


const cors = require('cors')
app.use(cors())



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
  if (!h) return res.status(401).json({});
  try {
    const t = h.split(" ")[1];
    req.user = jwt.verify(t, SECRET);
    next();
  } catch (e) {
    res.status(401).json({});
  }
}

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const u = new User({ name, email, passwordHash: hash, role });
    await u.save();
    res.json({ id: u._id, email: u.email });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "email_exists" });
    res.status(500).json({ message: "error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email: email && email.toLowerCase() });
    if (!u) return res.status(401).json({ message: "invalid" });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ message: "invalid" });
    const token = jwt.sign({ id: u._id, email: u.email, role: u.role }, SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: u._id, name: u.name, email: u.email } });
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
});

app.post("/api/petitions", auth, async (req, res) => {
  try {
    const p = new Petition({ title: req.body.title, description: req.body.description, owner: req.user.id });
    await p.save();
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
});

app.get("/api/petitions", async (req, res) => {
  const list = await Petition.find().sort({ createdAt: -1 });
  res.json(list);
});

app.post("/api/petitions/:id/sign", auth, async (req, res) => {
  try {
    const s = new Signature({ petition: req.params.id, user: req.user.id, comment: req.body.comment });
    await s.save();
    res.status(201).json(s);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "already_signed" });
    res.status(500).json({ message: "error" });
  }
});

app.post("/api/polls", auth, async (req, res) => {
  try {
    const p = new Poll({ question: req.body.question, options: req.body.options, owner: req.user.id });
    await p.save();
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
});

app.post("/api/polls/:id/vote", auth, async (req, res) => {
  try {
    const v = new Vote({ poll: req.params.id, user: req.user.id, optionIndex: req.body.optionIndex });
    await v.save();
    const key = `options.${req.body.optionIndex}.votes`;
    await Poll.updateOne({ _id: req.params.id }, { $inc: { [key]: 1 } });
    res.json({ status: "ok" });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "already_voted" });
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
