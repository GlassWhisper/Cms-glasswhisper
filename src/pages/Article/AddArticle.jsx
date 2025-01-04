import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddArticle = () => {
  const [image, setImage] = useState(null); // File gambar
  const [title, setTitle] = useState(""); // Judul artikel
  const [deskripsi, setDeskripsi] = useState(""); // Deskripsi artikel
  const [isLoading, setIsLoading] = useState(false); // Status loading
  const navigate = useNavigate();

  // Fungsi untuk menangani perubahan file gambar
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Menyimpan file gambar yang dipilih
  };

  // Fungsi untuk mengirimkan data artikel ke backend
  const saveArticle = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image); // Menambahkan file gambar ke FormData
    formData.append("title", title); // Menambahkan judul ke FormData
    formData.append("deskripsi", deskripsi); // Menambahkan deskripsi ke FormData

    setIsLoading(true); // Mengaktifkan animasi loading
    try {
      const response = await axios.post("https://backend-rust-rho.vercel.app/api/article", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Header untuk FormData
        },
      });
      console.log("Response:", response.data);
      navigate("/article"); // Redirect setelah berhasil
    } catch (error) {
      console.error("Error saving article:", error.response?.data || error.message);
    } finally {
      setIsLoading(false); // Menonaktifkan animasi loading
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <form onSubmit={saveArticle} className="my-10">
        <div className="flex flex-col">
          <div className="mb-5">
            <label className="font-bold text-slate-700">Image</label>
            <input
              type="file"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              onChange={handleImageChange}
            />
            {image && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">Selected file: {image.name}</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Title</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Memperbarui state judul
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Deskripsi</label>
            <textarea
              className="w-full py-3 mt-1 border text-black border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)} // Memperbarui state deskripsi
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 font-bold text-white ${
              isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-500"
            } rounded-lg border-indigo-500 hover:shadow`}
            disabled={isLoading} // Nonaktifkan tombol saat loading
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          {isLoading && (
            <div className="flex justify-center mt-5">
              <div className="w-6 h-6 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddArticle;
