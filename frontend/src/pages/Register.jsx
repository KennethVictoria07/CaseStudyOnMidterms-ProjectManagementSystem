import React from "react";
import { CONSUMEAUTH } from "../../context/AuthContext";
import { useNavigate } from "react-router";

export default function Register() {
  const AUTH = CONSUMEAUTH();
  const goTo = useNavigate();

  const nameChange = (e) => {
    AUTH.dispatch({
      type: "ENTERING_NAME",
      payload: { name: e.target.value },
    });
  };

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

  const passwordConfirmChange = (e) => {
    AUTH.dispatch({
      type: "ENTERING_PASSWORD_CONFIRM",
      payload: { password_confirmation: e.target.value },
    });
  };

  const register = async (e) => {
    e.preventDefault();
    const registerResult = await AUTH.register();
    if (registerResult) {
      goTo("/login");
    } else {
      alert(`ERROR: ${AUTH.error}`);
    }
  };

  const switchToLogin = (e) => {
    e.preventDefault();
    goTo("/login");
  };

  return (
    <div className="min-h-screen w-full grid place-items-center">
      <div className="w-[30%] bg-black/40 min-h-[50%]">
        <form
          action="post"
          className="flex flex-col gap-[1rem] p-[2rem]"
          onSubmit={register}
        >
          <p className="font-bold text-[1.5rem] text-center text-white">
            Project Management System
          </p>
          <div className="flex flex-col gap-[.5rem]">
            <label htmlFor="name" className="text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="p-[.5rem] bg-zinc-900 border border-stone-500 rounded-lg text-white"
              onChange={nameChange}
            />
          </div>
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
          <div className="flex flex-col gap-[.5rem]">
            <label htmlFor="password_confirmation" className="text-gray-200">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              className="p-[.5rem] bg-zinc-900 border border-stone-500 rounded-lg text-white"
              onChange={passwordConfirmChange}
            />
          </div>
          <button
            type="submit"
            className="bg-[#1a1a1a] py-[.5rem] rounded-lg text-white hover:bg-[#2a2a2a]"
          >
            Register
          </button>
          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <span
              onClick={switchToLogin}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}