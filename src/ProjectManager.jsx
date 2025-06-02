import React, { useState } from 'react';

function ProjectManager() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, taskInput]);
      setTaskInput('');
    }
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Project Management</h2>
      <div className="space-y-2">
        <textarea
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter task (e.g., 'Schedule foundation work')"
          className="w-full p-2 border rounded"
          rows="3"
        />
        <button
          onClick={addTask}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
        <div id="tasks" className="mt-2">
          {tasks.map((task, index) => (
            <p key={index} className="text-gray-700">{task}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectManager;