const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

/**
 * CREATE POLL
 * POST /api/polls
 */
router.post("/", async (req, res) => {
  try {
    const { title, options, targetLocation, createdBy } = req.body;

    if (!title || !options || options.length < 2) {
      return res.status(400).json({ message: "Invalid poll data" });
    }

    const poll = await Poll.create({
      title,
      options,
      targetLocation,
      createdBy,
    });

    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET ALL POLLS (OPTIONAL FILTER BY LOCATION)
 * GET /api/polls?location=Hyderabad
 */
router.get("/", async (req, res) => {
  try {
    const { location } = req.query;

    const filter = {};
    if (location) {
      filter.targetLocation = location;
    }

    const polls = await Poll.find(filter).sort({ createdAt: -1 });
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET POLL BY ID WITH RESULTS
 * GET /api/polls/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const votes = await Vote.aggregate([
      { $match: { poll: poll._id } },
      {
        $group: {
          _id: "$selectedOption",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalVotes = votes.reduce((sum, v) => sum + v.count, 0);

    const results = poll.options.map(option => {
      const vote = votes.find(v => v._id === option);
      const count = vote ? vote.count : 0;
      return {
        option,
        count,
        percentage: totalVotes === 0 ? 0 : ((count / totalVotes) * 100).toFixed(2)
      };
    });

    res.json({ poll, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * VOTE ON POLL
 * POST /api/polls/:id/vote
 */
router.post("/:id/vote", async (req, res) => {
  try {
    const { selectedOption, user } = req.body;

    const vote = await Vote.create({
      poll: req.params.id,
      user,
      selectedOption,
    });

    res.status(201).json(vote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
