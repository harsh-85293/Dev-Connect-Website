import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {addUser} from "../utils/userSlice"
import { useEffect } from 'react';
import { profileAPI } from "../utils/api";

const Body = () => {
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const userdata = useSelector(store => store.user)

  const fetchUser = async() => {
    if(userdata) return;
    try{
        console.log("Fetching user profile...");
        const userData = await profileAPI.getProfile();
        console.log("User profile fetched:", userData);
        dispatch(addUser(userData))
      
    }
    catch(err){
      console.error("Error fetching user profile:", err);
      if(err.response?.status === 401 || err.status === 401){
        console.log("User not authenticated, redirecting to login");
        Navigate("/login")
      }
    }
  };

  useEffect(() => {
    fetchUser()
  }, [userdata])

  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Body
