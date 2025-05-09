"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TbEyeClosed } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

import React from "react";
import { useUser } from "@/Context/userContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserId } = useUser();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://alukas-back.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { userId, token } = data;
        console.log("Full response data:", data);
        console.log("Response headers:", response.headers);
        console.log(userId, "User id from response");

        // Set the auth token as a cookie
        document.cookie = `auth_token=${token}; path=/`;

        setUserId(userId);
        router.push("/");
      } else {
        console.error("Login failed:", response.statusText);
        alert("Login failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-[500px] flex flex-col items-center rounded-md shadow-md">
        <h2 className="text-2xl font-medium pt-[30px] text-gray-900 text-center">
          Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="w-full pt-[46px] pb-[20px] px-[54px] bg-white"
        >
          <div className="mb-[30px]">
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Your username*"
              onChange={(e) => setUsername(e.target.value)}
              className="block text-[16px] w-full px-[20px] py-[10px] border border-gray-300 placeholder-[#555555]  focus:outline-none focus:ring-0 focus:border-black transition-colors duration-300 ease-in-out"
              required
            />
          </div>
          <div className="mb-[30px] relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              placeholder="Password*"
              onChange={(e) => setPassword(e.target.value)}
              className="block text-[16px] w-full px-[20px] py-[10px] border placeholder-[#555555] border-gray-300 focus:outline-none focus:ring-0 focus:border-black transition-colors duration-300 ease-in-out"
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute pr-[10px] right-[10px] top-[50%] transform -translate-y-[50%] cursor-pointer"
            >
              {showPassword ? <FaEye /> : <TbEyeClosed />}
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-[10px] px-[45px] bg-[#222222] text-[18px] text-white focus:outline-none transition-colors duration-300 ease-in-out flex items-center justify-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex flex-col gap-[20px] w-full px-[54px] pb-[50px]">
          <button
            type="button"
            onClick={handleCreateAccount}
            className="w-full py-[10px] px-[45px] border-solid border-[1px] border-black text-[18px] transition-colors duration-300 ease-in-out focus:outline-none hover:bg-[#222222] hover:text-white"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
