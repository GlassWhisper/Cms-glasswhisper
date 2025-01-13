import { useEffect, useState } from "react";
import axiosInstance from "../../services/Api.js";
import * as Dialog from '@radix-ui/react-dialog';
import * as Toast from '@radix-ui/react-toast';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const User = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("users");
      setUsers(response.data.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const initiateDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setUsers(users.filter(user => user.id !== userToDelete));
      setShowDeleteDialog(false);
      setNotification({
        show: true,
        message: response.data.message || "User deleted successfully!",
        type: "success"
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (err) {
      setNotification({
        show: true,
        message: err.response ? err.response.data.message : "Failed to delete user",
        type: "error"
      });
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="overflow-x-auto p-8 text-black bg-gray-50 min-h-screen">
        {/* Delete Confirmation Dialog */}
        <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 shadow-2xl w-96 data-[state=open]:animate-contentShow">
              <Dialog.Title className="text-2xl font-bold mb-4 text-gray-800">
                Confirm Deletion
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-8 text-base">
                Are you sure you want to delete this user? This action cannot be undone.
              </Dialog.Description>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-medium 
                  hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/30"
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
            className={`fixed top-4 right-4 z-50 rounded-xl p-4 shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-50 border border-green-100 shadow-green-500/20' 
                : 'bg-red-50 border border-red-100 shadow-red-500/20'
            } animate-slideIn backdrop-blur-sm`}
          >
            <Toast.Title className={`font-semibold ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.type === 'success' ? 'Success' : 'Error'}
            </Toast.Title>
            <Toast.Description className={
              notification.type === 'success' ? 'text-green-600' : 'text-red-600'
            }>
              {notification.message}
            </Toast.Description>
          </Toast.Root>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-bold text-4xl text-gray-800 relative group">
              <span className="relative inline-block">
                List User
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </h1>
          </div>

          <div className="rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg m-4">
                <p className="text-red-700">{error}</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-xl">No users found.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-left font-semibold text-gray-600">No</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600">Username</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600">Email</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600">Role</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user, index) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors duration-200 group"
                        >
                          <td className="px-6 py-4 text-center text-gray-600">{startIndex + index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center 
                                group-hover:scale-110 transition-transform duration-200">
                                <span className="text-blue-600 font-semibold text-lg">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-gray-700">{user.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600
                              ring-1 ring-blue-100">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => initiateDelete(user.id)}
                              className="p-2 rounded-xl bg-red-50 text-red-500 
                              hover:bg-red-100 transition-all duration-200 group/delete"
                            >
                              <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-200" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to{" "}
                    <span className="font-medium text-gray-900">{Math.min(endIndex, users.length)}</span> of{" "}
                    <span className="font-medium text-gray-900">{users.length}</span> users
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentPage === 1
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      } border border-gray-200`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3.5 py-2 rounded-lg font-medium transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      } border border-gray-200`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Toast.Provider>
  );
};

export default User;