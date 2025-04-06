import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

export default function Dashboard() {
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      goTo("/login");
    }
  }, []);
  const goTo = useNavigate();
  return (
    <>
      <Navbar />
      <div className="h-[90vh] w-full grid place-items-center p-[2rem] ">
        <div className="w-[60%] h-full  flex flex-row flex-nowrap rounded-lg gap-[.5rem]">
          <div className="w-[60%] bg-black/20 grid place-items-center px-[2rem]">
            <p className="font-bold text-[2rem]">PROJECT MANAGEMENT SYSTEM</p>
          </div>
          <button
            className="w-[40%] grid place-items-center px-[2rem] hover:bg-[#eeeeee] hover:text-[#1a1a1a] border border-zinc-900"
            onClick={() => {
              goTo("/projects");
            }}
          >
            <p className="rotate-270">
              Open Projects <i className="fa-solid fa-arrow-right" />
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
