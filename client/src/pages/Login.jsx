import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();

    const login = async () => {
        const data = {
            username: username,
            password: password,
        };

        try {
            const response = await axios.post(
                "http://localhost:3001/auth/login",
                data
            );

            console.log(response.data);

            if (response.data.error) {
                alert(response.data.error);
                return;
            }

            localStorage.setItem("accessToken", response.data.token);

            setAuthState({
                username: response.data.username,
                id: response.data.id,
                status: true,
            });

            navigate("/");
        } catch (error) {
            console.error(
                "Login error:",
                error.response?.data || error.message
            );

            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">

            {/* Login Card */}
            <div className="w-full max-w-md">

                {/* Logo / Heading */}
                <div className="text-center mb-8">

                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-3xl text-white font-bold">
                            C
                        </span>
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Login to continue to Community Posts
                    </p>

                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

                    {/* Username */}
                    <div className="mb-5">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />

                    </div>

                    {/* Password */}
                    <div className="mb-6">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    login();
                                }
                            }}
                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />

                    </div>

                    {/* Login Button */}
                    <button
                        onClick={login}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition duration-200"
                    >
                        Login
                    </button>

                    {/* Register */}
                    <div className="text-center mt-6">

                        <p className="text-sm text-gray-500">
                            Don't have an account?
                        </p>

                        <button
                            onClick={() => navigate("/registration")}
                            className="mt-1 text-indigo-600 font-semibold hover:text-indigo-800 transition"
                        >
                            Create an account
                        </button>

                    </div>

                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © 2026 Community Posts
                </p>

            </div>
        </div>
    );
}

export default Login;