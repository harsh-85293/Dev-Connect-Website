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
    if (userdata && Object.keys(userdata).length > 0) return;

    try {
      const userData = await profileAPI.getProfile();
      if (userData) {
        dispatch(addUser(userData));
      }
    } catch (err) {
      if (err?.response?.status === 401 || err?.status === 401) {
        Navigate('/login');
        return;
      }

      // Ignore noisy auth/profile fetch failures so they do not surface in the UI.
    }
  };

  useEffect(() => {
    fetchUser();
  }, [dispatch, Navigate, userdata]);

  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Body
