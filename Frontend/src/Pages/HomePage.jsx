import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of our application.</p>

      <Link to="/login_doc"><button>Login As a Doctor</button></Link>
      <Link to="/login_pt"><button>Login As a Patient</button></Link>
    </div>
  );
}
export default HomePage;