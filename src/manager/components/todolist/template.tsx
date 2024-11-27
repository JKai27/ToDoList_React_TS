import React, { useState, useCallback } from "react";
// Styles
const styles: { [key: string]: React.CSSProperties } = {
	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		minHeight: "100vh",
		backgroundColor: "#f0f0f0",
		padding: "20px",
	},
	todoApp: {
		backgroundColor: "#fff",
		padding: "20px",
		borderRadius: "8px",
		boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
		width: "100%",
		maxWidth: "1200px",
		margin: "0 auto", // Centers the todoApp within the container
		marginTop: "60px",
	},
	toolbar: {
		display: "flex",
		justifyContent: "flex-end", // Aligns toolbar buttons to the right
		gap: "10px",
		marginBottom: "20px",
	},
	button: {
		padding: "10px 15px",
		backgroundColor: "#4CAF50",
		color: "#fff",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		transition: "background-color 0.3 ease",
	},
	ButtonHover: {
		backgroundColor: "#45a049",
	},
	buttonContainer: {
		display: "flex",
		gap: "10px",
		alignItems: "center",
	},
	buttonDanger: {
		backgroundColor: "#e74c3c",
	},
	inputContainer: {
		display: "flex",
		marginBottom: "20px",
		width: "100%",
		gap: "10px",
	},
	input: {
		flex: 1,
		padding: "10px",
		fontSize: "16px",
		border: "1px solid #ccc",
		borderRadius: "4px",
		outline: "none",
		transition: "border-color 0.3s ease",
	},
	inputFocus: {
		borderColor: "#4CAF50",
	},
	taskList: {
		listStyle: "none",
		padding: 0,
		// marginBottom: "20px",
		margin: 0,
	},
	task: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between", // Keeps the task text and buttons at opposite ends
		padding: "10px",
		marginBottom: "10px",
		backgroundColor: "#f9f9f9",
		borderRadius: "4px",
		width: "100%", // Ensures the task spans the entire container width
		boxSizing: "border-box", // Ensures padding is included in the width
	},
	footer: {
		backgroundColor: "#4CAF50",
		color: "#fff",
		padding: "10px",
		textAlign: "center",
		width: "100%",
		position: "fixed",
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1000,
		borderRadius: "8px",
		fontWeight: "bolder",
	},
	header: {
		backgroundColor: "#4CAF50",
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		color: "#fff",
		padding: "10px",
		borderRadius: "8px",
		width: "100%",
		textAlign: "center",
		fontSize: "24px",
		zIndex: 1000, // Ensure it's above other elements
		fontWeight: "bold",
	},
};

interface ITodo {
	id: number;
	text: string;
	completed: boolean;
}

