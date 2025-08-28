import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        about: "",
        photoUrl: "",
        skills: []
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [newSkill, setNewSkill] = useState("");

    // Load current user data when component mounts or user prop changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                age: user.age || "",
                gender: user.gender || "",
                about: user.about || "",
                photoUrl: user.photoUrl || "",
                skills: user.skills || []
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && formData.skills.length < 10) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.patch(
                `${BASE_URL}/user/${user._id}`,
                formData,
                { withCredentials: true }
            );

            // Update Redux store with new user data
            dispatch(addUser({ ...user, ...formData }));
            
            // Show success toast
            const toast = document.createElement('div');
            toast.className = 'toast toast-top toast-end';
            toast.innerHTML = `
                <div class="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Profile saved successfully! 🎉</span>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Remove toast after 3 seconds
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 3000);
            
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center my-10">
                <div className="text-red-500">Please login to edit your profile</div>
            </div>
        );
    }

    return (
        <div className="card bg-base-300 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Edit Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold">First Name *</span>
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                className="input input-bordered w-full"
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold">Last Name</span>
                            </div>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                className="input input-bordered w-full"
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    {/* Age and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold">Age</span>
                            </div>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                className="input input-bordered w-full"
                                onChange={handleInputChange}
                                min="18"
                                max="100"
                            />
                        </label>
                        
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold">Gender</span>
                            </div>
                            <select
                                name="gender"
                                value={formData.gender}
                                className="select select-bordered w-full"
                                onChange={handleInputChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                            </select>
                        </label>
                    </div>

                    {/* Photo URL */}
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text font-semibold">Profile Photo URL</span>
                        </div>
                        <input
                            type="url"
                            name="photoUrl"
                            value={formData.photoUrl}
                            className="input input-bordered w-full"
                            placeholder="https://example.com/photo.jpg"
                            onChange={handleInputChange}
                        />
                    </label>

                    {/* About */}
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text font-semibold">About</span>
                        </div>
                        <textarea
                            name="about"
                            value={formData.about}
                            className="textarea textarea-bordered w-full h-24"
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself..."
                        />
                    </label>

                    {/* Skills */}
                    <div className="form-control">
                        <div className="label">
                            <span className="label-text font-semibold">Skills (Max 10)</span>
                        </div>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newSkill}
                                className="input input-bordered flex-1"
                                placeholder="Add a skill"
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleAddSkill}
                                disabled={!newSkill.trim() || formData.skills.length >= 10}
                            >
                                Add
                            </button>
                        </div>
                        
                        {/* Display Skills */}
                        {formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="badge badge-primary gap-2">
                                        {skill}
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => handleRemoveSkill(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Error Messages */}
                    {error && (
                        <div className="alert alert-error">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="card-actions justify-end mt-6">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Saving...
                                </>
                            ) : (
                                "Save Profile"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
 