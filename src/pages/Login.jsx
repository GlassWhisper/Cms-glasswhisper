import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../services/Api.js'; // Pastikan path ini sesuai dengan file axiosInstance Anda

function Login() {
    const emailRef = useRef(); // Ganti nama userRef menjadi emailRef
    const navigate = useNavigate(); // Hook untuk navigasi
    const [email, setEmail] = useState(''); // Ganti user menjadi email
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        emailRef.current.focus(); // Fokuskan ke input email saat pertama kali render
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post('/auth/login', {
                email: email,
                password: password
            });

            const { access_token, data } = response.data;  // Ambil data dan token

            if (access_token) {
                localStorage.setItem('authToken', access_token);  // Simpan token
                localStorage.setItem('role', data.role);  // Simpan role
                // console.log("Token disimpan:", localStorage.getItem('authToken'));


                setSuccess(true);
                setErrMsg('');
                navigate('/');  // Redirect ke halaman utama
            } else {
                setErrMsg('Login gagal, token tidak diterima.');
                setSuccess(false);
            }
        } catch (error) {
            setErrMsg(error.response?.data?.message || 'Login gagal. Coba lagi.');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex w-1/2 bg-cover bg-center items-center justify-center">
                <img className="h-[800px]" src="/image/mockup.png" alt="" />
            </div>
            <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 lg:p-16 bg-second_bg">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
                    <img className="h-12 w-12" src="/image/logo.png" alt="Green Vision" />
                </div>
                <p className="text-gray-600 mb-6">Login to your cms account</p>

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            ref={emailRef}
                            autoComplete="on"
                            className="input input-bordered w-full mt-1"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input input-bordered w-full mt-1"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button className="btn btn-primary w-full mt-4"> {loading ?
                        <img className="h-10 w-10" src="/gif/spin.gif" alt="loading" />
                        : "Login"
                    }</button>

                </form>
            </div>
        </div>


    );
}

export default Login;
