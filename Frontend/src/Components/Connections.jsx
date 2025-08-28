import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    // Check if user is logged in before making API call
    if (!user) {
      console.log("User not logged in, redirecting to login");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("Fetching connections for user:", user._id);
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log("API Response:", res.data);
      dispatch(addConnections(res.data.data || []));
    } catch (err) {
      console.error("Error fetching connections:", err);
      
      // Handle 401 Unauthorized - redirect to login
      if (err.response?.status === 401) {
        console.log("Unauthorized access, redirecting to login");
        navigate("/login");
        return;
      }
      
      setError(err.response?.data?.message || err.message || "Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="bg-pattern absolute inset-0"></div>
        <div className="relative z-10 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Connections</h1>
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 float-animation">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">Loading your network...</p>
          </div>
          
          {/* Loading skeletons */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="modern-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="skeleton-shimmer w-16 h-16 rounded-full"></div>
                    <div className="flex-1">
                      <div className="skeleton-shimmer h-4 rounded mb-2"></div>
                      <div className="skeleton-shimmer h-3 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
        <div className="bg-pattern absolute inset-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center py-20">
          <div className="modern-card w-full max-w-md mx-auto p-8 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Connections</h2>
            <p className="text-gray-600 mb-6">We couldn't load your connections right now.</p>
            <div className="alert alert-error mb-6 rounded-xl">
              <span className="text-sm">{error}</span>
            </div>
            <button 
              onClick={fetchConnections}
              className="btn-gradient-primary btn rounded-xl px-8 py-3 text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="bg-pattern absolute inset-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center py-20">
          <div className="modern-card w-full max-w-lg mx-auto p-8 text-center">
            <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 float-animation">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-base-content mb-2">No Connections Yet</h2>
            <p className="text-base-content/70 mb-8">Start connecting with developers to build your professional network!</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <div className="text-left">
                  <p className="text-blue-800 font-medium text-sm">Get Started</p>
                  <p className="text-blue-700 text-sm">Browse the feed to find and connect with developers</p>
                </div>
              </div>
            </div>
            
            <a 
              href="/feed"
              className="btn-gradient-primary btn rounded-xl px-8 py-3 text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              Explore Feed
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main Connections Content
  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-pattern absolute inset-0"></div>
      <div className="relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your <span className="text-gradient">Network</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Here are all the amazing developers you've connected with. Keep growing your professional network!
          </p>
          
          {/* Stats */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20">
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600">{connections.length}</div>
                  <div className="text-gray-600">Connections</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">🌐</div>
                  <div className="text-gray-600">Growing Network</div>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* Connections Grid */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection, index) => {
              const { firstName, lastName, photoUrl, gender, age, about, _id, skills } = connection;
              return (
                <div key={_id || index} className="modern-card overflow-hidden group hover:scale-105 transition-all duration-300">
                  {/* Header with gradient */}
                  <div className="relative">
                    <div className="gradient-accent h-20 w-full"></div>
                    <div className="absolute inset-0 bg-pattern opacity-30"></div>
                  </div>
                  
                  {/* Profile Content */}
                  <div className="p-6 -mt-8 relative">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full border-4 border-white shadow-medium overflow-hidden bg-white">
                        <img 
                          src={photoUrl || "https://tse2.mm.bing.net/th/id/OIP.GDzD9q-sQFLKPcjBMUOBOQHaHa?pid=Api&P=0&h=220"} 
                          alt={`${firstName} ${lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Name and Details */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {firstName} {lastName}
                      </h3>
                      {age && gender && (
                        <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                          </svg>
                          {age} years, {gender}
                        </p>
                      )}
                      <Link to={`/chat/${_id}`}><button className = "btn btn-primary">Chat</button></Link>
                    </div>

                    {/* About */}
                    {about && (
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm line-clamp-3 bg-gray-50 rounded-lg p-3">
                          {about}
                        </p>
                      </div>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {skills.slice(0, 3).map((skill, skillIndex) => (
                            <span key={skillIndex} className="badge-modern text-xs px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="badge-modern text-xs px-2 py-1 rounded-full">
                              +{skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-center">
                      <button className="btn btn-outline btn-primary btn-sm rounded-full interactive-hover">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
                        </svg>
                      </button>
                      <button className="btn btn-outline btn-secondary btn-sm rounded-full interactive-hover">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white/50 backdrop-blur-lg rounded-2xl px-8 py-6 border border-white/20 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Keep Growing</h3>
            <p className="text-gray-600 mb-4 text-sm">Discover more developers to expand your network</p>
            <a 
              href="/feed"
              className="btn-gradient-secondary btn rounded-xl text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              Find More Connections
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;