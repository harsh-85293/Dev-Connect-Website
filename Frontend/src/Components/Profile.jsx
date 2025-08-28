import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import EditProfile from "./EditProfile";
import { profileAPI } from "../utils/api";
import { addUser } from "../utils/userSlice";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notification, setNotification] = useState(null);

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userData = await profileAPI.refreshProfile();
      dispatch(addUser(userData));
      setLastUpdated(new Date());
      setNotification({ type: 'success', message: 'Profile refreshed successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error refreshing profile:", error);
      setNotification({ type: 'error', message: 'Failed to refresh profile. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh profile when component mounts
  useEffect(() => {
    refreshProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center my-10">
        <div className="text-red-500">Please login to view your profile</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-10">
      {/* Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 alert ${
          notification.type === 'success' ? 'alert-success' : 'alert-error'
        }`}>
          <span>{notification.message}</span>
          <button 
            className="btn btn-sm btn-ghost" 
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
        
        {/* Left Side - Edit Profile Form */}
        <div className="w-full">
          <EditProfile user={user} />
        </div>

        {/* Right Side - Profile Display */}
        <div className="w-full">
          <div className="card bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title text-2xl">My Profile</h2>
                <button 
                  onClick={refreshProfile} 
                  disabled={isLoading}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "🔄 Refresh"
                  )}
                </button>
              </div>
              
              {lastUpdated && (
                <p className="text-sm text-gray-500 mb-4">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}

              {/* Profile Photo and Basic Info */}
              <div className="flex flex-col items-center mb-6">
                <div className="avatar mb-4">
                  <div className="w-48 h-48 rounded-full">
                    {user.photoUrl ? (
                      <img 
                        src={user.photoUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://tse2.mm.bing.net/th/id/OIP.GDzD9q-sQFLKPcjBMUOBOQHaHa?pid=Api&P=0&h=220";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                    {user.firstName} {user.lastName}
                    {user.isPremium && (
                      <span title={user.membershipTier === 'gold' ? 'Gold Member' : 'Silver Member'} className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full ${user.membershipTier === 'gold' ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'}`}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.4-1.4z"/></svg>
                        {user.membershipTier?.toUpperCase()}
                      </span>
                    )}
                  </h3>
                  {user.age && user.gender && (
                    <p className="text-gray-600 mb-2 text-lg">
                      {user.age}, {user.gender}
                    </p>
                  )}
                  {user.emailId && (
                    <p className="text-gray-600 mb-2">
                      📧 {user.emailId}
                    </p>
                  )}
                </div>
              </div>

              {/* About Section */}
              {user.about && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">About</h4>
                  <p className="text-gray-700 bg-base-200 p-4 rounded-lg">
                    {user.about}
                  </p>
                </div>
              )}

              {/* Skills Section */}
              {user.skills && user.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <div key={index} className="badge badge-primary">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Completion Indicator */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Profile Completion</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min(100, [
                        user.firstName ? 20 : 0,
                        user.lastName ? 20 : 0,
                        user.emailId ? 20 : 0,
                        user.photoUrl ? 15 : 0,
                        user.about ? 10 : 0,
                        user.skills && user.skills.length > 0 ? 15 : 0
                      ].reduce((a, b) => a + b, 0))}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Complete your profile to increase your visibility
                </p>
              </div>

              {/* Profile Stats */}
              <div className="stats shadow bg-base-200 mb-6">
                <div className="stat">
                  <div className="stat-title">Profile Views</div>
                  <div className="stat-value text-primary">0</div>
                  <div className="stat-desc">Since joining</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Connections</div>
                  <div className="stat-value text-secondary">0</div>
                  <div className="stat-desc">Professional network</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Member Since</div>
                  <div className="stat-value text-accent">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="stat-desc">DevConnect member</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card-actions justify-center gap-3 flex-wrap">
                <Link to="/feed" className="btn btn-primary">
                  🔍 Browse Developers
                </Link>
                <Link to="/email-preferences" className="btn btn-outline btn-info">
                  📧 Email Settings
                </Link>
                <Link to="/" className="btn btn-secondary">
                  🏠 Back to Home
                </Link>
                <button 
                  onClick={refreshProfile} 
                  className="btn btn-outline btn-accent"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "🔄 Sync Profile"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
