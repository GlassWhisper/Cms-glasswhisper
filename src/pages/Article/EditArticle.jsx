import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditArticle = () => {
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    deskripsi: "",
  });
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          `https://backend-rust-rho.vercel.app/api/article/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        // Check if response.data contains the article data directly or in a nested structure
        const articleData = response.data.data || response.data;
        console.log("Article Data:", articleData);

        setFormData({
          image: null,
          title: articleData.title || "",
          deskripsi: articleData.deskripsi || "",
        });
        setCurrentImage(articleData.image || ""); // Changed from imageUrl to image
      } catch (error) {
        console.error("Error fetching article:", error);
        if (error.response?.status === 401) {
          alert("Unauthorized access. Please login again.");
          navigate('/login');
        } else {
          alert("Failed to fetch article data.");
        }
      }
    };
    
    fetchArticle();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const formDataToSend = new FormData();
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      formDataToSend.append("title", formData.title);
      formDataToSend.append("deskripsi", formData.deskripsi);

      await axios.patch(
        `https://backend-rust-rho.vercel.app/api/article/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      alert("Article updated successfully!");
      navigate("/article");
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Failed to update article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <h1 className="text-2xl font-bold text-slate-700 mb-6">Edit Article</h1>
      <form onSubmit={handleSubmit} className="my-10" encType="multipart/form-data">
        <div className="flex flex-col">
          {currentImage && (
            <div className="mb-5">
              <label className="font-bold text-slate-700 block mb-2">Current Image</label>
              <img 
                src={currentImage} 
                alt="Current article" 
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            </div>
          )}
          <div className="mb-5">
            <label className="font-bold text-slate-700">Upload New Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Title</label>
            <input
              type="text"
              name="title"
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Description</label>
            <textarea
              name="deskripsi"
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Description"
              value={formData.deskripsi}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Article"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;