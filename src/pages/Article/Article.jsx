import useSWR from "swr";
import axios from "axios";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../services/Api";

const Article = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const articlesPerPage = 5; // Jumlah artikel per halaman

  const fetcher = async () => {
    const response = await axiosInstance.get("article");
    return response.data;
  };

  const { data, mutate } = useSWR("article", fetcher);

  // Menghitung artikel yang akan ditampilkan pada halaman saat ini
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = data?.data.slice(indexOfFirstArticle, indexOfLastArticle);

  const initiateDelete = (articleId) => {
    setArticleToDelete(articleId);
    setShowDeleteDialog(true);
  };

  const deleteArticle = async () => {
    try {
      await axios.delete(
        `https://backend-rust-rho.vercel.app/api/article/${articleToDelete}`
      );
      setShowDeleteDialog(false);
      setNotification({
        show: true,
        message: "Article deleted successfully",
        type: "success",
      });
      mutate();

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to delete the article",
        type: "error",
      });
    }
  };

  // Loading state
  if (!data) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading articles...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            No Articles Found
          </h2>
          <Link
            to="/article/add"
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Create Your First Article
          </Link>
        </div>
      </div>
    );
  }

  // Menghitung total halaman
  const totalPages = Math.ceil(data.data.length / articlesPerPage);

  return (
    <Toast.Provider swipeDirection="right">
      <div className="container mx-auto px-16 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 relative">
            <span className="relative inline-block">
              Articles
              <div className="absolute bottom-0 left-0 w-full h-1 bg-button transform origin-left"></div>
            </span>
          </h1>
          <Link
            to="/article/add"
            className="bg-button hover:bg-buttonSide text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:shadow-lg inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add New Article</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-navColor text-white">
                  <th className="py-4 px-6 text-left font-medium">No</th>
                  <th className="py-4 px-6 text-left font-medium">Image</th>
                  <th className="py-4 px-6 text-left font-medium">Title</th>
                  <th className="py-4 px-6 text-left font-medium">Description</th>
                  <th className="py-4 px-6 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-colorAbout">
                <AnimatePresence mode="popLayout">
                  {currentArticles?.map((article, index) => (
                    <motion.tr
                      key={article.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ 
                        opacity: 0,
                        y: -20,
                        transition: { duration: 0.2 }
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut"
                      }}
                    >
                      <td className="py-4 px-6 text-gray-800 font-medium">
                        {index + 1 + (currentPage - 1) * articlesPerPage}
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden ring-2 ring-gray-100">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <h3 className="font-medium text-gray-800 mb-1">
                          {article.title}
                        </h3>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-600 line-clamp-2">
                          {article.deskripsi}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/article/edit/${article.id}`}
                            className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => initiateDelete(article.id)}
                            className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-400"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="mx-4 text-lg text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-400"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl w-[400px] data-[state=open]:animate-contentShow">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Delete Article
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-6">
                Are you sure you want to delete this article? This action cannot
                be undone.
              </Dialog.Description>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteArticle}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Notification Toast */}
        {notification.show && (
          <Toast.Root
            className={`fixed top-4 right-4 z-50 rounded-lg p-4 shadow-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } animate-slideIn`}
          >
            <Toast.Title>
              {notification.type === "success" ? "Success" : "Error"}
            </Toast.Title>
            <Toast.Description>{notification.message}</Toast.Description>
          </Toast.Root>
        )}
      </div>
    </Toast.Provider>
  );
};

export default Article;
