import React ,{useContext,useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useState } from "react";

function CreatePost() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

    const initialValues={
        title:"",
        postText:"",
        // username:""
    };

    useEffect(()=>{
      if(!localStorage.getItem("accessToken")){
        navigate('/login');
      }
    })

    const validationSchema=Yup.object().shape({
        title: Yup.string().required("You must input a Title"),
        postText: Yup.string().required(),
        // username: Yup.string().min(3).max(15).required(),
    });


    
    const onSubmit = (data) => {
  axios
    .post(
      "http://localhost:3001/posts",
      data,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      navigate("/");
    })
    .catch((error) => {
      console.log(
        "Create post error:",
        error.response?.data || error.message
      );
    });
};
    

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">
            Create Post
          </h1>
          <p className="text-gray-500 mt-2">
            Share your thoughts with the community
          </p>
        </div>


        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          
        >
          <Form className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <ErrorMessage name="title" component="span"/>

              <Field
                name="title"
      
                placeholder="Enter post title..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />

              
            </div>


            {/* Post */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Post
              </label>
                            <ErrorMessage name="post" component="span"/>


              <Field
                as="textarea"
                name="postText"
                rows="5"
                placeholder="Write something amazing..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />

              
            </div>


           
              
          


            {/* Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 active:scale-95 transition duration-200 shadow-lg"
            >
               Create Post
            </button>

          </Form>
        </Formik>

      </div>
    </div>
  );
}

export default CreatePost;