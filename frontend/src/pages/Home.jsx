import { useNavigate } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="home-container text-center py-5">
      <h1 className="mb-3 fw-bold">Welcome to Flareminds 🚀</h1>
      {user ? (
        <h4 className="mb-4">Hello, {user.firstname} {user.lastname} 👋</h4>
      ) : (
        <h4 className="mb-4">Please login to explore more</h4>
      )}
      <p className="lead px-3">
        Flareminds is a platform to learn, build and showcase projects.  
        You can signup, login, explore users and manage your work here.  
        This project is powered by <strong>React + Vite + Bootstrap</strong>.
      </p>
      
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="info-box">
            <h5>🚀 Fast Development</h5>
            <p>Quick setup using Vite + React + Bootstrap.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-box">
            <h5>💡 Modern Design</h5>
            <p>Clean responsive UI with gradient and cards.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-box">
            <h5>🔐 Authentication</h5>
            <p>Secure login, signup & protected routes.</p>
          </div>
        </div>
      </div>
      
      {user && (
        <div className="home-btns mt-5">
          <button 
            className="btn btn-light" 
            onClick={() => navigate('/users')}
          >
            Explore Users
          </button>
          <button 
            className="btn btn-outline-light"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;