import axios from "axios"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRequests } from "../utils/requestSlice";
import { BASE_URL } from "../utils/constants";

const Requests = () => {
const requests = useSelector((store) => store.requests);
const user = useSelector((store) => store.user);
const dispatch = useDispatch();
const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
  
  const fetchRequests = async() => {
    // Check if user is logged in before making API call
    if (!user) {
      console.log("User not logged in, redirecting to login");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log("Fetching requests for user:", user._id);

      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true
      });

      console.log("Requests API Response:", res.data);

      dispatch(addRequests(res.data.data || []));//res.data.data is payload
    } 
    catch (err) {
      console.error("Error fetching requests:", err);
      
      // Handle 401 Unauthorized - redirect to login
      if (err.response?.status === 401) {
        console.log("Unauthorized access, redirecting to login");
        navigate("/login");
        return;
      }
      
      setError(err.response?.data?.message || err.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, action) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        BASE_URL + `/user/requests/${requestId}/respond`,
        { action },
        { withCredentials: true }
      );
      
      console.log(`${action} response:`, res.data);
      
      // Refresh the requests list after accepting/rejecting
      await fetchRequests();
      
      // Show success message
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      setError(err.response?.data?.message || err.message || `Failed to ${action} request`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-10">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-10">
        <div className="alert alert-error max-w-md mx-auto">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={fetchRequests}>Retry</button>
        </div>
      </div>
    );
  }

  if (!requests || !Array.isArray(requests)) {
    return (
      <div className="text-center my-10">
        <h1 className="text-bold text-3xl">Loading Requests...</h1>
        <p>Please wait while we fetch your connection requests.</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center my-10">
        <h1 className="text-bold text-3xl">No Connection Requests</h1>
        <p>You haven't received any connection requests yet.</p>
        <p className="text-gray-600 mt-2">Try visiting the Feed page to connect with other developers!</p>
      </div>
    );
  }

  return (
    <div className="text-center my-10">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-bold text-3xl">Connection Requests</h1>
          <button 
            onClick={fetchRequests} 
            disabled={loading}
            className="btn btn-outline btn-primary"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "🔄 Refresh"
            )}
          </button>
        </div>
        
        <div className="mt-4">
          {requests.map((request, index) => (
            <div key={index} className="card bg-base-200 shadow-xl mb-4">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full">
                        {request.fromUserId?.photoUrl ? (
                          <img 
                            src={request.fromUserId.photoUrl} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <h3 className="card-title">
                        {request.fromUserId?.firstName} {request.fromUserId?.lastName}
                      </h3>
                      <p className="text-gray-600">
                        Wants to connect with you
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: <span className="badge badge-warning">Pending</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => handleRequestResponse(request._id, "accept")}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Accept"
                      )}
                    </button>
                    <button 
                      className="btn btn-error btn-sm"
                      onClick={() => handleRequestResponse(request._id, "reject")}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Decline"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requests
