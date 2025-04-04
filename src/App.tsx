import React, { useState, useEffect } from "react";
import {
  Download,
  Plus,
  ListX,
  Calendar,
  CalendarX,
  UserX,
  Moon,
  Sun,
} from "lucide-react";
import jsPDF from "jspdf";

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
  const [darkMode, setDarkMode] = useState<boolean>(false);
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

  // Update theme when darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-black", "text-dark-text");
      document.body.classList.remove("bg-gray-100");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-black", "text-dark-text");
      document.body.classList.add("bg-gray-100");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Add function to update date for a specific task group
  const updateTaskDate = (dateIndex: number, newDate: string): void => {
    const newTasks = [...tasks];
    newTasks[dateIndex].date = newDate;
    setTasks(newTasks);
  };

  // Function to remove a whole date group
  const removeTaskDate = (dateIndex: number): void => {
    // Prevent removing the last date
    if (tasks.length <= 1) {
      return;
    }
    const newTasks = [...tasks];
    newTasks.splice(dateIndex, 1);
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

  // Add function to remove a team member
  const removeTeamMember = (index: number): void => {
    // Prevent removing the last team member
    if (teamMembers.length <= 1) {
      return;
    }
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
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

  const generateTXTReport = (): void => {
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
  const generatePDF = (): void => {
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set initial font styles - changed to a monospace font
    pdf.setFont("courier", "bold");
    pdf.setFontSize(20);

    // Add title (centered)
    pdf.text("DEVELOPMENT PROGRESS REPORT", 105, 20, { align: "center" });

    // Keep only this essential horizontal line
    pdf.setLineWidth(0.3);
    pdf.line(20, 25, 190, 25);

    // Add project name
    pdf.setFontSize(16);
    pdf.text(`PROJECT: ${projectName.toUpperCase()}`, 20, 35);

    // Removed unnecessary divider line here

    // Add team members section
    pdf.setFontSize(14);
    pdf.text("TEAM MEMBERS:", 20, 50);

    // Add team members
    let yPos = 60;
    pdf.setFont("courier", "normal");
    pdf.setFontSize(12);

    teamMembers.forEach((member, index) => {
      const memberText = `${index + 1}. ${member.name.toUpperCase()} - ${
        member.role
      }`;
      pdf.text(memberText, 25, yPos);
      yPos += 8;
    });

    // Removed unnecessary divider line here
    yPos += 10;

    // Add tasks header
    pdf.setFont("courier", "bold");
    pdf.setFontSize(14);
    pdf.text("DAILY TASKS:", 20, yPos);
    yPos += 10;

    // Add tasks by date
    tasks.forEach((taskDate, dateIndex) => {
      // Add extra space between dates
      if (dateIndex > 0) {
        yPos += 15; // Add 15mm of extra space between date sections
      }

      // Check if we need a new page
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }

      // Add date header with background - slightly softer gray
      pdf.setFillColor(245, 245, 245);
      pdf.rect(20, yPos - 5, 170, 10, "F");
      pdf.setFont("courier", "bold");
      pdf.setFontSize(12);
      pdf.text(`DATE: ${taskDate.date.toUpperCase()}`, 25, yPos);
      yPos += 15;

      // Add tasks for this date
      taskDate.items.forEach((task, taskIndex) => {
        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }

        // Task box background - softer blue-gray tint
        pdf.setFillColor(250, 250, 252);
        pdf.rect(20, yPos - 5, 170, 38, "F");

        // Task border - softer gray
        pdf.setDrawColor(230, 230, 230);
        pdf.rect(20, yPos - 5, 170, 38);

        // Task number and title
        pdf.setFont("courier", "bold");
        pdf.setFontSize(11);
        pdf.text(
          `TASK ${taskIndex + 1}: ${task.title.toUpperCase()}`,
          25,
          yPos
        );
        yPos += 7;

        // Task description (may need to wrap long text)
        pdf.setFont("courier", "normal");
        pdf.setFontSize(10);

        // Split long descriptions into multiple lines if needed
        const description = `DESCRIPTION: ${task.description}`;
        const splitDescription = pdf.splitTextToSize(description, 160);
        pdf.text(splitDescription, 25, yPos);
        yPos += splitDescription.length * 5 + 2;

        // Task status
        pdf.setFont("courier", "bold");
        // Set color based on status - more muted colors
        if (task.status === "Completed") {
          pdf.setTextColor(76, 175, 80); // Softer green
        } else if (task.status === "In Progress") {
          pdf.setTextColor(66, 133, 244); // Softer blue
        } else {
          pdf.setTextColor(255, 152, 0); // Softer orange
        }
        pdf.text(`STATUS: ${task.status.toUpperCase()}`, 25, yPos);
        pdf.setTextColor(0, 0, 0); // Reset to black
        yPos += 7;

        // Assigned To
        pdf.setFont("courier", "normal");
        pdf.text(
          `ASSIGNED TO: ${task.assignedTo.toUpperCase()}`,
          100,
          yPos - 7
        );

        // Priority
        pdf.setFont("courier", "bold");
        // Set color based on priority - more muted colors
        if (task.priority === "High") {
          pdf.setTextColor(239, 83, 80); // Softer red
        } else if (task.priority === "Medium") {
          pdf.setTextColor(255, 152, 0); // Softer orange
        } else {
          pdf.setTextColor(76, 175, 80); // Softer green
        }
        pdf.text(`PRIORITY: ${task.priority.toUpperCase()}`, 25, yPos);
        pdf.setTextColor(0, 0, 0); // Reset to black

        yPos += 15;
      });
    });

    // Save the PDF
    pdf.save(
      `Development_Report_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };
  // Helper function to format date string for input field
  const formatDateForInput = (dateString: string): string => {
    try {
      const date = new Date(dateString);

      // Get local date components and build YYYY-MM-DD manually
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`; // Format as YYYY-MM-DD without time zone conversion
    } catch {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-background text-gray-800 dark:text-dark-text rounded-lg relative max-w-7xl mx-auto my-8">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200 dark:bg-dark-surface hover:bg-gray-300 dark:hover:bg-dark-surface-alt absolute top-4 right-4 text-gray-800 dark:text-dark-text"
        title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <h1 className="text-2xl font-bold mb-4">Development Progress Tracker</h1>

      {/* Project Name Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-2 border dark:border-dark-border rounded bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
          placeholder="Enter project name"
        />
      </div>

      {/* Team Members Section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Team Members</h2>
        {teamMembers.map((member, index) => (
          <div key={index} className="flex mb-2 items-center">
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) => updateTeamMember(index, "name", e.target.value)}
              className="mr-2 p-2 border dark:border-dark-border rounded flex-1 bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
            />
            <input
              type="text"
              placeholder="Role"
              value={member.role}
              onChange={(e) => updateTeamMember(index, "role", e.target.value)}
              className="p-2 border dark:border-dark-border rounded flex-1 bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
            />
            <button
              onClick={() => removeTeamMember(index)}
              className="text-red-500 dark:text-dark-danger hover:bg-red-100 dark:hover:bg-opacity-20 dark:hover:bg-dark-danger p-1 rounded ml-2"
              disabled={teamMembers.length <= 1}
              title={
                teamMembers.length <= 1
                  ? "Cannot remove the last team member"
                  : "Remove team member"
              }
            >
              <UserX size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={addTeamMember}
          className="bg-blue-500 dark:bg-dark-primary text-white dark:text-dark-text p-2 rounded flex items-center hover:bg-blue-600 dark:hover:bg-opacity-90"
        >
          <Plus className="mr-2" /> Add Team Member
        </button>
      </div>

      {/* Tasks Section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Daily Tasks</h2>
        {tasks.map((taskDate, dateIndex) => (
          <div
            key={dateIndex}
            className="border dark:border-dark-border p-4 mb-2 rounded bg-white dark:bg-dark-surface"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Calendar
                  className="mr-2 text-gray-500 dark:text-dark-text-muted"
                  size={18}
                />
                <input
                  type="date"
                  value={formatDateForInput(taskDate.date)}
                  onChange={(e) => {
                    // Convert from YYYY-MM-DD to locale date string
                    const date = new Date(e.target.value);
                    updateTaskDate(dateIndex, date.toLocaleDateString());
                  }}
                  className="p-1 border dark:border-dark-border rounded mr-2 bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
                />
                <span className="font-medium">{taskDate.date}</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => removeTaskDate(dateIndex)}
                  className="text-red-500 dark:text-dark-danger hover:bg-red-100 dark:hover:bg-opacity-20 dark:hover:bg-dark-danger p-1 rounded mr-2"
                  disabled={tasks.length <= 1}
                  title={
                    tasks.length <= 1
                      ? "Cannot remove the last date"
                      : "Remove all tasks for this date"
                  }
                >
                  <CalendarX size={16} />
                </button>
                <button
                  onClick={() => addTaskToDate(dateIndex)}
                  className="bg-green-500 dark:bg-dark-success text-white dark:text-dark-text p-1 rounded flex items-center hover:bg-green-600 dark:hover:bg-opacity-90"
                >
                  <Plus className="mr-1" /> Add Task
                </button>
              </div>
            </div>

            {taskDate.items.map((task, taskIndex) => (
              <div
                key={taskIndex}
                className="mb-4 p-2 bg-gray-50 dark:bg-dark-surface-alt rounded"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Task {taskIndex + 1}</h4>
                  <button
                    onClick={() => removeTask(dateIndex, taskIndex)}
                    className="text-red-500 dark:text-dark-danger hover:bg-red-100 dark:hover:bg-opacity-20 dark:hover:bg-dark-danger p-1 rounded"
                  >
                    <ListX size={16} />
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
                    className="p-2 border dark:border-dark-border rounded bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
                  />
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTask(dateIndex, taskIndex, "status", e.target.value)
                    }
                    className="p-2 border dark:border-dark-border rounded bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
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
                  className="w-full p-2 border dark:border-dark-border rounded mt-2 bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
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
                    className="p-2 border dark:border-dark-border rounded bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
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
                    className="p-2 border dark:border-dark-border rounded bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
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
          className="bg-blue-500 dark:bg-dark-primary text-white dark:text-dark-text p-2 rounded flex items-center hover:bg-blue-600 dark:hover:bg-opacity-90"
        >
          <Plus className="mr-2" /> Add Date
        </button>
      </div>

      {/* Report Generation Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={generateTXTReport}
          className="bg-red-500 dark:bg-dark-danger text-white dark:text-dark-text p-2 rounded flex items-center hover:bg-red-600 dark:hover:bg-opacity-90"
        >
          <Download className="mr-2" /> Generate TXT
        </button>
        <button
          onClick={generatePDF}
          className="bg-purple-500 dark:bg-dark-secondary text-white dark:text-dark-text p-2 rounded flex items-center hover:bg-purple-600 dark:hover:bg-opacity-90"
        >
          <Download className="mr-2" /> Generate PDF
        </button>
      </div>
    </div>
  );
};

export default DevelopmentProgressTracker;
