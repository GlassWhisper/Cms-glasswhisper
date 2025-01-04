import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { Link } from "react-router-dom";

const Article = () => {
  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await axios.get("https://backend-rust-rho.vercel.app/api/article");
    return response.data; // Mengembalikan seluruh response API
  };

  const { data } = useSWR("article", fetcher);

  if (!data) return <h2>Loading...</h2>;

  // Validasi jika 'data' tidak memiliki properti 'data' atau array kosong
  if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
    return <h2>No Articles Found</h2>;
  }

  const deleteArticle = async (articleId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    if (!confirmDelete) return; // Jika pengguna membatalkan, hentikan proses

    try {
      await axios.delete(`https://backend-rust-rho.vercel.app/api/article/${articleId}`);
      alert("Article deleted successfully.");
      mutate("article");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete the article. Please try again.");
    }
  };

  return (
    <div className="flex flex-col mt-5">
      <div className="w-full">
        <Link
          to="/article/add"
          className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add New
        </Link>
        <div className="relative shadow rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-1 text-center">No</th>
                <th className="py-3 px-6">Image</th>
                <th className="py-3 px-6">Title</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-1 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((article, index) => (
                <tr className="bg-white border-b" key={article.id}>
                  <td className="py-3 px-1 text-center">{index + 1}</td>
                  <td className="py-3 px-6">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">{article.title}</td>
                  <td className="py-3 px-6">{article.deskripsi}</td>
                  <td className="py-3 px-1 text-center">
                    <Link
                      to={`article/edit/${article.id}`}
                      className="font-medium bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-white mr-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="font-medium bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Article;
