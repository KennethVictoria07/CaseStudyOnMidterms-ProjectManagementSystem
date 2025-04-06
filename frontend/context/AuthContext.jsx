import React, { useReducer, useContext, createContext } from "react";
import axios from "axios";

const context = createContext();

export default function AUTH({ children }) {
  const INIT_STATE = {
    loading: false,
    error: "",
    status: 0,
    userData: {},
    userToken: "",
    logInUser: {
      email: "",
      password: "",
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

      case "SET_USER":
        return {
          ...state,
          userData: action.payload.user,
          userToken: action.payload.token,
        };

      case "CLEAR_USER":
        return {
          ...state,
          userData: {},
          userToken: "",
          logInUser: {
            email: "",
            password: "",
          },
        };

      case "NOT_AUTHORIZED":
        return {
          ...state,
          user_data: {},
          token: "",
          status: 401,
        };

      case "ENTERING_EMAIL":
        return {
          ...state,
          logInUser: {
            ...state.logInUser,
            email: action.payload.email,
          },
        };

      case "ENTERING_PASSWORD":
        return {
          ...state,
          logInUser: {
            ...state.logInUser,
            password: action.payload.password,
          },
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

  const login = async () => {
    dispatch({ type: "START_LOADING" });
    try {
      console.log(state.logInUser.email, state.logInUser.password);
      const login = await axios.post("http://127.0.0.1:8000/api/login/", {
        email: state.logInUser.email,
        password: state.logInUser.password,
      });
      
      
      if (login.status === 200) {
        console.log(login.data);

        dispatch({
          type: "SET_USER",
          payload: { user: login.data.user, token: login.data.token },
        });
        // due to asynchronous nature of states, we must store data on session storage for the program to run after reloading
        sessionStorage.setItem("token", login.data.token);
        sessionStorage.setItem("email", login.data.user.email);
        sessionStorage.setItem("name", login.data.user.name);
        sessionStorage.setItem("role", login.data.user.role);
        sessionStorage.setItem("id", login.data.user.id);
        return true;
      }
      dispatch({ type: "NOT_AUTHORIZED" });
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

  const logout = async () => {
    dispatch({ type: "START_LOADING" });
    try {
      const login = await axios.post(
        "http://127.0.0.1:8000/api/logout/",
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (login.status === 200) {
        dispatch({
          type: "CLEAR_USER",
        });
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("id");
        return true;
      }
      dispatch({
        type: "FAIL_FETCH",
        payload: { error: "Unauthorized", status: 401 },
      });
      return false;
    } catch (error) {
      dispatch({
        type: "FAIL_FETCH",
        payload: { error: error.message, status: 500 },
      });
      return false;
    } finally {
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  return (
    <context.Provider
      value={{
        loading: state.loading,
        error: state.error,
        status: state.status,
        userData: state.userData,
        userToken: state.userToken,
        status: state.status,
        dispatch,
        login,
        logout,
      }}
    >
      {children}
    </context.Provider>
  );
}

export function CONSUMEAUTH() {
  return useContext(context);
}
