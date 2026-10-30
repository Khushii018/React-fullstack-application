import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
} from "react-router-dom";

import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {

    const [authState, setAuthState] = useState({
        username: "",
        id: 0,
        status: false,
    });

    // Check if user is logged in
    useEffect(() => {

        const token = localStorage.getItem("accessToken");

        if (!token) {
            setAuthState({
                username: "",
                id: 0,
                status: false,
            });
            return;
        }

        axios
            .get(
                "http://localhost:3001/auth/auth",
                {
                    headers: {
                        accessToken: token,
                    },
                }
            )
            .then((response) => {

                if (response.data.error) {

                    setAuthState({
                        username: "",
                        id: 0,
                        status: false,
                    });

                } else {

                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true,
                    });

                }

            })
            .catch((error) => {

                console.log(
                    "AUTH ERROR:",
                    error.response?.data || error.message
                );

                setAuthState({
                    username: "",
                    id: 0,
                    status: false,
                });

            });

    }, []);

    // Logout
    const logout = () => {

        localStorage.removeItem("accessToken");

        setAuthState({
            username: "",
            id: 0,
            status: false,
        });
    };

    return (

        <AuthContext.Provider
            value={{
                authState,
                setAuthState
            }}
        >

            <Router>

                <div className="min-h-screen bg-gray-100">

                    {/*NAVBAR */}

                    <nav className="bg-white border-b border-gray-200">

                        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">


                            <Link
                                to="/"
                                className="flex items-center gap-2"
                            >

                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">

                                    <span className="text-white font-bold">
                                        C
                                    </span>

                                </div>

                                <span className="text-lg font-bold text-gray-800">
                                    Community
                                </span>

                            </Link>


                            {/* Navigation */}

                            <div className="flex items-center gap-6">

                                {!authState.status ? (

                                    <>
                                        <Link
                                            to="/login"
                                            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            to="/registration"
                                            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                        >
                                            Register
                                        </Link>
                                    </>

                                ) : (

                                    <>

                                        <Link
                                            to="/"
                                            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                        >
                                            Home
                                        </Link>

                                        <Link
                                            to="/createpost"
                                            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                        >
                                            Create Post
                                        </Link>

                                        <Link
                                            to={`/profile/${authState.id}`}
                                            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                        >
                                            Profile
                                        </Link>

                                        

                                        <Link
                                        type="button"
                                        to={"/login"}
                                            onClick={logout}
                                            className="text-sm font-medium text-red-500 hover:text-red-700 transition"
                                        >
                                            Logout
                                        </Link>

                                    </>

                                )}

                            </div>

                        </div>

                    </nav>


                    {/* PAGES */}

                    <Routes>

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/createpost"
                            element={<CreatePost />}
                        />

                        <Route
                            path="/post/:id"
                            element={<Post />}
                        />

                        <Route
                            path="/registration"
                            element={<Registration />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/profile/:id"
                            element={<Profile />}
                        />

                        <Route
                            path="/changepassword"
                            element={<ChangePassword />}
                        />

                        <Route
                            path="*"
                            element={<PageNotFound />}
                        />

                    </Routes>

                </div>

            </Router>

        </AuthContext.Provider>
    );
}

export default App;