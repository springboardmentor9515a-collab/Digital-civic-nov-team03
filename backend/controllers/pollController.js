import Poll from "../models/polls/Poll.js";
import Vote from "../models/votes/Vote.js";

export const createPoll = async (req, res) => {
  try {
    if (req.user.role !== "official" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, options, targetLocation } = req.body;

    if (!title || !options || options.length < 2) {
      return res.status(400).json({ message: "Invalid poll data" });
    }

    const poll = await Poll.create({
      title,
      options,
      targetLocation,
      createdBy: req.user.id,
    });

    res.status(201).json(poll);
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
};

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({
      targetLocation: req.user.location,
    }).sort({ createdAt: -1 });

    res.json(polls);
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
};

export const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Not found" });

    const votes = await Vote.find({ poll: poll._id });

    const totalVotes = votes.length;

    const results = poll.options.map((opt) => {
      const count = votes.filter((v) => v.selectedOption === opt).length;
      return {
        option: opt,
        count,
        percentage: totalVotes === 0 ? 0 : ((count / totalVotes) * 100).toFixed(1),
      };
    });

    res.json({ poll, totalVotes, results });
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
};

export const voteOnPoll = async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({ message: "Only citizens can vote" });
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Not found" });

    const { selectedOption } = req.body;

    if (!poll.options.includes(selectedOption)) {
      return res.status(400).json({ message: "Invalid option" });
    }

    const vote = await Vote.create({
      poll: poll._id,
      user: req.user.id,
      selectedOption,
    });

    res.status(201).json(vote);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "Already voted" });
    }
    res.status(500).json({ message: "error" });
  }
};