export const Template: React.FC = () => {
	const [todos, setTodos] = useState<ITodo[]>([]);
	const [newTodo, setNewTodo] = useState<string>("");

	// Add new task
	const addTodo = useCallback(() => {
		if (newTodo.trim().length > 0) {
			// Prevent duplicates (case-insensitive)
			const isDuplicate = todos.some(todo => todo.text.toLowerCase() === newTodo.trim().toLowerCase());
			if (isDuplicate) {
				alert("This task already exists.");
				return;
			}

			const newTask: ITodo = {
				id: Date.now(),
				text: newTodo.trim(),
				completed: false,
			};
			setTodos(prevTodos => [...prevTodos, newTask]);
			setNewTodo("");
		}
	}, [newTodo, todos]);

	// Toggle task completion
	const toggleCompletion = useCallback((id: number) => {
		setTodos(prevTodos => prevTodos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
	}, []);

	// Edit task
	const [editTodoId, setEditTodoId] = useState<number | null>(null); // To track the task being edited
	const [editText, setEditText] = useState<string>(""); // To store the edited task's text

	const editTodo = useCallback(
		(id: number) => {
			const taskToEdit = todos.find(todo => todo.id === id);
			if (taskToEdit) {
				setEditTodoId(id); // Set the task as being edited
				setEditText(taskToEdit.text); // Set the current task text in the input field
			}
		},
		[todos]
	);

	// Save the edited task
	const saveEditedTodo = useCallback(() => {
		if (editTodoId !== null && editText.trim() !== "") {
			// Prevent duplicate tasks (case-insensitive)
			const isDuplicate = todos.some(
				todo => todo.text.toLowerCase() === editText.trim().toLowerCase() && todo.id !== editTodoId
			);
			if (isDuplicate) {
				alert("This task already exists.");
				return;
			}

			// If no duplicates, update the Todo
			setTodos(prevTodos =>
				prevTodos.map(todo => (todo.id === editTodoId ? { ...todo, text: editText.trim() } : todo))
			);
			setEditTodoId(null); // Reset the edit state
			setEditText(""); // Clear the edit text field
		}
	}, [editTodoId, editText, todos]); // Dependency on todos to ensure it always uses the latest todos list- (beacause of useCallback)

	// Cancel editing
	const cancelEdit = useCallback(() => {
		setEditTodoId(null); // Reset the edit state
		setEditText(""); // Clear the edit text field
	}, []);

	// Delete selected completed tasks
	const deleteCompletedTasks = useCallback(() => {
		setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
	}, []);

	// Mark all tasks as completed
	const markAllCompleted = useCallback(() => {
		setTodos(prevTodos => prevTodos.map(todo => ({ ...todo, completed: true })));
	}, []);

	// Sort tasks in ascending alphabetical order
	const sortAscending = useCallback(() => {
		setTodos(prevTodos => [...prevTodos].sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase())));
	}, []);

	// Sort tasks in descending alphabetical order
	const sortDescending = useCallback(() => {
		setTodos(prevTodos => [...prevTodos].sort((a, b) => b.text.toLowerCase().localeCompare(a.text.toLowerCase())));
	}, []);

	// Count of incomplete tasks
	const incompleteCount = todos.filter(todo => !todo.completed).length;

	return (
		<div style={styles.container}>
			<header style={styles.header}>To-Do List</header>
			<div style={styles.todoApp}>
				{/* Input for new task */}
				<div style={styles.inputContainer}>
					<input
						type="text"
						value={newTodo}
						onChange={e => setNewTodo(e.target.value)}
						placeholder="Enter new task"
						style={styles.input}
						onKeyDown={e => {
							if (e.key === "Enter") {
								addTodo(); // Call the addTodo function when Enter key is pressed
							}
						}}
					/>
					<button onClick={addTodo} style={styles.button}>
						Add ToDo
					</button>
				</div>

				{/* Toolbar buttons */}
				<div style={styles.toolbar}>
					<button onClick={deleteCompletedTasks} style={{ ...styles.button, ...styles.buttonDanger }}>
						Delete Completed
					</button>
					<button onClick={sortAscending} style={styles.button}>
						Sort Ascending
					</button>
					<button onClick={sortDescending} style={styles.button}>
						Sort Descending
					</button>
					<button onClick={markAllCompleted} style={styles.button}>
						Mark All Completed
					</button>
				</div>

				{/* Task List */}
				<ul style={styles.taskList}>
					{todos.map(todo => (
						<li key={todo.id} style={styles.task}>
							<div style={styles.taskContent}>
								{/* If editing, show input field for task text */}
								{editTodoId === todo.id ? (
									<input
										type="text"
										value={editText}
										onChange={e => setEditText(e.target.value)}
										style={styles.input}
										onKeyDown={e => {
											if (e.key === "Enter") {
												saveEditedTodo(); // Save the task when Enter is pressed
											}
										}}
									/>
								) : (
									<span
										style={{
											textDecoration: todo.completed ? "line-through" : "none",
											flexGrow: 1, // Ensures the task text takes up available space
										}}
									>
										{todo.text}
									</span>
								)}
							</div>

							{/* Button Container for Mark as Complete, Edit, and Delete */}
							<div style={styles.buttonContainer}>
								<button onClick={() => toggleCompletion(todo.id)} style={styles.button}>
									{todo.completed ? "Mark as Uncompleted" : "Mark as Completed"}
								</button>

								{/* Edit button */}
								{editTodoId === todo.id ? (
									<>
										<button onClick={saveEditedTodo} style={styles.button}>
											Save
										</button>
									</>
								) : (
									<button onClick={() => editTodo(todo.id)} style={styles.button}>
										Edit
									</button>
								)}

								{/* Delete button, only visible if completed */}
								{todo.completed && (
									<button
										onClick={() => setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id))}
										style={{ ...styles.button, ...styles.buttonDanger }}
									>
										Delete
									</button>
								)}
							</div>
						</li>
					))}
				</ul>
				{/* Incomplete Task Count */}
				<div style={{ marginTop: "20px", textAlign: "center", marginBottom: "50px" }}>
					<p>{`Incomplete Tasks: ${incompleteCount}`}</p>
				</div>
			</div>

			{/* Footer */}
			<footer style={styles.footer}>
				<p>© {new Date().getFullYear()} example company. All rights reserved.</p>
			</footer>
		</div>
	);
};
