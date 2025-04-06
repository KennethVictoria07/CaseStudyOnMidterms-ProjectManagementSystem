import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CONSUMEAUTH } from "../../context/AuthContext";
import PROJ, { CONSUMEPROJ } from "../../context/ProjectContext";
import Navbar from "../components/Navbar";

export default function ProjectList() {
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      goTo("/login");
    } else {
      getProjects();
    }
  }, []);

  const getProjects = async () => {
    await PROJ.getProjects();
  };

  const AUTH = CONSUMEAUTH();
  const PROJ = CONSUMEPROJ();
  const goTo = useNavigate();

  const [method, setMethod] = useState("VIEWING");

  const statusIcon = (status) => {
    return `w-[1rem] h-[1rem] ${
      status === "completed"
        ? "bg-green-500"
        : status === "in_progress"
        ? "bg-orange-500"
        : "bg-red-500"
    } rounded-[50%]`;
  };

  const manageProjectButtonsStyle = (color, condition) => {
    return `w-full flex flex-row items-center justify-between bg-[#1a1a1a] border border-${
      method === condition ? color : "zinc-800"
    } hover:border-${color}`;
  };

  const addProject = async (e) => {
    if (
      PROJ.addEditProjectForm.title.length === 0 ||
      PROJ.addEditProjectForm.description.length === 0
    ) {
      alert("Title and description must not be empty");
      return;
    }
    e.preventDefault();
    const add = await PROJ.addProject(sessionStorage.getItem("id"));
    if (!PROJ.loading) {
      if (add) {
        alert(`Project ${PROJ.addEditProjectForm.title} is added successfully`);
        getProjects();
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
      <div className="h-[90vh] w-full flex flex-row justify-around p-[2rem] content-start">
        <div className="w-[25%] rounded-lg flex flex-col gap-[1rem]">
          <div className="bg-black/40 py-[1rem] rounded-lg flex flex-row items-center justify-around">
            <div className="w-[20%] grid place-items-center rounded-[50%] bg-[#353535] aspect-square">
              <i className="fa-solid fa-user text-black/80 text-[2rem] text-center" />
            </div>
            <div>
              <p className="text-zinc-600 text-[.5rem]">Name</p>
              <p className="text-zinc-400">{sessionStorage.getItem("name")}</p>
              <p className="text-zinc-600 text-[.5rem]">Email</p>
              <p className="text-zinc-400">{sessionStorage.getItem("email")}</p>
              <p className="text-zinc-600 text-[.5rem]">Role</p>
              <p className="text-zinc-400">
                {sessionStorage.getItem("role") === "admin" ? "Admin" : "User"}
              </p>
            </div>
          </div>
          <div className="bg-black/40 grow-1 rounded-lg px-[2rem] py-[1rem] flex flex-col justify-around">
            <p className="text-zinc-600 text-[.75rem]">Manage Projects</p>
            <div className="flex flex-col gap-[.5rem]">
              <button
                className={manageProjectButtonsStyle("yellow-500", "VIEWING")}
                onClick={() => {
                  setMethod("VIEWING");
                }}
              >
                <p className="">View Details</p>
                <i className="fa-solid fa-eye" />
              </button>
              <button
                className={manageProjectButtonsStyle("green-500", "MARKING")}
                onClick={() => {
                  setMethod("MARKING");
                }}
              >
                <p className="">Change Status</p>
                <i className="fa-solid fa-check" />
              </button>
              {sessionStorage.getItem("role") === "admin" && (
                <>
                  <button
                    className={manageProjectButtonsStyle(
                      "orange-500",
                      "EDITING"
                    )}
                    onClick={() => {
                      setMethod("EDITING");
                    }}
                  >
                    <p className="">Edit</p>
                    <i className="fa-solid fa-pen-to-square" />
                  </button>
                  <button
                    className={manageProjectButtonsStyle("red-500", "DELETING")}
                    onClick={() => {
                      setMethod("DELETING");
                    }}
                  >
                    <p className="">Delete</p>
                    <i className="fa-solid fa-trash" />
                  </button>
                </>
              )}
            </div>
            <p className="text-zinc-600 text-[.75rem]">Account</p>
            <button className="bg-red-500 border border-red-400 hover:border-white">
              Logout
            </button>
          </div>
        </div>
        <div className="w-[40%] bg-black/40 rounded-lg px-[2rem] py-[1rem] flex flex-col">
          <div className="flex flex-col w-full py-[1.5rem] px-[1rem] gap-[.5rem] grow-1 border-[2px] rounded-md border-zinc-800 overflow-auto">
            {PROJ.projectList.map((element, index) => {
              return (
                <button
                  className="w-full flex bg-[#2b2b2b] flex-flow flex-nowrap items-center hover:bg-[#3b3b3b]"
                  key={element.id}
                  onClick={() => {
                    PROJ.dispatch({
                      type: "PROJECT",
                      payload: { project: PROJ.projectList[index] },
                    });
                  }}
                >
                  <div className="grow-1">
                    <p className="text-start">{element.title}</p>
                    <p className="text-start text-[.5rem]">
                      {element.description}
                    </p>
                  </div>
                  <div className={statusIcon(element.status)} />
                </button>
              );
            })}
          </div>
          <p className="text-[white] font-bold text-[1.5rem] text-end">
            Projects
          </p>
        </div>
        <div className="w-[25%] min-h-full rounded-lg flex flex-col gap-[1rem]">
          <div className="flex flex-col justify-around bg-black/40 px-[1.5rem] py-[.5rem] rounded-2xl h-[60%]">
            {method === "VIEWING" && <ViewingProject project={PROJ.project} />}
            {method === "MARKING" && <MarkingProject project={PROJ.project} />}
            {method === "EDITING" && <EditingProject project={PROJ.project} />}
            {method === "DELETING" && (
              <DeletingProject project={PROJ.project} />
            )}
          </div>
          <div className="bg-black/40 px-[1.5rem] py-[1rem] rounded-2xl grow-1">
            <form
              className="flex flex-col flex-nowrap gap-[.25rem]"
              onSubmit={addProject}
            >
              <p className="text-zinc-600 text-[.75rem]">Add Project</p>
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
                      type: "ENTERING_TITLE",
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
                      type: "ENTERING_DESCRIPTION",
                      payload: { description: e.target.value },
                    });
                  }}
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="text-[.75rem]">Status: In Progress</p>
                <button type="submit" className="border hover:border-green-500">
                  <p className="text-[.75rem]">Add</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function ViewingProject({ project }) {
  const goTo = useNavigate();
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
  return (
    <>
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
      <p className="text-zinc-600 text-[.5rem]">Description</p>
      <p className="text-[.9rem]">{project.description}</p>
      <p className="text-zinc-600 text-[.5rem]">Created by</p>
      <p className="text-[.9rem]">{project.user_name}</p>
      <p className="text-zinc-600 text-[.5rem]">Created</p>
      <p className="text-[.9rem]">{created_at}</p>
      <p className="text-zinc-600 text-[.5rem]">Last Update</p>
      <p className="text-[.9rem]">{updated_at}</p>
      <button
        className="w-fit self-end border border-zinc-800 hover:border-[#646cff]"
        onClick={() => goTo(`/projects/${project.id}`)}
      >
        <p className="text-[.75rem]">View Tasks</p>
      </button>
    </>
  );
}

