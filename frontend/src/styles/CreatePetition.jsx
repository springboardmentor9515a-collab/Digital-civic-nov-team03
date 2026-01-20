import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePetition() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submitHandler = async () => {
    await axios.post("/api/petitions", form);
    navigate("/petitions");
  };

  return (
    <div>
      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Category" onChange={e => setForm({ ...form, category: e.target.value })} />
      <input placeholder="Location" onChange={e => setForm({ ...form, location: e.target.value })} />
      <button onClick={submitHandler}>Create</button>
    </div>
  );
}
