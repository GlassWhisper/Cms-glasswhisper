import React from "react";
import login from "../assets/login-cms.png";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex ">
            <div className="flex flex-col justify-center items-center w-1/2 bg-login px-10">
                <h1 className="text-5xl font-bold mb-14 font-pociono">
                    Login
                </h1>
                <form className="w-2/3">
                    <div className="mb-4">
                        <label className="block text-sm font-normal mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange=""
                            placeholder="Email Address"
                            className="w-full px-4 py-2 border border-black rounded-md bg-transparent placeholder-colorPlaceholder"
                        />
                        <label className="block text-sm font-normal mb-3 mt-8">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange=""
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-black rounded-md bg-transparent placeholder-colorPlaceholder"
                        />
                    </div>

                    {/*garis katulistiwa horizontal*/}
                    <h1 className="w-full border-t-2 border-black mt-20 mb-14"/>

                    <button
                        className="bg-button w-full text-white font-bold text-[18px] py-2 border border-navColor rounded-md ">
                        Sign In
                    </button>

                    <p className="text-center text-sm mt-24 mb-p10">
                        ©2024 Capstone_
                        <a href="https://github.com/GlassWhisper" className="text-button">
                            Glasswhisper
                        </a>
                    </p>
                </form>

            </div>

            <div className="flex w-1/2 bg-bg-register items-center px-32 justify-centerborder border-black">
                <img src={login} alt="About" className="w-[750px] object-cover"/>
            </div>
        </div>
    );
};

export default LoginPage;
