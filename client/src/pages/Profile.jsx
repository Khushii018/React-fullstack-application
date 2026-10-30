import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";


function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    const { authState } = useContext(AuthContext);

    // Get user information and posts
    useEffect(() => {
        console.log("PROFILE ID:", id);

        axios
            .get(`http://localhost:3001/auth/basicinfo/${id}`)
            .then((response) => {
                console.log("USER:", response.data);
                setUsername(response.data.username);
            })
            .catch((error) => {
                console.log("USER ERROR:", error);
            });

        axios
            .get(`http://localhost:3001/posts/byuserId/${id}`)
            .then((response) => {
                console.log("PROFILE POSTS:", response.data);
                setListOfPosts(response.data || []);
            })
            .catch((error) => {
                console.log("POST ERROR:", error);
            });
    }, [id]);

    // Like post
    const likeAPost = async (postId) => {
        try {
            const response = await axios.post(
                "http://localhost:3001/likes",
                {
                    PostId: postId,
                },
                {
                    headers: {
                        accessToken:
                            localStorage.getItem("accessToken"),
                    },
                }
            );

            console.log("LIKE RESPONSE:", response.data);

            if (response.data.error) {
                alert(response.data.error);
                return;
            }

            // Add post ID to likedPosts
            setLikedPosts((prev) => [
                ...prev,
                postId,
            ]);

            // Update like count
            setListOfPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            likes: [
                                ...(Array.isArray(post.likes)
                                    ? post.likes
                                    : []),
                                response.data,
                            ],
                        };
                    }

                    return post;
                })
            );
        } catch (error) {
            console.log(
                "LIKE ERROR:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

            <div className="max-w-4xl mx-auto px-5 pt-12">

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">

                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">

                            <span className="text-4xl font-bold text-white">
                                {username
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </span>

                        </div>
                        {/* user info */}

                        <div className="text-center sm:text-left flex-1">

                            <p className="text-sm text-gray-400 mb-1">
                                Profile
                            </p>

                            <h1 className="text-3xl font-extrabold text-gray-900">
                                {username}
                            </h1>

                            

                        </div>


                        {/* Change Password */}

                        {authState.username === username && (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/changepassword"
                                    )
                                }
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                            >
                                Change Password
                            </button>
                        )}

                    </div>


                    {/* Profile Stats */}

                    <div className="border-t border-gray-100 mt-8 pt-6">

                        <div className="flex justify-center sm:justify-start gap-10">

                            <div className="text-center">

                                <p className="text-2xl font-bold text-gray-900">
                                    {listOfPosts.length}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Posts
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* POSTS */}

            <div className="max-w-4xl mx-auto px-5 pt-8 pb-16">

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-bold text-gray-900">
                        {username}'s Posts
                    </h2>

                </div>


                {listOfPosts.length === 0 ? (

                    /* Empty State */

                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">

                        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-5">

                            

                        </div>

                        <h3 className="text-xl font-bold text-gray-800">
                            No posts yet
                        </h3>

                        <p className="text-gray-500 mt-2">
                            This user hasn't created
                            any posts yet.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-6">

                        {listOfPosts.map((post) => {

                            const isLiked =
                                likedPosts.includes(
                                    post.id
                                );

                            

                             const likeCount =
                                Array.isArray(
                                    post.likes
                                )
                                    ? post.likes.length
                                    : 0;

                            return (

                                <article
                                    key={post.id}
                                    onClick={() =>
                                        navigate(
                                            `/post/${post.id}`
                                        )
                                    }
                                    className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-7 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >

                                    {/* Category */}

                                    <div className="flex items-center justify-between mb-5">

                                        <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                                            COMMUNITY POST
                                        </span>

                                        <span className="text-xs text-gray-400">
                                            #{post.id}
                                        </span>

                                    </div>


                                    {/* Title */}

                                    <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition">

                                        {post.title}

                                    </h2>


                                    {/* Content */}

                                    <p className="text-gray-600 leading-7 text-base sm:text-lg line-clamp-3">

                                        {post.postText}

                                    </p>


                                    {/* Bottom */}

                                    <div className="border-t border-gray-100 mt-6 pt-5">

                                        <div className="flex items-center justify-between">

                                            {/* Author */}

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">

                                                    {post.username
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>

                                                <div>

                                                    <p className="text-xs text-gray-400">
                                                        Posted by
                                                    </p>

                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {post.username}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Like */}

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    likeAPost(
                                                        post.id
                                                    );
                                                }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                                                    isLiked
                                                        ? "bg-indigo-100 text-indigo-600"
                                                        : "bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
                                                }`}
                                            >

                                                <ThumbUpIcon
                                                        fontSize="small"
                                                    />

                                                    <span className="font-semibold text-sm">
                                                        {likeCount}
                                                    </span>

                                            </button>

                                        </div>

                                    </div>

                                </article>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Profile;