import React, { useState } from "react";
import { Download, Plus, Trash2, Calendar } from "lucide-react";

// Type Definitions
interface TeamMember {
  name: string;
  role: string;
}

interface TaskItem {
  title: string;
  description: string;
  status: "In Progress" | "Completed" | "Pending";
  assignedTo: string;
  priority: "Low" | "Medium" | "High";
}

interface DailyTasks {
  date: string;
  items: TaskItem[];
}

const DevelopmentProgressTracker: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", role: "" },
  ]);
  const [tasks, setTasks] = useState<DailyTasks[]>([
    {
      date: new Date().toLocaleDateString(),
      items: [
        {
          title: "",
          description: "",
          status: "In Progress",
          assignedTo: "",
          priority: "Medium",
        },
      ],
    },
  ]);

  // Add function to update date for a specific task group
  const updateTaskDate = (dateIndex: number, newDate: string): void => {
    const newTasks = [...tasks];
    newTasks[dateIndex].date = newDate;
    setTasks(newTasks);
  };

  const addTeamMember = (): void => {
    setTeamMembers([...teamMembers, { name: "", role: "" }]);
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string
  ): void => {
    const newMembers = [...teamMembers];
    newMembers[index][field] = value;
    setTeamMembers(newMembers);
  };

  const addTaskDate = (): void => {
    setTasks([
      ...tasks,
      {
        date: new Date().toLocaleDateString(),
        items: [
          {
            title: "",
            description: "",
            status: "In Progress",
            assignedTo: "",
            priority: "Medium",
          },
        ],
      },
    ]);
  };

  const addTaskToDate = (dateIndex: number): void => {
    const newTasks = [...tasks];
    newTasks[dateIndex].items.push({
      title: "",
      description: "",
      status: "In Progress",
      assignedTo: "",
      priority: "Medium",
    });
    setTasks(newTasks);
  };

  const updateTask = (
    dateIndex: number,
    taskIndex: number,
    field: keyof TaskItem,
    value: string
  ): void => {
    const newTasks = [...tasks];
    newTasks[dateIndex].items[taskIndex][field] = value as never;
    setTasks(newTasks);
  };

  const removeTask = (dateIndex: number, taskIndex: number): void => {
    const newTasks = [...tasks];
    newTasks[dateIndex].items.splice(taskIndex, 1);
    setTasks(newTasks);
  };

  const generatePDFReport = (): void => {
    const reportContent = `
=======================================================================
                     DEVELOPMENT PROGRESS REPORT
=======================================================================

PROJECT: ${projectName.toUpperCase()}
=======================================================================

TEAM MEMBERS:
-----------------------------------------------------------------------
${teamMembers
  .map(
    (member, index) =>
      `${index + 1}. ${member.name.toUpperCase()} - ${member.role}`
  )
  .join("\n")}
-----------------------------------------------------------------------

DAILY TASKS:
=======================================================================
${tasks
  .map(
    (taskDate) => `
DATE: >> ${taskDate.date.toUpperCase()} <<
-----------------------------------------------------------------------

${taskDate.items
  .map(
    (task, index) => `
************* TASK ${index + 1} *************
TITLE:        ${task.title.toUpperCase()}
DESCRIPTION:  ${task.description}
STATUS:       >> ${task.status.toUpperCase()} <<
ASSIGNED TO:  ${task.assignedTo.toUpperCase()}
PRIORITY:     >> ${task.priority.toUpperCase()} <<
***************************************
`
  )
  .join("\n")}
`
  )
  .join(
    "\n\n=======================================================================\n\n"
  )}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Development_Report_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
  };

  const generateDOCXReport = async (): Promise<void> => {
    const docContent = `
=======================================================================
                     DEVELOPMENT PROGRESS REPORT
=======================================================================

PROJECT: ${projectName.toUpperCase()}
=======================================================================

TEAM MEMBERS:
-----------------------------------------------------------------------
${teamMembers
  .map(
    (member, index) =>
      `${index + 1}. ${member.name.toUpperCase()} - ${member.role}`
  )
  .join("\n")}
-----------------------------------------------------------------------

DAILY TASKS:
=======================================================================
${tasks
  .map(
    (taskDate) => `
DATE: >> ${taskDate.date.toUpperCase()} <<
-----------------------------------------------------------------------

${taskDate.items
  .map(
    (task, index) => `
************* TASK ${index + 1} *************
TITLE:        ${task.title.toUpperCase()}
DESCRIPTION:  ${task.description}
STATUS:       >> ${task.status.toUpperCase()} <<
ASSIGNED TO:  ${task.assignedTo.toUpperCase()}
PRIORITY:     >> ${task.priority.toUpperCase()} <<
***************************************
`
  )
  .join("\n")}
`
  )
  .join(
    "\n\n=======================================================================\n\n"
  )}
    `;

    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(docContent);
    const blob = new Blob([uint8Array], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Development_Report_${
      new Date().toISOString().split("T")[0]
    }.docx`;
    link.click();
  };

  // Helper function to format date string for input field
  const formatDateForInput = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    } catch (e) {
      return new Date().toISOString().split("T")[0]; // Default to today if parsing fails
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Development Progress Tracker</h1>

      {/* Project Name Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter project name"
        />
      </div>

      {/* Team Members Section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Team Members</h2>
        {teamMembers.map((member, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) => updateTeamMember(index, "name", e.target.value)}
              className="mr-2 p-2 border rounded flex-1"
            />
            <input
              type="text"
              placeholder="Role"
              value={member.role}
              onChange={(e) => updateTeamMember(index, "role", e.target.value)}
              className="p-2 border rounded flex-1"
            />
          </div>
        ))}
        <button
          onClick={addTeamMember}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Team Member
        </button>
      </div>

      {/* Tasks Section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Daily Tasks</h2>
        {tasks.map((taskDate, dateIndex) => (
          <div key={dateIndex} className="border p-4 mb-2 rounded">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-500" size={18} />
                <input
                  type="date"
                  value={formatDateForInput(taskDate.date)}
                  onChange={(e) => {
                    // Convert from YYYY-MM-DD to locale date string
                    const date = new Date(e.target.value);
                    updateTaskDate(dateIndex, date.toLocaleDateString());
                  }}
                  className="p-1 border rounded mr-2"
                />
                <span className="font-medium">{taskDate.date}</span>
              </div>
              <button
                onClick={() => addTaskToDate(dateIndex)}
                className="bg-green-500 text-white p-1 rounded flex items-center"
              >
                <Plus className="mr-1" /> Add Task
              </button>
            </div>

            {taskDate.items.map((task, taskIndex) => (
              <div key={taskIndex} className="mb-4 p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Task {taskIndex + 1}</h4>
                  <button
                    onClick={() => removeTask(dateIndex, taskIndex)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={task.title}
                    onChange={(e) =>
                      updateTask(dateIndex, taskIndex, "title", e.target.value)
                    }
                    className="p-2 border rounded"
                  />
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTask(dateIndex, taskIndex, "status", e.target.value)
                    }
                    className="p-2 border rounded"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <textarea
                  placeholder="Task Description"
                  value={task.description}
                  onChange={(e) =>
                    updateTask(
                      dateIndex,
                      taskIndex,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded mt-2"
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Assigned To"
                    value={task.assignedTo}
                    onChange={(e) =>
                      updateTask(
                        dateIndex,
                        taskIndex,
                        "assignedTo",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded"
                  />
                  <select
                    value={task.priority}
                    onChange={(e) =>
                      updateTask(
                        dateIndex,
                        taskIndex,
                        "priority",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={addTaskDate}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Date
        </button>
      </div>

      {/* Report Generation Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={generatePDFReport}
          className="bg-red-500 text-white p-2 rounded flex items-center"
        >
          <Download className="mr-2" /> Generate TXT
        </button>
        <button
          onClick={generateDOCXReport}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <Download className="mr-2" /> Generate DOCX
        </button>
      </div>
    </div>
  );
};

export default DevelopmentProgressTracker;
