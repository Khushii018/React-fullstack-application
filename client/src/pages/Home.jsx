import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikesPosts] = useState([]);

    const navigate = useNavigate();

    // Get all posts
    const getPosts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/posts",
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            );

            console.log("POSTS:", response.data);

            if (response.data.error) {
                console.log(
                    "GET POSTS ERROR:",
                    response.data.error
                );
                return;
            }

            setListOfPosts(
                response.data.listOfPosts || []
            );

            setLikesPosts(
                (response.data.likedPosts || []).map(
                    (like) => {
                        return like.PostId;
                    }
                )
            );

        } catch (error) {
            console.log(
                "GET POSTS ERROR:",
                error.response?.data || error.message
            );
        }
    };

    // Get posts when Home loads
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        } else {
            getPosts();
        }
    }, []);

    // Like / Unlike a post
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

            console.log(
                "LIKE RESPONSE:",
                response.data
            );

            if (response.data.error) {
                alert(response.data.error);
                return;
            }

            // Update post likes
            setListOfPosts((prevPosts) =>
                prevPosts.map((post) => {

                    if (post.id !== postId) {
                        return post;
                    }

                    const currentLikes =
                        Array.isArray(post.likes)
                            ? post.likes
                            : [];

                    if (response.data.liked) {

                        return {
                            ...post,
                            likes: [
                                ...currentLikes,
                                response.data,
                            ],
                        };

                    } else {

                        return {
                            ...post,
                            likes:
                                currentLikes.slice(0, -1),
                        };
                    }
                })
            );

            // Update liked posts
            if (likedPosts.includes(postId)) {

                setLikesPosts(
                    likedPosts.filter(
                        (id) => id !== postId
                    )
                );

            } else {

                setLikesPosts([
                    ...likedPosts,
                    postId,
                ]);
            }

        } catch (error) {
            console.log(
                "LIKE ERROR:",
                error.response?.data ||
                    error.message
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

            <div className="max-w-6xl mx-auto px-5 pt-12 pb-8">

                <div className="text-center">

                    

                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        Community{" "}
                        <span className="text-indigo-600">
                            Posts
                        </span>
                    </h1>

                    <p className="text-gray-500 mt-3 text-lg">
                        Read what people are sharing
                        with the community.
                    </p>

                </div>

            </div>


            <div className="max-w-4xl mx-auto px-5 pb-16">

                {listOfPosts.length === 0 ? (

                    

                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">

                        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-5">

                            

                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            No posts yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Be the first person to
                            create a post!
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
                                    className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >

                                    <div className="p-6 sm:p-7">

                                        {/* Category + Username */}

                                        <div className="flex items-center justify-between gap-4 mb-5">

                                            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                COMMUNITY POST
                                            </span>

                                            <Link
                                                to={`/profile/${post.UserId}`}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="text-sm text-gray-500 hover:text-indigo-600 transition"
                                            >
                                                @{post.username}
                                            </Link>

                                        </div>


                                        {/* Title */}

                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition">
                                            {post.title}
                                        </h2>


                                        {/* Post Text */}

                                        <p className="text-gray-600 leading-7 text-base sm:text-lg line-clamp-3">
                                            {post.postText}
                                        </p>


                                        {/* Bottom Section */}

                                        <div className="border-t border-gray-100 mt-6 pt-5">

                                            <div className="flex items-center justify-between">

                                                {/* Author */}

                                                <Link
                                                    to={`/profile/${post.UserId}`}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="flex items-center gap-3 group"
                                                >

                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                        {post.username
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <p className="text-xs text-gray-400">
                                                            Posted by
                                                        </p>

                                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                                                            {post.username}
                                                        </p>

                                                    </div>

                                                </Link>


                                                {/* Like */}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        likeAPost(
                                                            post.id
                                                        );
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition duration-200 ${
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

export default Home;