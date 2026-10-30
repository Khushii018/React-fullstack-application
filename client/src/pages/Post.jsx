import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
    const { id } = useParams();

    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:3001/posts/byId/${id}`)
            .then((response) => {
                setPostObject(response.data);
            })
            .catch((error) => {
                console.log("POST ERROR:", error);
            });

        axios
            .get(`http://localhost:3001/comments/${id}`)
            .then((response) => {
                setComments(response.data);
            })
            .catch((error) => {
                console.log("COMMENTS ERROR:", error);
            });
    }, [id]);

    // Add Comment
    const addComment = () => {
        if (!newComment.trim()) {
            alert("Please write a comment");
            return;
        }

        axios
            .post(
                "http://localhost:3001/comments",
                {
                    commentBody: newComment,
                    PostId: id,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    const commentToAdd = {
                        commentBody: newComment,
                        username: response.data.username,
                        id: response.data.id,
                    };

                    setComments([...comments, commentToAdd]);
                    setNewComment("");
                }
            })
            .catch((error) => {
                console.log("ADD COMMENT ERROR:", error);
            });
    };

    // Delete Comment
    const deleteComment = (commentId) => {
        axios
            .delete(`http://localhost:3001/comments/${commentId}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then(() => {
                setComments(
                    comments.filter((value) => {
                        return value.id !== commentId;
                    })
                );
            })
            .catch((error) => {
                console.log("DELETE COMMENT ERROR:", error);
            });
    };

    // Delete Post
    const deletePost = (postId) => {
        axios
            .delete(`http://localhost:3001/posts/${postId}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then(() => {
                alert("Post deleted successfully");
                navigate("/");
            })
            .catch((error) => {
                console.log("DELETE POST ERROR:", error);
            });
    };

    // Edit Post
    const editPost = (option) => {
        if (option === "title") {
            const newTitle = prompt("Enter new title");

            if (!newTitle || !newTitle.trim()) {
                return;
            }

            axios.put(
                "http://localhost:3001/posts/title",
                {
                    newTitle: newTitle,
                    id: id,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            );

            setPostObject({
                ...postObject,
                title: newTitle,
            });
        } else {
            const newPostText = prompt("Enter new text:");

            if (!newPostText || !newPostText.trim()) {
                return;
            }

            axios.put(
                "http://localhost:3001/posts/postText",
                {
                    newText: newPostText,
                    id: id,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            );

            setPostObject({
                ...postObject,
                postText: newPostText,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4 sm:px-6 lg:px-8">

            {/* Main Container */}
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition"
                >
                    ← Back to Posts
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/*POST SECTION */}
                    <div className="lg:col-span-2">

                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                            {/* Post Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-7">

                                <div className="flex items-center justify-between gap-4">

                                    <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                                        Community Post
                                    </span>

                                    {authState.username === postObject.username && (
                                        <span className="text-white/80 text-sm">
                                            Your Post
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* Post Content */}
                            <div className="p-8">

                                {/* Title */}
                                <div
                                    onClick={() => {
                                        if (
                                            authState.username ===
                                            postObject.username
                                        ) {
                                            editPost("title");
                                        }
                                    }}
                                    className={
                                        authState.username ===
                                        postObject.username
                                            ? "cursor-pointer group"
                                            : ""
                                    }
                                >
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight group-hover:text-indigo-600 transition">
                                        {postObject.title}
                                    </h1>

                                    {authState.username ===
                                        postObject.username && (
                                        <p className="text-xs text-gray-400 mt-2">
                                            Click the title to edit
                                        </p>
                                    )}
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-3 mt-6 pb-6 border-b border-gray-200">

                                    <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                        {postObject.username
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Posted by
                                        </p>

                                        <p className="font-semibold text-gray-800">
                                            {postObject.username}
                                        </p>
                                    </div>

                                </div>

                                {/* Post Body */}
                                <div
                                    onClick={() => {
                                        if (
                                            authState.username ===
                                            postObject.username
                                        ) {
                                            editPost("body");
                                        }
                                    }}
                                    className={
                                        authState.username ===
                                        postObject.username
                                            ? "cursor-pointer group mt-7"
                                            : "mt-7"
                                    }
                                >
                                    <p className="text-gray-700 text-lg leading-8 whitespace-pre-wrap">
                                        {postObject.postText}
                                    </p>

                                    {authState.username ===
                                        postObject.username && (
                                        <p className="text-xs text-gray-400 mt-3">
                                            Click the text to edit
                                        </p>
                                    )}
                                </div>

                                {/* Post Actions */}
                                {authState.username ===
                                    postObject.username && (
                                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">

                                        <button
                                            onClick={() =>
                                                deletePost(postObject.id)
                                            }
                                            className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold hover:bg-red-600 hover:text-white transition duration-200"
                                        >
                                            Delete Post
                                        </button>

                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/*COMMENTS SECTION */}
                    <div className="lg:col-span-1">

                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-6">

                            {/* Comments Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">

                                <div className="flex items-center justify-between">

                                    <h2 className="text-xl font-bold text-white">
                                        Comments
                                    </h2>

                                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                                        {comments.length}
                                    </span>

                                </div>

                            </div>

                            <div className="p-6">

                                {/* Add Comment */}
                                <div>

                                    <textarea
                                        value={newComment}
                                        onChange={(e) =>
                                            setNewComment(e.target.value)
                                        }
                                        rows="4"
                                        placeholder="Write a comment..."
                                        className="w-full border border-gray-200 rounded-2xl p-4 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />

                                    <button
                                        onClick={addComment}
                                        className="w-full mt-3 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition duration-200 shadow-md"
                                    >
                                        Add Comment
                                    </button>

                                </div>

                                {/* Comments List */}
                                <div className="mt-7 space-y-4">

                                    {comments.length === 0 ? (
                                        <div className="text-center py-8">

                                            <div className="text-4xl mb-3">
                                                💬
                                            </div>

                                            <p className="text-gray-500 font-medium">
                                                No comments yet
                                            </p>

                                            <p className="text-sm text-gray-400 mt-1">
                                                Be the first to comment!
                                            </p>

                                        </div>
                                    ) : (
                                        comments.map((comment, key) => (
                                            <div
                                                key={comment.id || key}
                                                className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:shadow-sm transition"
                                            >

                                                {/* Comment User */}
                                                <div className="flex items-center justify-between mb-3">

                                                    <div className="flex items-center gap-2">

                                                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                            {comment.username
                                                                ?.charAt(0)
                                                                ?.toUpperCase()}
                                                        </div>

                                                        <span className="font-semibold text-gray-800 text-sm">
                                                            {comment.username}
                                                        </span>

                                                    </div>

                                                    {authState.username ===
                                                        comment.username && (
                                                        <button
                                                            onClick={() =>
                                                                deleteComment(
                                                                    comment.id
                                                                )
                                                            }
                                                            className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}

                                                </div>

                                                {/* Comment Text */}
                                                <p className="text-gray-700 text-sm leading-6 break-words">
                                                    {comment.commentBody}
                                                </p>

                                            </div>
                                        ))
                                    )}

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Post;