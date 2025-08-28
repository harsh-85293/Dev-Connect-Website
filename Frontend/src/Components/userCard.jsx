import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {BASE_URL} from "../utils/constants"
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({user}) => {
  const {_id, firstName, lastName, photoUrl, age, gender, about, skills, recommendationScore, recommendationReasoning, isPremium, membershipTier} = user;
  const dispatch = useDispatch();
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMLDetails, setShowMLDetails] = useState(false);

  const handleRequest = async(status, userId) => {
    setIsLoading(true);
    setError("");
    
    try {
      console.log(`Sending ${status} request for user ${userId}`);
      console.log(`Making request to: ${BASE_URL}/request/send/${status}/${userId}`);
      console.log(`Cookies being sent:`, document.cookie);
      
      const response = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId, 
        {}, 
        {withCredentials: true} 
      );
      
      console.log("Request successful:", response.data);
      
      // Only remove from feed if the request was successful
      if (response.status === 200 || response.status === 201) {
        dispatch(removeFeed(userId));
        console.log(`User ${userId} removed from feed after ${status} request`);
      }
    } 
    catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
      console.error("Request failed:", err?.response?.data || err.message);
      console.error("Full error object:", err);
      console.error("Response status:", err?.response?.status);
      console.error("Response headers:", err?.response?.headers);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-md mx-auto float-animation overflow-hidden modern-card">
      {/* Header with gradient background */}
      <div className="relative">
        <div className="gradient-primary h-32 w-full"></div>
        <div className="absolute inset-0 bg-pattern"></div>
        
        {/* Profile Image */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-strong overflow-hidden bg-white">
              {!imageLoaded && (
                <div className="skeleton-shimmer w-full h-full rounded-full"></div>
              )}
              <img
                src={photoUrl || "https://tse2.mm.bing.net/th/id/OIP.GDzD9q-sQFLKPcjBMUOBOQHaHa?pid=Api&P=0&h=220"}
                alt={`${firstName} ${lastName}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = "https://tse2.mm.bing.net/th/id/OIP.GDzD9q-sQFLKPcjBMUOBOQHaHa?pid=Api&P=0&h=220";
                }}
              />
            </div>
            {/* Online status indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white pulse-glow"></div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-20 px-6 pb-6">
        {/* Name and Age */}
                        <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-base-content mb-1 flex items-center justify-center gap-2">
                    {firstName} {lastName}
                    {isPremium && (
                      <span title={membershipTier === 'gold' ? 'Gold Member' : 'Silver Member'} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${membershipTier === 'gold' ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'}`}>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.4-1.4z"/></svg>
                        {membershipTier === 'gold' ? 'GOLD' : 'SILVER'}
                      </span>
                    )}
                  </h2>
                  {age && gender && (
                    <p className="text-base-content/70 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      {age} years, {gender}
                    </p>
                  )}
                </div>

        {/* About Section */}
        {about && (
          <div className="mb-4">
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <h4 className="font-semibold text-base-content mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                About
              </h4>
              <p className="text-base-content/80 text-sm leading-relaxed">{about}</p>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill, index) => (
                <span key={index} className="badge-modern px-3 py-1 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="badge-modern px-3 py-1 text-xs font-medium rounded-full">
                  +{skills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-4 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button 
            className="btn btn-outline btn-error hover:scale-105 transition-all duration-300 flex-1 max-w-32 rounded-full"
            onClick={() => handleRequest("ignore", _id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                Ignore
              </>
            )}
          </button>
          
          <button 
            className="btn-gradient-primary btn hover:scale-105 transition-all duration-300 flex-1 max-w-32 rounded-full border-0 text-white"
            onClick={() => handleRequest("interested", _id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" clipRule="evenodd"/>
                </svg>
                Connect
              </>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex justify-center gap-4 pt-4 border-t border-gray-100">
          <button className="btn btn-ghost btn-sm rounded-full interactive-hover">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
          </button>
          <button className="btn btn-ghost btn-sm rounded-full interactive-hover">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
            </svg>
          </button>
          <button className="btn btn-ghost btn-sm rounded-full interactive-hover">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
