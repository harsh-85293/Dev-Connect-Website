import axios from "axios"
import {BASE_URL} from "../utils/constants"
import { addFeed } from "../utils/feedSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserCard from "./userCard";

const Feed = () => {
  const feed = useSelector(store => store.feed)
  const user = useSelector(store => store.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mlEnabled, setMlEnabled] = useState(true)
  const [feedAnalytics, setFeedAnalytics] = useState(null)
  const [currentUserIndex, setCurrentUserIndex] = useState(0)

  const getFeed = async (forceRefresh = false) => {
      if(feed && !forceRefresh) return;
      
      // Check if user is logged in before making API call
      if (!user) {
        console.log("User not logged in, redirecting to login");
        navigate("/login");
        return;
      }
      
      setLoading(true);
      setError("");
      try{
        console.log("Fetching intelligent feed for user:", user._id, "ML enabled:", mlEnabled);
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
          params: {
            ml: mlEnabled,
            limit: user?.membershipTier === 'gold' ? 200 : user?.membershipTier === 'silver' || user?.isPremium ? 100 : 10,
            page: 1
          }
        })
        
        console.log("Feed response:", res.data);
        dispatch(addFeed(res.data.data || res.data))
        
        // Store analytics data
        if (res.data.recommendations) {
          setFeedAnalytics(res.data);
        }
      }
      catch(err){
        console.error("Error fetching feed:", err);
        
        // Handle 401 Unauthorized - redirect to login
        if (err.response?.status === 401) {
          console.log("Unauthorized access, redirecting to login");
          navigate("/login");
          return;
        }
        
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false);
      }
    }

    const toggleMLRecommendations = async () => {
      setMlEnabled(!mlEnabled);
      // Clear current feed and fetch new one
      dispatch(addFeed(null));
      setTimeout(() => {
        getFeed(true);
      }, 100);
    }
    
    useEffect(() => {
      getFeed();
    }, [])

    // Loading State
    if (loading) {
      return (
        <div className="min-h-screen bg-base-200">
          <div className="bg-pattern absolute inset-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center py-20">
            <div className="card bg-base-100 shadow-xl w-full max-w-md mx-auto p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 float-animation">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-base-content mb-2">Finding Developers</h2>
              <p className="text-base-content/70 mb-6">We're searching for amazing developers for you to connect with...</p>
              <div className="space-y-3">
                <div className="skeleton-shimmer h-4 rounded-full"></div>
                <div className="skeleton-shimmer h-4 rounded-full w-3/4 mx-auto"></div>
                <div className="skeleton-shimmer h-4 rounded-full w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Error State
    if (error) {
      return (
        <div className="min-h-screen bg-base-200">
          <div className="bg-pattern absolute inset-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center py-20">
            <div className="modern-card w-full max-w-md mx-auto p-8 text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-6">We couldn't load the feed right now. Please try again.</p>
              <div className="alert alert-error mb-6 rounded-xl">
                <span className="text-sm">{error}</span>
              </div>
              <button 
                onClick={() => {
                  setError("");
                  getFeed();
                }}
                className="btn-gradient-primary btn rounded-xl px-8 py-3 text-white font-semibold hover:scale-105 transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Empty State
    if (!feed || feed.length === 0) {
      return (
        <div className="min-h-screen bg-base-200">
          <div className="bg-pattern absolute inset-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center py-20">
            <div className="modern-card w-full max-w-md mx-auto p-8 text-center">
              <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 float-animation">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-base-content mb-2">No More Developers</h2>
              <p className="text-base-content/70 mb-6">You've seen all available developers for now. Check back later for new connections!</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-blue-800 font-medium text-sm">Pro Tip</p>
                    <p className="text-blue-700 text-sm">Complete your profile to get better connections!</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="btn btn-outline btn-primary rounded-xl flex-1 hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                  </svg>
                  Refresh
                </button>
                <a 
                  href="/profile"
                  className="btn-gradient-accent btn rounded-xl flex-1 text-white hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  Update Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Main Feed Content
    return ( 
      <div className="min-h-screen bg-base-200">
        <div className="bg-pattern absolute inset-0"></div>
        <div className="relative z-10 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-base-content mb-2">
              Discover <span className="text-gradient">Developers</span>
            </h1>
            <p className="text-base-content/70 max-w-md mx-auto mb-4">
              {mlEnabled ? 
                "AI-powered recommendations based on your skills and interests" :
                "Random discovery - enable smart recommendations for better matches"
              }
            </p>
            
            {/* ML Toggle and Analytics */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-base-content/70">Random</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={mlEnabled}
                  onChange={toggleMLRecommendations}
                />
                <span className="text-sm text-base-content/70">AI Smart Feed</span>
              </div>
              
              {mlEnabled && feedAnalytics && user.skills && user.skills.length > 0 && (
                <div className="badge badge-outline badge-primary gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {feedAnalytics.recommendations?.highMatch || 0} high matches found
                </div>
              )}
            </div>

            {/* Skills-based recommendations info */}
            {mlEnabled && user.skills && user.skills.length > 0 && (
              <div className="bg-primary/10 rounded-xl p-4 max-w-2xl mx-auto mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                  <span className="font-semibold text-primary">Smart Matching Active</span>
                </div>
                <p className="text-sm text-base-content/70">
                  Finding developers with skills: <span className="font-medium">{user.skills.slice(0, 3).join(', ')}</span>
                  {user.skills.length > 3 && <span> +{user.skills.length - 3} more</span>}
                </p>
              </div>
            )}

            {/* Prompt to add skills for better recommendations */}
            {(!user.skills || user.skills.length === 0) && (
              <div className="bg-warning/10 rounded-xl p-4 max-w-2xl mx-auto mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-semibold text-warning">Enhance Your Experience</span>
                </div>
                <p className="text-sm text-base-content/70 mb-2">
                  Add skills to your profile to get AI-powered recommendations!
                </p>
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="btn btn-warning btn-sm"
                >
                  Add Skills Now
                </button>
              </div>
            )}
          </div>
          
          {/* User Card */}
          <div className="flex justify-center px-4">
        <UserCard user={feed[0]}/>  
          </div>

          {/* Stats */}
          <div className="mt-12 flex justify-center">
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20">
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-indigo-600">{feed.length}</div>
                  <div className="text-gray-600">Remaining</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">✨</div>
                  <div className="text-gray-600">Quality Connections</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Feed
