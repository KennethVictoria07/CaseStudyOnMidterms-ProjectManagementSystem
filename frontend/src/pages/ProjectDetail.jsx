import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { CONSUMEPROJ } from "../../context/ProjectContext";
import { CONSUMEAUTH } from "../../context/AuthContext";
import TaskItem from "../components/TaskItem";

export default function ProjectDetail() {
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      goTo("/login");
    } else {
      getTasks();
    }
  }, []);

  const getTasks = async () => {
    await PROJ.getTasks(project.id);
  };

  const PROJ = CONSUMEPROJ();
  const AUTH = CONSUMEAUTH();
  const project = PROJ.project;

  const created_at = new Date(project.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updated_at = new Date(project.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const statusStyle = `
  p-[.5rem] justify-self-end self-end w-fit text-[.5rem] rounded-2xl ${
    project.status === "completed"
      ? "bg-green-500"
      : project.status === "in_progress"
      ? "bg-orange-500"
      : "bg-red-500"
  }
  `;

  const addTask = async (e) => {
    if (
      PROJ.addTask.title.length === 0 ||
      PROJ.addTask.description.length === 0
    ) {
      alert("Title and description must not be empty");
      return;
    }
    e.preventDefault();
    const add = await PROJ.addProjectTask(project.id);
    if (!PROJ.loading) {
      if (add) {
        alert(`Task ${PROJ.addTask.title} is added successfully`);
        getTasks();
      } else {
        alert(`Something went wrong`);
      }
    }
  };

  if (PROJ.loading) {
    return (
      <>
        <Navbar />
        <p>Kindly wait data is loading</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-[90vh] w-full  flex flex-row justify-around p-[2rem] content-start">
        <div className="w-[60%] h-full  flex flex-row flex-nowrap rounded-lg gap-[.5rem]">
          <div className="w-[40%] h-full flex flex-col gap-[2rem] rounded-lg">
            <div className="flex flex-col flex-nowrap bg-black/40 px-[2rem] py-[1rem] rounded grow-1 ">
              <div>
                <p className="text-zinc-600 text-[.75rem]">Project</p>
                <div className="flex flex-row flex-nowrap justify-between items-center pb-[.5rem] border-b mb-[.5rem]">
                  <p className=" font-bold">{project.title}</p>
                  <div className={statusStyle}>
                    {project.status === "completed"
                      ? "COMPLETED"
                      : project.status === "in_progress"
                      ? "IN PROGRESS"
                      : "PENDING"}
                  </div>
                </div>
              </div>
              <p className="text-zinc-600 text-[.5rem]">Description</p>
              <p className="text-[.9rem]">{project.description}</p>
              <p className="text-zinc-600 text-[.5rem]">Created by</p>
              <p className="text-[.9rem]">{project.user_name}</p>
              <p className="text-zinc-600 text-[.5rem]">Created</p>
              <p className="text-[.9rem]">{created_at}</p>
              <p className="text-zinc-600 text-[.5rem]">Last Update</p>
              <p className="text-[.9rem]">{updated_at}</p>
            </div>
            <div className="bg-black/40 px-[1.5rem] py-[1rem] rounded-2xl">
              <form
                className="flex flex-col flex-nowrap gap-[.25rem]"
                onSubmit={addTask}
              >
                <p className="text-zinc-600 text-[.75rem]">Add Task</p>
                <div className="flex flex-col">
                  <label htmlFor="title" className="text-[.85rem]">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="border-b-[1px] border-b-stone-500"
                    onChange={(e) => {
                      PROJ.dispatch({
                        type: "ENTERING_TASK_TITLE",
                        payload: { title: e.target.value },
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="description" className="text-[.85rem]">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className="border-b-[1px] border-b-stone-500"
                    onChange={(e) => {
                      PROJ.dispatch({
                        type: "ENTERING_TASK_DESCRIPTION",
                        payload: { description: e.target.value },
                      });
                    }}
                  />
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-[.75rem]">Status: In Progress</p>
                  <button
                    type="submit"
                    className="border hover:border-green-500"
                  >
                    <p className="text-[.75rem]">Add</p>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="h-full grow-1 bg-black/30 rounded-lg px-[2rem] py-[1rem] flex flex-col gap-[1rem]">
            <p className="text-[white] font-bold">Tasks</p>
            <div className="flex flex-col gap-[1rem]">
              {PROJ.taskList.map((task) => {
                return <TaskItem task={task} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
