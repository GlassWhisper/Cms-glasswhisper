import { useEffect, useState } from "react";
import axiosInstance from "../../services/Api.js";
import * as Dialog from '@radix-ui/react-dialog';
import * as Toast from '@radix-ui/react-toast';

const User = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

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

  return (
    <Toast.Provider swipeDirection="right">
      <div className="overflow-x-auto m-6 text-black">
        {/* Delete Confirmation Dialog */}
        <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl w-[400px] data-[state=open]:animate-contentShow">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Confirm Deletion
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </Dialog.Description>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
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
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            } animate-slideIn`}
          >
            <Toast.Title>{notification.type === 'success' ? 'Success' : 'Error'}</Toast.Title>
            <Toast.Description>{notification.message}</Toast.Description>
          </Toast.Root>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bold text-4xl text-gray-800 relative">
            <span className="relative inline-block after:content-[''] after:absolute after:w-full after:h-1 after:bg-button after:bottom-0 after:left-0 after:transform after:translate-y-2">
              List User
            </span>
          </h1>
        </div>

        <div className="rounded-lg bg-colorService shadow-2xl p-8 border border-gray-200 transform perspective-1000">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-xl">No users found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-navColor text-white">
                    <th className="px-6 py-4 text-left font-semibold">No</th>
                    <th className="px-6 py-4 text-left font-semibold">Username</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-colorService transition-colors duration-200 ease-in-out border-b border-gray-200 last:border-b-0"
                    >
                      <td className="px-6 py-4 text-center">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => initiateDelete(user.id)}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium 
                          transform transition-all duration-200 
                          hover:bg-red-600 hover:shadow-lg 
                          active:bg-red-700 active:scale-95 
                          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Toast.Provider>
  );
};

export default User;