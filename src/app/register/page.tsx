"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TbEyeClosed } from "react-icons/tb";
import { FaEye, FaSpinner } from "react-icons/fa";
import { useUser } from "@/Context/userContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUserId } = useUser();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://alukas-back.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, confirmPassword }),
          credentials: "include",
        }
      );
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        const { userId, token } = data;
        console.log("Registration successful", data);
        console.log("Response headers:", response.headers);

        // Set the auth token as a cookie
        document.cookie = `auth_token=${token}; path=/`;

        setUserId(userId);
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        alert(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-[500px] flex flex-col items-center rounded-md shadow-md">
        <h2 className="text-2xl font-medium pt-[30px] text-gray-900 text-center">
          Create Account
        </h2>
        <form
          onSubmit={handleSubmit}
          className="w-full pt-[46px] pb-[54px] px-[54px] bg-white"
        >
          <div className="mb-[30px]">
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Your username*"
              onChange={(e) => setUsername(e.target.value)}
              className="block text-[16px] w-full px-[20px] py-[10px] border border-gray-300 placeholder-[#555555] focus:outline-none focus:ring-0 focus:border-black transition-colors duration-300 ease-in-out"
              required
            />
          </div>
          <div className="mb-[30px]">
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Your email*"
              onChange={(e) => setEmail(e.target.value)}
              className="block text-[16px] w-full px-[20px] py-[10px] border border-gray-300 placeholder-[#555555] focus:outline-none focus:ring-0 focus:border-black transition-colors duration-300 ease-in-out"
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
          <div className="mb-[30px] relative">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm Password*"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            className={`w-full py-[10px] px-[45px] bg-[#222222] text-[18px] text-white focus:outline-none transition-colors duration-300 ease-in-out hover:bg-black hover:text-white flex items-center justify-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full mt-[20px] py-[10px] px-[45px] border-solid border-[1px] border-black text-[18px] focus:outline-none transition-colors duration-300 ease-in-out hover:bg-gray-100"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