function MarkingProject({ project }) {
  const [selected, setSelected] = useState(project.status);
  const PROJ = CONSUMEPROJ();

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const editStatus = async (e) => {
    const getProjects = async () => {
      await PROJ.getProjects();
    };
    if (selected === project.status) {
      alert("No changes made");
      return;
    }
    e.preventDefault();
    const update = await PROJ.updateStatus(
      project.id,
      selected,
      project.title,
      project.description
    );
    if (!PROJ.loading) {
      if (update) {
        alert(
          `Project ${PROJ.addEditProjectForm.title} is updated to ${selected} successfully`
        );
        getProjects();
      } else {
        alert(`Something went wrong`);
      }
    }
  };

  const statusStyle = `
  p-[.5rem] justify-self-end self-end w-fit text-[.5rem] rounded-2xl ${
    project.status === "completed"
      ? "bg-green-500"
      : project.status === "in_progress"
      ? "bg-orange-500"
      : "bg-red-500"
  }
  `;
  return (
    <>
      <p className="text-zinc-600 text-[.75rem]">MARKING</p>
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
      <p className="text-zinc-600 text-[.5rem]">Description</p>
      <p className="text-[.9rem]">{project.description}</p>
      <p className="text-zinc-600 text-[.5rem]">Created by</p>
      <p className="text-[.9rem]">{project.user_name}</p>
      <p className="text-zinc-600 text-[.5rem]">Update to: </p>
      <form
        className="flex flex-col flex-nowrap gap-[.5rem]"
        onSubmit={editStatus}
      >
        <div className="flex flex-row flex-nowrap justify-around">
          <input
            type="radio"
            id="in_progress"
            name="status"
            value="in_progress"
            checked={selected === "in_progress"}
            onChange={handleChange}
          />
          <label for="in_progress">In Progress</label>
          <input
            type="radio"
            id="pending"
            name="status"
            value="pending"
            checked={selected === "pending"}
            onChange={handleChange}
          />
          <label for="pending">Pending</label>
          <input
            type="radio"
            id="completed"
            name="status"
            value="completed"
            checked={selected === "completed"}
            onChange={handleChange}
          />
          <label for="completed">Completed</label>
        </div>
        <button className="w-fit self-end border border-zinc-800 hover:border-[#646cff]">
          <p className="text-[.75rem]">Update Status</p>
        </button>
      </form>
    </>
  );
}

