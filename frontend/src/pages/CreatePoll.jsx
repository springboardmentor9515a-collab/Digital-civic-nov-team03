import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isOfficial, getCurrentUser } from "../utils/roleUtils";
import "./CreatePoll.css";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [location, setLocation] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const user = getCurrentUser();

  // Check if user is authorized (officials only)
  useEffect(() => {
    if (!isOfficial()) {
      alert("Only officials can create polls. Redirecting...");
      navigate("/polls");
    }
  }, [navigate]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);

    // Clear option error when user starts typing
    if (errors[`option_${index}`]) {
      setErrors({ ...errors, [`option_${index}`]: null });
    }
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate question
    if (!question.trim()) {
      newErrors.question = "Poll question is required";
    }

    // Validate options - at least 2 non-empty options
    const filledOptions = options.filter(opt => opt.trim() !== "");
    if (filledOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    // Validate each option
    options.forEach((opt, index) => {
      if (opt.trim() === "") {
        newErrors[`option_${index}`] = "Option cannot be empty";
      }
    });

    // Validate location
    if (!location.trim()) {
      newErrors.location = "Target location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Filter out empty options
      const filledOptions = options.filter(opt => opt.trim() !== "");

      await axios.post("http://localhost:4000/api/polls", {
        title: question,
        description,
        options: filledOptions,
        targetLocation: location,
        closeDate,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Success feedback
      alert("✓ Poll created successfully!");

      // Redirect to polls list
      navigate("/polls");
    } catch (error) {
      console.error("Error creating poll:", error);
      const errorMsg = error.response?.data?.message || "Error creating poll. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="poll-container" onSubmit={handleSubmit}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#030812ff' }}>
        Create a New Poll
      </h2>

      <p className="subtitle">
        Create a poll to gather community feedback on local issues.
      </p>

      <div className="form-group">
        <label>Poll Question *</label>
        <input
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (errors.question) setErrors({ ...errors, question: null });
          }}
          placeholder="What do you want to ask the community?"
          className={errors.question ? 'error' : ''}
        />
        {errors.question && (
          <span className="error-text">{errors.question}</span>
        )}
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
        <label>Poll Options *</label>

        {options.map((opt, index) => (
          <div key={index} className="option-row">
            <input
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className={errors[`option_${index}`] ? 'error' : ''}
            />

            {index > 1 && (
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

        {errors.options && (
          <span className="error-text">{errors.options}</span>
        )}

        <button
          type="button"
          className="add-btn"
          onClick={addOption}
          disabled={options.length >= 10}
        >
          {options.length >= 10 ? 'Maximum options reached' : '+ Add Option'}
        </button>

        <small>Add at least 2 options, up to a maximum of 10.</small>
      </div>

      <div className="row">
        <div className="form-group">
          <label>Target Location *</label>
          <input
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (errors.location) setErrors({ ...errors, location: null });
            }}
            placeholder="San Diego, CA"
            className={errors.location ? 'error' : ''}
          />
          {errors.location && (
            <span className="error-text">{errors.location}</span>
          )}
          <small>The area this poll is relevant to.</small>
        </div>

        <div className="form-group">
          <label>Closes On</label>
          <input
            type="date"
            value={closeDate}
            onChange={(e) => setCloseDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <small>Choose when this poll will close (max 30 days).</small>
        </div>
      </div>

      <div className="info-box">
        <strong>Important Information</strong>
        <p>
          Polls should be designed to gather genuine community feedback on
          issues that affect your area. Polls that are misleading or designed to push a specific agenda may be
          removed.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate('/polls')}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="submit-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating Poll...' : 'Create Poll'}
        </button>
      </div>
    </form>
  );
};

export default CreatePoll;
