import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditArticle = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getArticleById = async () => {
      try {
        const response = await axios.get(
          `https://backend-rust-rho.vercel.app/api/article/${id}`
        );
        setImage(response.data.image);
        setTitle(response.data.title);
        setDescription(response.data.deskripsi);
      } catch (error) {
        console.error("Error fetching article:", error);
        alert("Failed to fetch article data.");
      }
    };

    getArticleById();
  }, [id]);

  const updateArticle = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `https://backend-rust-rho.vercel.app/api/article/${id}`,
        {
          image,
          title,
          deskripsi: description,
        }
      );
      alert("Article updated successfully!");
      navigate("/article");
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Failed to update article. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <form onSubmit={updateArticle} className="my-10">
        <div className="flex flex-col">
          <div className="mb-5">
            <label className="font-bold text-slate-700">Image URL</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Title</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Description</label>
            <textarea
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
