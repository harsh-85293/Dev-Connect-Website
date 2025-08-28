import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log user state
  console.log("NavBar - Current user:", user);

  const handleLogout = async() => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        {withCredentials: true}
      );
      // Clear user from Redux state
      dispatch(removeUser(null));
      // Navigate to login page
      navigate("/login");
    } 
    catch (err) {
      console.error("Logout error:", err);
      // Even if API call fails, clear local state and redirect
      dispatch(removeUser(null));
      navigate("/login");
    }
  }

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="navbar bg-base-100 text-base-content shadow-strong sticky top-0 z-50 backdrop-blur-lg px-4">
      <div className="bg-pattern absolute inset-0"></div>
      
      {/* Left side - Logo */}
      <div className="flex-1 relative z-10">
        <Link to="/" className="btn btn-ghost text-xl font-bold text-base-content hover:text-primary interactive-hover">
          <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
          <span className="text-gradient-light">DevConnect</span>
        </Link>
      </div>

      {/* Right side - Navigation and User Menu */}
      {user && (
        <div className="flex-none flex items-center gap-4 relative z-10">
          {/* Navigation Links */}
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => {
                console.log('Home button clicked');
                navigate('/');
              }}
              className={`btn btn-ghost btn-sm text-base-content hover:bg-base-content/10 interactive-hover ${
                isActivePage('/') ? 'bg-white/20 pulse-glow' : ''
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
              </svg>
              Home
            </button>
            <button 
              onClick={() => {
                console.log('Feed button clicked');
                navigate('/feed');
              }}
              className={`btn btn-ghost btn-sm text-base-content hover:bg-base-content/10 interactive-hover ${
                isActivePage('/feed') ? 'bg-white/20 pulse-glow' : ''
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              Feed
            </button>
            <button 
              onClick={() => {
                console.log('Premium button clicked');
                navigate('/checkout');
              }}
              className={`btn btn-ghost btn-sm text-base-content hover:bg-base-content/10 interactive-hover ${
                isActivePage('/checkout') ? 'bg-white/20 pulse-glow' : ''
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3l2.39 4.845 5.345.777-3.867 3.77.913 5.325L10 15.9l-4.78 2.517.913-5.325L2.266 8.622l5.345-.777L10 3z" />
              </svg>
              Premium
            </button>
          </div>

          {/* Welcome message */}
          <div className="hidden lg:block text-base-content/90 font-medium">
            <span className="float-animation flex items-center gap-2">
              ✨ Welcome, {user.firstName}!
              {user.isPremium && (
                <span
                  title={user.membershipTier === 'gold' ? 'Gold Member' : 'Silver Member'}
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${user.membershipTier === 'gold' ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'}`}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.4-1.4z"/></svg>
                  {user.membershipTier === 'gold' ? 'GOLD' : 'SILVER'}
                </span>
              )}
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="dropdown dropdown-end md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-base-content">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-strong bg-base-100/95 backdrop-blur-lg rounded-2xl w-52 border border-base-content/20">
              <li>
                <button onClick={() => navigate('/')} className="text-base-content w-full text-left">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
                  </svg>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/feed')} className="text-base-content w-full text-left">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                  Feed
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/checkout')} className="text-base-content w-full text-left">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3l2.39 4.845 5.345.777-3.867 3.77.913 5.325L10 15.9l-4.78 2.517.913-5.325L2.266 8.622l5.345-.777L10 3z" />
                  </svg>
                  Premium
                </button>
              </li>
            </ul>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle className="text-base-content" />

          {/* User avatar with modern dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform duration-300 pulse-glow"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-base-content/30 hover:border-base-content/60 relative">
                <img 
                  alt="user photo" 
                  src={user.photoUrl || "https://tse2.mm.bing.net/th/id/OIP.GDzD9q-sQFLKPcjBMUOBOQHaHa?pid=Api&P=0&h=220"} 
                  className="w-full h-full object-cover"
                />
                {user.membershipTier === 'gold' && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center shadow">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 7 .9-5 4.9 1.2 7.2L12 18l-6.2 3.9L7 13.8 2 8.9 9 8l3-6z"/></svg>
                  </span>
                )}
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-strong bg-base-100/95 backdrop-blur-lg rounded-2xl w-60 border border-base-content/20"
            >
              {/* User info header */}
              <li className="menu-title text-base-content/70 mb-2">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img src={user.photoUrl || "https://tse2.mm.bing.net/th/id/OIP.GDzD9q-sQFLKPcjBMUOBOQHaHa?pid=Api&P=0&h=220"} alt="avatar" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-base-content flex items-center gap-2">
                      {user.firstName} {user.lastName}
                      {user.isPremium && (
                        <span
                          title={user.membershipTier === 'gold' ? 'Gold Member' : 'Silver Member'}
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${user.membershipTier === 'gold' ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'}`}
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.4-1.4z"/></svg>
                          {user.membershipTier?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-base-content/60">{user.emailId}</div>
                  </div>
                </div>
              </li>

              <li>
                <button 
                  onClick={() => {
                    console.log('Profile button clicked');
                    navigate('/profile');
                  }} 
                  className="text-base-content hover:bg-gradient-primary hover:text-white rounded-lg interactive-hover w-full text-left flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  Profile
                  {isActivePage('/profile') && <span className="badge badge-primary badge-sm">Current</span>}
                </button>
              </li>
                
              <li>
                <button 
                  onClick={() => {
                    console.log('Connections button clicked');
                    navigate('/connections');
                  }} 
                  className="text-base-content hover:bg-gradient-secondary hover:text-white rounded-lg interactive-hover w-full text-left flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                    Connections
                    {isActivePage('/connections') && <span className="badge badge-secondary badge-sm">Current</span>}
                  </button>
                </li>
                
              <li>
                <button 
                  onClick={() => {
                    console.log('Requests button clicked');
                    navigate('/requests');
                  }} 
                  className="text-base-content hover:bg-gradient-accent hover:text-white rounded-lg interactive-hover w-full text-left flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                    </svg>
                    Requests
                    {isActivePage('/requests') && <span className="badge badge-accent badge-sm">Current</span>}
                  </button>
                </li>

              <div className="divider my-2"></div>
                
              <li>
                  <a 
                    onClick={handleLogout} 
                    className="text-red-600 hover:bg-red-500 hover:text-white rounded-lg interactive-hover"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                    </svg>
                    Logout
                  </a>
                </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;