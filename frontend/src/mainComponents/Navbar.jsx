import fullLogo from "../assets/FullLogo.png";
import { MdAccountCircle, MdOutlineDehaze } from "react-icons/md";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <MdOutlineDehaze className="navbar-icon" />
      <img className="navbar-logo" src={fullLogo} alt="Logo" />
      <MdAccountCircle className="navbar-icon" />
    </nav>
  );
}

export default Navbar;
