import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/Api.js"; // Pastikan path ini sesuai dengan file axiosInstance Anda
import login from "../assets/login-cms.png";

function Login() {
    const emailRef = useRef();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/login", {
                email: email,
                password: password,
            });

            const { access_token, data } = response.data;

            if (access_token) {
                localStorage.setItem("authToken", access_token);
                localStorage.setItem("role", data.role);
                console.log("Token disimpan:", localStorage.getItem("authToken"));
                setSuccess(true);
                setErrMsg("");
                navigate("/"); // Redirect ke halaman utama
            } else {
                setErrMsg("Login gagal, token tidak diterima.");
                setSuccess(false);
            }
        } catch (error) {
            setErrMsg(error.response?.data?.message || "Login gagal. Coba lagi.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="flex flex-col justify-center items-center w-1/2 bg-login px-10">
                <h1 className="text-5xl font-bold mb-14 font-pociono">Login</h1>

                <form className="w-2/3" onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-normal mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            ref={emailRef}
                            autoComplete="on"
                            placeholder="Email Address"
                            className="w-full px-4 py-2 border border-black rounded-md bg-transparent placeholder-colorPlaceholder"
                        />

                        <label className="block text-sm font-normal mb-3 mt-8">Password</label>
                        <div className="relative">
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                                placeholder="Password"
                                className="w-full px-4 py-2 border border-black rounded-md bg-transparent placeholder-colorPlaceholder"
                            />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible((prev) => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600 focus:outline-none"
                            >
                                {isPasswordVisible ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* garis katulistiwa horizontal */}
                    <h1 className="w-full border-t-2 border-black mt-20 mb-14" />

                    <button
                        className="bg-button w-full text-white font-bold text-[18px] py-2 border border-navColor rounded-md"
                    >
                        {loading ? (
                            <img className="h-10 w-10" src="/gif/spin.gif" alt="loading" />
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <p className="text-center text-sm mt-24 mb-p10">
                        ©2024 Capstone_
                        <a href="https://github.com/GlassWhisper" className="text-button">
                            Glasswhisper
                        </a>
                    </p>
                </form>
            </div>

            {/* foto ges */}
            <div className="flex w-1/2 bg-bg-register items-center px-32 justify-center border border-black">
                <img src={login} alt="About" className="w-[750px] object-cover" />
            </div>
        </div>
    );
}

export default Login;
