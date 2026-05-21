import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminForm () {
  const [admin, setAdmin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const adminCredentials={
   admin : "admin",
   password : "password"
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (admin === "admin" && password === "password") {
      alert("Login successful!");
      navigate("/admin/edit", {replace: true});
    } else {
      alert("Invalid credentials. Please try again.");
    }

    setAdmin("");
    setPassword("");
  }

  return (
    <div className="admin-form">
      <h1>Admin Form</h1>
      <form onSubmit={handleSubmit}>
        <input type="text"
         placeholder="Administrator Name"
         value={admin}
         onChange={(e) => setAdmin(e.target.value)}
         />
        <input type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        placeholder="Administrator Password" />
        <button type="submit" >Submit</button>
      </form>
    </div>
  );
}

export default AdminForm;