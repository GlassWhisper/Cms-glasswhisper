import React from "react";
import logo from "../assets/logo.png";
import dashboard from "../assets/dashboard.png";
import article from "../assets/article.png";
import profil from "../assets/profil.png";
import user from "../assets/user.png";
import setting from "../assets/setting.png";
import logout from "../assets/logout.png";
import {Link, useNavigate} from "react-router-dom";
import {IoIosLogOut} from "react-icons/io";


const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks

        // Example: Clear user session data or authentication token
        localStorage.removeItem("authToken");
        // Redirect to the login page after logout
        navigate("/login");
    };

    return (
        <div className="w-80 min-h-screen text-white p-5 bg-navColor">
            <div className="flex items-center justify-center">
                <img className="inline w-7" src={logo} alt="logo"/>
                <h1 className="font-pociono text-black text-4xl ml-4">
                    GlassWhisper
                </h1>
            </div>

            {/*garis katulistiwa horizontal*/}
            <h1 className="w-full border-t border-black mt-7"/>

            {/*mb-6 mx-14 w-56 px-8 py-3*/}
            {/*navigasi*/}
            <nav className="mt-16 text-black">
                <ul>
                    <li className="mb-12 mx-7 px-8 py-5 rounded-full bg-footer placeholder-colorPlaceholder hover:bg-amber-800">
                        <Link to="/" className="flex items-start justify-items-start">
                            <img src={dashboard} alt="icon dashboard" className="inline w-5"/>
                            <h1 className="ml-3">
                                Dashboard
                            </h1>
                        </Link>
                    </li>

                    <li className="mb-12 mx-7 px-8 py-5 rounded-full bg-footer placeholder-colorPlaceholder hover:bg-amber-800">
                        <Link to="/article" className="flex items-start justify-items-start">
                            <img src={article} alt="icon article" className="inline w-5"/>
                            <h1 className="ml-3">
                                Article
                            </h1>
                        </Link>
                    </li>

                    <li className="mb-12 mx-7 px-8 py-5 rounded-full bg-footer placeholder-colorPlaceholder hover:bg-amber-800">
                        <Link to="/user" className="flex items-start justify-items-start">
                            <img src={user} alt="icon user" className="inline w-5"/>
                            <h1 className="ml-3">
                                User
                            </h1>
                        </Link>
                    </li>

                    <footer className="flex text-center bottom-0 absolute">
                        <li className="mb-6 mx-11 w-48 px-8 py-3 rounded-full bg-button placeholder-colorPlaceholder hover:bg-font">
                            <button onClick={handleLogout} className="flex items-start justify-items-center">
                                <img src={logout} alt="icon logout" className="inline w-5"/>
                                <h1 className="ml-3">
                                    Log Out
                                </h1>
                            </button>
                        </li>
                    </footer>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
