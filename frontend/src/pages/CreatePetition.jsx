import "./createPetition.css";

export default function CreatePetition() {
  return (
    <div className="petition-wrapper">

      <h2 className="page-title">Petition creation -</h2>

      <div className="petition-card">
        <h3 className="card-title">
          📄 Create a New Petition
        </h3>
        <p className="card-subtitle">
          Complete the form below to create a petition in your community.
        </p>

        {/* Petition Title */}
        <div className="form-group">
          <label>Petition Title</label>
          <input
            type="text"
            placeholder="Give your petition a clear, specific title"
          />
          <small>
            Choose a title that clearly states what change you want to see.
          </small>
        </div>

        {/* Category + Location */}
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select>
              <option>Select a category</option>
              <option>Environment</option>
              <option>Infrastructure</option>
              <option>Education</option>
              <option>Public Safety</option>
              <option>Healthcare</option>
              <option>Housing</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" value="San Diego, CA" />
            <small>The area this petition concerns (e.g., Portland, OR)</small>
          </div>
        </div>

        {/* Signature Goal */}
        <div className="form-group">
          <label>Signature Goal</label>
          <input type="number" value="100" />
          <small>How many signatures are you aiming to collect?</small>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="5"
            placeholder="Describe the issue and the change you'd like to see..."
          />
          <small>
            Clearly explain the issue, why it matters, and what specific action you're requesting.
          </small>
        </div>

        {/* Info Box */}
        <div className="info-box">
          ⚠️ <b>Important Information</b>
          <br />
          By submitting this petition, you acknowledge that the content is factual
          to the best of your knowledge and does not contain misleading information.
          Civix reserves the right to remove petitions that violate our community guidelines.
        </div>

        {/* Submit */}
        <button className="submit-btn">Create Petition</button>
      </div>
    </div>
  );
}
