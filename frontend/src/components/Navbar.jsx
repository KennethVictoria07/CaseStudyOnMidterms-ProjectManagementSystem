import React from "react";
import { CONSUMEAUTH } from "../../context/AuthContext";
import { useNavigate } from "react-router";

export default function Navbar() {
  const AUTH = CONSUMEAUTH();
  const goTo = useNavigate();
  const logout = async () => {
    const logout = await AUTH.logout();
    if (logout) {
      goTo("/login");
    } else {
      alert(`ERROR: ${AUTH.error}`);
    }
  };
  return (
    <div className="bg-black/40 w-screen flex flex-row px-[2rem] py-[.5rem] justify-center items-center gap-[1rem]">
      <p className="font-bold grow-1">Project Management System</p>
      <button onClick={() => goTo("/")}>Home</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
