import React from "react";
import logo from "../assets/logo.png";
import dashboard from "../assets/dashboard.png";
import article from "../assets/article.png";
import profil from "../assets/profil.png";
import user from "../assets/user.png";
import setting from "../assets/setting.png";
import logout from "../assets/logout.png";

const Sidebar = () => {
    return (
        <div className="w-96 h-[966px] text-white p-5 bg-navColor">
            <div className="flex items-center justify-center">
                <img className="inline w-7" src={logo} alt="logo"/>
                <h1 className="font-pociono text-black text-4xl ml-4">
                    GlassWhisper
                </h1>
            </div>

            {/*garis katulistiwa horizontal*/}
            <h1 className="w-full border-t border-black mt-7"/>

            {/*navigasi*/}
            <nav className="mt-16 text-black">
                <ul>
                    <li className="mb-8 mx-3 w-80 px-8 py-3 rounded-full bg-footer placeholder-colorPlaceholder">
                        <div className="flex items-start justify-items-start">
                            <img src={dashboard} alt="icon dashboard" className="inline w-5"/>
                            <h1 className="ml-3">
                                Dashboard
                            </h1>
                        </div>
                    </li>
                    <li className="mb-8 mx-3 w-80 px-8 py-3 rounded-full bg-footer placeholder-colorPlaceholder">
                        <div className="flex items-start justify-items-start">
                            <img src={article} alt="icon article" className="inline w-5"/>
                            <h1 className="ml-3">
                                Article
                            </h1>
                        </div>
                    </li>
                    <li className="mb-8 mx-3 w-80 px-8 py-3 rounded-full bg-footer placeholder-colorPlaceholder">
                        <div className="flex items-start justify-items-start">
                            <img src={profil} alt="icon profil" className="inline w-5"/>
                            <h1 className="ml-3">
                                Profile
                            </h1>
                        </div>
                    </li>
                    <li className="mb-8 mx-3 w-80 px-8 py-3 rounded-full bg-footer placeholder-colorPlaceholder">
                        <div className="flex items-start justify-items-start">
                            <img src={user} alt="icon user" className="inline w-5"/>
                            <h1 className="ml-3">
                                User
                            </h1>
                        </div>
                    </li>
                    <li className="mb-8 mx-3 w-80 px-8 py-3 rounded-full bg-footer placeholder-colorPlaceholder">
                        <div className="flex items-start justify-items-start">
                            <img src={setting} alt="icon setting" className="inline w-5"/>
                            <h1 className="ml-3">
                                Setting
                            </h1>
                        </div>
                    </li>
                    <li className="mb-6 mt-[350px] mx-14 w-56 px-8 py-3 rounded-full bg-button placeholder-colorPlaceholder">
                        <button className="flex items-start justify-items-center">
                            <img src={logout} alt="icon logout" className="inline w-5"/>
                            <h1 className="ml-3">
                                Setting
                            </h1>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
