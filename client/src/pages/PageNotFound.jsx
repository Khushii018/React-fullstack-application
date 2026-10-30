import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">

            <div className="text-center">

                {/* 404 */}
                <h1 className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-3xl font-bold text-gray-900 mt-4">
                    Page Not Found
                </h2>

                <p className="text-gray-500 mt-3 max-w-md mx-auto">
                    Sorry, the page you're looking for doesn't exist or
                    may have been moved.
                </p>

                {/* Home Button */}
                <Link
                    to="/"
                    className="inline-block mt-8 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200"
                >
                    ← Go to Home Page
                </Link>

            </div>

        </div>
    );
}

export default PageNotFound;