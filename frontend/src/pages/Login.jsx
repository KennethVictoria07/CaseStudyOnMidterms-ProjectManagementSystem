import React, { useEffect } from "react";
import { CONSUMEAUTH } from "../../context/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  const AUTH = CONSUMEAUTH();
  const goTo = useNavigate();

  const emailChange = (e) => {
    AUTH.dispatch({
      type: "ENTERING_EMAIL",
      payload: { email: e.target.value },
    });
  };

  const passwordChange = (e) => {
    AUTH.dispatch({
      type: "ENTERING_PASSWORD",
      payload: { password: e.target.value },
    });
  };

  const login = async (e) => {
    e.preventDefault();
    const loginResult = await AUTH.login();
    if (loginResult) {
      goTo("/");
    } else {
      alert("Login failed");
    }
  };

  const switchToRegister = (e) => {
    e.preventDefault();
    goTo("/register");
  };

  return (
    <div className="min-h-screen w-full grid place-items-center">
      <div className="w-[30%] bg-black/40 min-h-[50%]">
        <form
          action="post"
          className="flex flex-col gap-[1rem] p-[2rem]"
          onSubmit={login}
        >
          <p className="font-bold text-[1.5rem] text-center">
            Project Management System
          </p>
          <div className="flex flex-col gap-[.5rem]">
            <label htmlFor="email" className="text-gray-200">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="p-[.5rem] bg-zinc-900 border border-stone-500 rounded-lg text-white"
              onChange={emailChange}
            />
          </div>
          <div className="flex flex-col gap-[.5rem]">
            <label htmlFor="password" className="text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="p-[.5rem] bg-zinc-900 border border-stone-500 rounded-lg text-white"
              onChange={passwordChange}
            />
          </div>
          <button
            type="submit"
            className="bg-[#1a1a1a] py-[.5rem] rounded-lg text-white hover:bg-[#2a2a2a]"
          >
            Log In
          </button>
          <p className="text-sm text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <span
              onClick={switchToRegister}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}