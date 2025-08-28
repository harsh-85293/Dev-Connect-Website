import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage if available
const getInitialState = () => {
  try {
    const savedUser = localStorage.getItem('devConnectUser');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const userSlice = createSlice({
    name : "user",
    initialState : getInitialState(),
    reducers : {
        addUser : (state, action) => {
            // Save to localStorage
            try {
                localStorage.setItem('devConnectUser', JSON.stringify(action.payload));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
            return action.payload;
        },
        removeUser : (state, action) => { 
            // Remove from localStorage
            try {
                localStorage.removeItem('devConnectUser');
            } catch (error) {
                console.error('Error removing from localStorage:', error);
            }
            return null;
        }
    }
})

export const {addUser, removeUser} = userSlice.actions;

export default userSlice.reducer