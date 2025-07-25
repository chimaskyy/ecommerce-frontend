import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEnvelope } from "react-icons/fa6";
import { HiOutlineLockClosed } from "react-icons/hi";
import { IoInformationCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import HoralLogo from "../../assets/logos/horal-logo-black.png";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";
import { loginUser } from "../../redux/auth/authSlice/userSlice";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="w-full max-w-[597.5px] mx-auto rounded-lg md:pt-8 pt-0">
      <Link to="/" className="block mb-6">
        <img src={HoralLogo} alt="Horal Logo" className="h-10" />
      </Link>
      <h1 className="text-2xl font-bold text-neutral-900 text-center mb-2">
        Welcome Back!
      </h1>
      <p className="text-base text-zinc-700 text-center mb-6">
        Log in to access your account, manage orders, and shop with confidence.
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit}>
        {/* Email Input */}
        <div className="mb-5">
          <label className="flex items-center gap-1 text-sm font-bold text-neutral-900 mb-2">
            Email Address
            <span className="text-error">*</span>
            <IoInformationCircle className="text-gray-400 text-xl" />
          </label>
          <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded">
            <div className="w-14 h-14 flex justify-center items-center border-r border-gray-200">
              <FaRegEnvelope className="text-primary text-xl" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. adebisistanley@gmail.com"
              required
              className="flex-1 h-14 px-4 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-5">
          <label className="flex items-center gap-1 text-sm font-bold text-neutral-900 mb-2">
            Password
            <IoInformationCircle className="text-gray-400 text-xl" />
          </label>
          <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded">
            <div className="w-14 h-14 flex justify-center items-center border-r border-gray-200">
              <HiOutlineLockClosed className="text-primary text-xl" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="flex-1 h-14 px-4 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2 text-sm text-neutral-900">
            <input type="checkbox" />
            Remember me
          </label>
          <span className="text-sm text-primary cursor-pointer">
            Forgot password?
          </span>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer mb-6 h-14 bg-secondary rounded-lg text-white sm:text-xl text-lg font-semibold hover:opacity-85 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mb-10">
        <GoogleAuthButton />
      </div>

      <p className="text-center text-base text-neutral-800 font-normal">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-primary hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SigninForm;
