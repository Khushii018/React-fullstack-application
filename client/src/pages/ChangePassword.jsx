import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const changePassword = async () => {
        if (!oldPassword || !newPassword) {
            alert("Please enter both passwords");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.put(
                "http://localhost:3001/auth/changepassword",
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            );

            console.log("CHANGE PASSWORD RESPONSE:", response.data);

            if (response.data.error) {
                alert(response.data.error);
                return;
            }

            alert(response.data.message);

            // Clear fields after successful change
            setOldPassword("");
            setNewPassword("");

        } catch (error) {
            console.log(
                "CHANGE PASSWORD ERROR:",
                error.response?.data || error.message
            );

            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">

                    

                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Change Password
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Keep your account secure with a strong password
                    </p>

                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

                    {/* Old Password */}
                    <div className="mb-5">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your current password"
                            value={oldPassword}
                            onChange={(e) =>
                                setOldPassword(e.target.value)
                            }
                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />

                    </div>

                    {/* New Password */}
                    <div className="mb-6">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    changePassword();
                                }
                            }}
                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />

                    </div>

                    {/* Change Password Button */}
                    <button
                        onClick={changePassword}
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl font-semibold text-white shadow-md transition duration-200 ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98]"
                        }`}
                    >
                        {loading
                            ? "Changing Password..."
                            : "Save Changes"}
                    </button>

                    {/* Security Message */}
                    <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4">

                        <p className="text-sm text-indigo-700">
                             Your password is securely encrypted before
                            being stored.
                        </p>

                    </div>

                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Make sure you remember your new password.
                </p>

            </div>
        </div>
    );
}

export default ChangePassword;