import { useEffect, useState } from 'react'
import axiosInstance from '../services/Api.js';

const User = () => {
    const [users, setUsers] = useState([]);
    // const [error, setError] = useState(null);

    useEffect(() => {
        const FetchUsers = async () => {

            try {
                const response = await axiosInstance.get('/users'); // Endpoint API Anda
                setUsers(response.data); // Atur data pengguna
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Failed to fetch data');
                console.log('Error fetching users:', err);
            }
        };

        FetchUsers();
    }, []);

    return (
        <div className="overflow-x-auto m-6 text-black">
            <div className="flex justify-between">
                <h1 className="font-pociono font-bold text-4xl">
                    List User
                </h1>
            </div>

            <div className="py-8 px-20 border border-black font-pociono">
                <table className="table">
                    <thead className="text-lg">
                    <tr className="flex space-x-32">
                        <th>No</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;
