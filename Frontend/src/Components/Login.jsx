import {useState} from "react"
import axios from "axios";//same work as fetch 
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import ThemeToggle from "./ThemeToggle";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [islogin, setislogin] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate();   
  const [error, setError] = useState("")

  // Debug logs
  console.log("Login component state:", { emailId, password, firstName, lastName });

  const handleLogin = async() => {
    try
      {
        const res = await axios.post(BASE_URL + "/login", 
          { emailId, password }, 
          { withCredentials: true }
        );
        dispatch(addUser(res.data));
        return navigate("/")
      }
      catch(err){
        setError(err.message)
        console.error(err?.response?.data || "Something  went wrong");
      }
  }

  const handleSignup = async() => {
    try
      {
        const res = await axios.post(BASE_URL + "/signup", 
          { firstName, lastName, emailId, password }, 
          { withCredentials: true }
        );
        dispatch(addUser(res.data));
        return navigate("/profile")
      }
      catch(err){
        setError(err.message)
        console.error(err?.response?.data || "Something  went wrong");
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="bg-pattern absolute inset-0"></div>
      
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="card bg-base-100 shadow-xl w-full max-w-md relative z-10 p-8">
        <div className="text-center mb-6">
          {/* Logo and header */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center float-animation">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-base-content mb-2">
            {islogin ? "Welcome back!" : "Join DevConnect"}
          </h2>
          <p className="text-base-content/70 mb-6">
            {islogin 
              ? "Sign in to your account to continue" 
              : "Create your account to start connecting with developers"
            }
          </p>
        </div>

        <form className="form-modern space-y-6" onSubmit={(e) => {
          e.preventDefault();
          islogin ? handleLogin() : handleSignup();
        }}>
          {/* First Name and Last Name for Signup */}
          {!islogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-base-content/50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full pl-10 h-12 rounded-xl bg-base-200 text-base-content"
                    placeholder="Enter your first name"
                    onChange={(e) => setfirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-base-content/50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full pl-10 h-12 rounded-xl bg-base-200 text-base-content"
                    placeholder="Enter your last name"
                    onChange={(e) => setlastName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-base-content/50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <input
                type="email"
                id="emailId"
                name="emailId"
                value={emailId}
                className="input input-bordered w-full pl-10 h-12 rounded-xl bg-base-200 text-base-content"
                placeholder="Enter your email address"
                autoComplete="email"
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-base-content/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                className="input input-bordered w-full pl-10 h-12 rounded-xl bg-base-200 text-base-content"
                placeholder="Enter your password"
                autoComplete={islogin ? "current-password" : "new-password"}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-gradient-primary w-full h-12 rounded-xl text-white font-semibold text-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 border-0"
          >
            {islogin ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 102 0V4a1 1 0 011-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                </svg>
                Sign In
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                </svg>
                Create Account
              </>
            )}
          </button>

          {/* Toggle Login/Signup */}
          <div className="text-center pt-4 border-t border-base-300">
            <p className="text-base-content/70 mb-2">
              {islogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              className="text-primary hover:text-primary/80 font-semibold transition-colors duration-300 interactive-hover"
              onClick={() => {
                setislogin(value => !value);
                setError("");
              }}
            >
              {islogin ? "Sign up here" : "Sign in here"}
            </button>
          </div>
        </form>

        {/* Features */}
        {!islogin && (
          <div className="mt-8 grid grid-cols-3 gap-4 text-center p-4">
            <div className="text-base-content/70">
              <svg className="w-8 h-8 mx-auto mb-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              <p className="text-xs font-medium">Connect</p>
            </div>
            <div className="text-base-content/70">
              <svg className="w-8 h-8 mx-auto mb-2 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <p className="text-xs font-medium">Collaborate</p>
            </div>
            <div className="text-base-content/70">
              <svg className="w-8 h-8 mx-auto mb-2 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <p className="text-xs font-medium">Grow</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;