function EditingProject({ project }) {
  const getProjects = async () => {
    await PROJ.getProjects();
  };
  const PROJ = CONSUMEPROJ();
  const editProject = async (e) => {
    if (
      PROJ.addEditProjectForm.title.length == 0 ||
      PROJ.addEditProjectForm.description.length == 0
    ) {
      alert("Fields must not be empty");
      return;
    }
    e.preventDefault();
    const update = await PROJ.updateStatus(
      project.id,
      project.status,
      PROJ.addEditProjectForm.title,
      PROJ.addEditProjectForm.description
    );
    if (!PROJ.loading) {
      if (update) {
        alert(
          `Project ${PROJ.addEditProjectForm.title} is updated successfully`
        );
        getProjects();
      } else {
        alert(`Something went wrong`);
      }
    }
  };

  useEffect(() => {
    PROJ.dispatch({
      type: "ENTERING_TITLE",
      payload: { title: project.title },
    });

    PROJ.dispatch({
      type: "ENTERING_DESCRIPTION",
      payload: { description: project.description },
    });
  }, [project]);

  const statusStyle = `
  p-[.5rem] justify-self-end self-end w-fit text-[.5rem] rounded-2xl ${
    project.status === "completed"
      ? "bg-green-500"
      : project.status === "in_progress"
      ? "bg-orange-500"
      : "bg-red-500"
  }
  `;
  return (
    <>
      <p className="text-zinc-600 text-[.75rem]">Editing</p>
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
      <form
        onSubmit={editProject}
        className="flex flex-col flex-nowrap justify-around gap-[1rem]"
      >
        <div className="flex flex-col">
          <label htmlFor="title" className="text-[.85rem]">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="border-b-[1px] border-b-stone-500 font-[.75rem]"
            onChange={(e) => {
              PROJ.dispatch({
                type: "ENTERING_TITLE",
                payload: { title: e.target.value },
              });
            }}
            value={PROJ.addEditProjectForm.title}
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
            className="border-b-[1px] border-b-stone-500 font-[.75rem]"
            onChange={(e) => {
              PROJ.dispatch({
                type: "ENTERING_DESCRIPTION",
                payload: { description: e.target.value },
              });
            }}
            value={PROJ.addEditProjectForm.description}
          />
        </div>
        <button
          className="w-fit self-end border border-zinc-800 hover:border-[#646cff]"
          type="submit"
        >
          <p className="text-[.75rem]">Edit Project</p>
        </button>
      </form>
    </>
  );
}

function DeletingProject({ project }) {
  const getProjects = async () => {
    await PROJ.getProjects();
  };
  const PROJ = CONSUMEPROJ();
  const deleteProject = async (e) => {
    e.preventDefault();
    const remove = await PROJ.deleteProject(project.id);
    if (!PROJ.loading) {
      if (remove) {
        alert(
          `Project ${PROJ.addEditProjectForm.title} is removed successfully`
        );
        getProjects();
      } else {
        alert(`Something went wrong`);
      }
    }
  };
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
  return (
    <>
      <p className="text-zinc-600 text-[.75rem]">Deleting</p>
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
      <p className="text-zinc-600 text-[.5rem]">Description</p>
      <p className="text-[.9rem]">{project.description}</p>
      <p className="text-zinc-600 text-[.5rem]">Created by</p>
      <p className="text-[.9rem]">{project.user_name}</p>
      <p className="text-zinc-600 text-[.5rem]">Created</p>
      <p className="text-[.9rem]">{created_at}</p>
      <p className="text-zinc-600 text-[.5rem]">Last Update</p>
      <p className="text-[.9rem]">{updated_at}</p>
      <form onSubmit={deleteProject}>
        <button
          className="w-fit self-end border border-zinc-800 bg-red-500"
          onClick={() => {
            PROJ.deleteproject(project.id);
          }}
        >
          <p className="text-[.75rem]">Delete Project</p>
        </button>
      </form>
    </>
  );
}
