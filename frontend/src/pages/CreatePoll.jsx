import { useState } from "react";
import axios from "axios";
import "./CreatePoll.css";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [location, setLocation] = useState("");
  const [closeDate, setCloseDate] = useState("");

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };


  const removeOption = (index) => {
    if (options.length > 1) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/api/polls", {
        question,
        description,
        options,
        location,
        closeDate,
      });
      alert("Poll created successfully");
    } catch (error) {
      alert("Error creating poll");
    }
  };

  return (
    <form className="poll-container" onSubmit={handleSubmit}>
      {/* <h2>Poll Creation</h2> */}
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#030812ff' }}>Create a New Poll</h2>

      <p className="subtitle">
        Create a new poll to gather community feedback on local issues.
      </p>

      <div className="form-group">
        <label>Poll Question</label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do you want to ask the community?"
          required
        />
        <small>Keep your question clear and specific.</small>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide more context about the poll..."
        />
        <small>
          Give community members enough information to make an informed choice.
        </small>
      </div>

      <div className="form-group">
        <label>Poll Options</label>

        {options.map((opt, index) => (
          <div key={index} className="option-row">
            <input
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />

            {index !== 0 && (
              <button
                type="button"
                className="delete-btn"
                onClick={() => removeOption(index)}
              >
                Delete
              </button>
            )}
          </div>
        ))}


        <button type="button" className="add-btn" onClick={addOption}>
          Add Option
        </button>

        <small>Add at least 1 options, up to a maximum of 10.</small>
      </div>



      <div className="row">
        <div className="form-group">
          <label>Target Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="San Diego, CA"
          />
          <small>The area this poll is relevant to.</small>
        </div>

        <div className="form-group">
          <label>Closes On</label>
          <input
            type="date"
            value={closeDate}
            onChange={(e) => setCloseDate(e.target.value)}
          />
          <small>Choose when this poll will close (max 30 days).</small>
        </div>
      </div>

      <div className="info-box">
        <strong>Important Information</strong>
        <p>
          Polls should be designed to gather genuine community feedback on
          issues that affect your area. Polls that are misleading may be
          removed.
        </p>
      </div>

      <button className="submit-btn" type="submit">
        Create Poll
      </button>
    </form>
  );
};

export default CreatePoll;
