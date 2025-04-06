import React, { useEffect } from "react";
import { CONSUMEAUTH } from "../../context/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  const AUTH = CONSUMEAUTH();
  const goTo = useNavigate();

  const emailChange = (e) => {
    // e.preventDefault();
    AUTH.dispatch({
      type: "ENTERING_EMAIL",
      payload: { email: e.target.value },
    });
  };

  const passwordChange = (e) => {
    // e.preventDefault();
    AUTH.dispatch({
      type: "ENTERING_PASSWORD",
      payload: { password: e.target.value },
    });
  };

  const login = async (e) => {
    e.preventDefault();
    const login = await AUTH.login();
    if (login) {
      goTo("/");
    } else {
      alert("l");
    }
  };
  return (
    <div className="min-h-screen w-full grid place-items-center">
      <div className="w-[30%] bg-black/40 h-[50%]">
        <form
          action="post"
          className="flex flex-col h-full justify-between p-[2rem]"
          onSubmit={login}
        >
          <p className="font-bold text-[1.5rem] text-center">
            Project Management System
          </p>
          <div className="flex flex-col gap-[.5rem]">
            <label htmlFor="email" className="">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="p-[.5rem] bg-zinc-900 border border-stone-500 rounded-lg"
              onChange={emailChange}
            />
          </div>
          <div className="flex flex-col gap-[.5rem]">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="p-[.5rem] bg-zinc-900 border border-stone-500 rounded-lg"
              onChange={passwordChange}
            />
          </div>
          <button type="submit" className="bg-[#1a1a1a]">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
