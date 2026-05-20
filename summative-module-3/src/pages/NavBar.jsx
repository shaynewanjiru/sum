import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/">LandingPage</NavLink>
      <NavLink to="/products">ProductPage</NavLink>
      <NavLink to="/admin">AdminForm</NavLink>
    </nav>
  );
}

export default NavBar;