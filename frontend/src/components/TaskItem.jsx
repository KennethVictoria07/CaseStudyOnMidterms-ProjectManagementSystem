import React from "react";

export default function TaskItem({ task }) {
  const statusIcon = (status) => {
    return `w-[1rem] h-[1rem] ${
      status === "completed"
        ? "bg-green-500"
        : status === "in_progress"
        ? "bg-orange-500"
        : "bg-red-500"
    } rounded-[50%]`;
  };
  return (
    <button
      className="w-full flex bg-[#2b2b2b] flex-flow flex-nowrap items-center hover:bg-[#3b3b3b]"
      key={task.id}
    >
      <div className="grow-1">
        <p className="text-start">{task.title}</p>
        <p className="text-start text-[.5rem]">{task.description}</p>
      </div>
      <div className={statusIcon(task.status)} />
    </button>
  );
}
