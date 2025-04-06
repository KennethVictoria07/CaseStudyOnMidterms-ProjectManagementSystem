import React, { useReducer, useContext, createContext } from "react";
import axios from "axios";
import { CONSUMEAUTH } from "./AuthContext";

const context = createContext();

export default function PROJ({ children }) {
  const AUTH = CONSUMEAUTH();
  const INIT_STATE = {
    loading: false,
    error: "",
    status: 0,
    project: {},
    task: {},
    projectList: [],
    taskList: [],
    addEditProjectForm: {
      title: "",
      description: "",
    },
    addTask: {
      title: "",
      description: "",
    },
  };

  function REDUCER(state, action) {
    switch (action.type) {
      case "START_LOADING":
        return {
          ...state,
          loading: true,
        };
      case "FINISH_LOADING":
        return {
          ...state,
          loading: false,
        };

      case "ENTERING_TITLE":
        return {
          ...state,
          addEditProjectForm: {
            ...state.addEditProjectForm,
            title: action.payload.title,
          },
        };

      case "ENTERING_DESCRIPTION":
        return {
          ...state,
          addEditProjectForm: {
            ...state.addEditProjectForm,
            description: action.payload.description,
          },
        };

      case "ENTERING_TASK_TITLE":
        return {
          ...state,
          addTask: { ...state.addTask, title: action.payload.title },
        };

      case "ENTERING_TASK_DESCRIPTION":
        return {
          ...state,
          addTask: {
            ...state.addTask,
            description: action.payload.description,
          },
        };

      case "PROJECTLIST":
        return {
          ...state,
          projectList: action.payload.projectList,
        };

      case "TASKLIST":
        return {
          ...state,
          taskList: action.payload.taskList,
        };

      case "TASK":
        return {
          ...state,
          task: action.payload.task,
        };

      case "PROJECT":
        return {
          ...state,
          project: action.payload.project,
        };

      case "SUCCESS_FETCH":
        return {
          ...state,
          error: "",
          status: action.payload.status,
        };

      case "FAIL_FETCH":
        return {
          ...state,
          error: action.payload.error,
          status: action.payload.status,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(REDUCER, INIT_STATE);

  const getProjects = async () => {
    dispatch({ type: "START_LOADING" });
    try {
      const get = await axios.get("http://127.0.0.1:8000/api/projects/", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      if (get.status === 200) {
        dispatch({
          type: "PROJECTLIST",
          payload: { projectList: get.data.projects },
        });

        dispatch({
          type: "PROJECT",
          payload: { project: get.data.projects[0] },
        });
        console.log(get.data);
        return true;
      }
      console.log(get.data);
      dispatch({
        type: "FAIL_FETCH",
        payload: { error: "Unauthorized", status: 401 },
      }); 
      return false;
    } catch (error) {
      console.log(error);

      dispatch({
        type: "FAIL_FETCH",
        payload: { error: error.message, status: 500 },
      });
      return false;
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  const addProject = async (user_id) => {
    dispatch({ type: "START_LOADING" });
    try {
      const add = await axios.post(
        "http://127.0.0.1:8000/api/projects/",
        {
          title: state.addEditProjectForm.title,
          description: state.addEditProjectForm.description,
          status: "in_progress",
          user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (add.status === 201) {
        return true;
      }
      dispatch({
        type: "FAIL_FETCH",
        payload: { error: "Unauthorized", status: 401 },
      });
      return false;
    } catch (error) {
      console.log(error);

      dispatch({
        type: "FAIL_FETCH",
        payload: { error: error.message, status: 500 },
      });
      return false;
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  const updateStatus = async (id, status, title, description) => {
    dispatch({ type: "START_LOADING" });
    try {
      const edit = await axios.put(
        `http://127.0.0.1:8000/api/projects/${id}`,
        {
          status,
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (edit.status === 200) {
        return true;
      }
      dispatch({
        type: "FAIL_FETCH",
        payload: { error: "Unauthorized", status: 401 },
      });
      return false;
    } catch (error) {
      console.log(error);

      dispatch({
        type: "FAIL_FETCH",
        payload: { error: error.message, status: 500 },
      });
      return false;
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  const deleteProject = async (id) => {
    dispatch({ type: "START_LOADING" });
    try {
      const remove = await axios.delete(
        `http://127.0.0.1:8000/api/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (remove.status === 204) {
        return true;
      }
      dispatch({
        type: "FAIL_FETCH",
        payload: { error: "Unauthorized", status: 401 },
      });
      return false;
    } catch (error) {
      console.log(error);

      dispatch({
        type: "FAIL_FETCH",
        payload: { error: error.message, status: 500 },
      });
      return false;
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  const getTasks = async (id) => {
    dispatch({ type: "START_LOADING" });
    try {
      const get = await axios.get(
        `http://127.0.0.1:8000/api/projects/${id}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (get.status === 200) {
        console.log(get.data);

        dispatch({
          type: "TASKLIST",
          payload: { taskList: get.data },
        });

        return true;
      }
      dispatch({
        type: "FAIL_FETCH",
        payload: { error: "Unauthorized", status: 401 },
      });
      return false;
    } catch (error) {
      console.log(error);

      dispatch({
        type: "FAIL_FETCH",
        payload: { error: error.message, status: 500 },
      });
      return false;
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  const addProjectTask = async (project_id) => {
    dispatch({ type: "START_LOADING" });
    try {
      const add = await axios.post(
        `http://127.0.0.1:8000/api/projects/${project_id}/tasks`,
        {
          title: state.addTask.title,
          description: state.addTask.description,
          status: "in_progress",
          project_id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (add.status === 201) {
        return true;
      }
      dispatch({
        type: "FAIL_FETCH",
        payload: { error: "Unauthorized", status: 401 },
      });
      return false;
    } catch (error) {
      console.log(error);

      dispatch({
        type: "FAIL_FETCH",
        payload: { error: error.message, status: 500 },
      });
      return false;
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  // projects/{project}/tasks
  //   {
  //     loading: false,
  //     error: "",
  //     status: 0,
  //     project: {},
  //     task: {},
  //     projectList: [],
  //     taskList: [],
  //     addEditProjectForm: {
  //       title: "",
  //       description: "",
  //     },
  //     addTask: "",
  //   };

  return (
    <context.Provider
      value={{
        loading: state.loading,
        error: state.error,
        status: state.status,
        project: state.project,
        task: state.task,
        projectList: state.projectList,
        taskList: state.taskList,
        addEditProjectForm: state.addEditProjectForm,
        addTask: state.addTask,
        dispatch,
        getProjects,
        addProject,
        updateStatus,
        deleteProject,
        getTasks,
        addProjectTask,
      }}
    >
      {children}
    </context.Provider>
  );
}

export function CONSUMEPROJ() {
  return useContext(context);
}
