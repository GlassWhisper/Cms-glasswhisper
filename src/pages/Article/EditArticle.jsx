import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditArticle = () => {
  const [ formData, setFormData] = useState({
    image: null, // File untuk gambar
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch article data untuk preload
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `https://backend-rust-rho.vercel.app/api/article/${id}`
        );
        setFormData({
          image: null, // Tidak preload file, user harus upload ulang
          title: response.data.title || "",
          description: response.data.description || "", // Perbaiki penamaan key
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        alert("Failed to fetch article data.");
      }
    };

    fetchArticle();
  }, [id]);

  // Handler untuk input file
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handler untuk input teks
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      if (formData.image) {
        formDataToSend.append("image", formData.image); // Pastikan file ada dan ditambahkan
      }
      formDataToSend.append("title", formData.title);
      formDataToSend.append("deskripsi", formData.description);
  
      await axios.patch(
        `https://backend-rust-rho.vercel.app/api/article/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
      <form onSubmit={handleSubmit} className="my-10" encType="multipart/form-data">
        <div className="flex flex-col">
          <div className="mb-5">
            <label className="font-bold text-slate-700">Upload Image</label>
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
              required
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Description</label>
            <textarea
              name="description"
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
