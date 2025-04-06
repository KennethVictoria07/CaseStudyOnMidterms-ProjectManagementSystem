import { useState, useReducer } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router";
import AUTH from "../context/AuthContext";
import ProjectList from "./pages/ProjectList";
import Navbar from "./components/Navbar";
import PROJ from "../context/ProjectContext";
import ProjectDetail from "./pages/ProjectDetail";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="min-h-screen w-screen">
      <AUTH>
        <PROJ>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
            </Routes>
          </BrowserRouter>
        </PROJ>
      </AUTH>
    </div>
  );
}

export default App;
