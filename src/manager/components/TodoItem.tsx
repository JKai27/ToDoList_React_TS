import { observer } from "mobx-react-lite";
import React from "react";
import { ITodo } from "../interfaces/ITodo";
import { styles } from "../styles /styles";

interface ITodoItemProps {
	todo: ITodo;
	editTodoId: number | null;
	editText: string;
	toggleCompletion: (id: number) => void;
	editTodo: (id: number) => void;
	saveEditedTodo: () => void;
	cancelEdit: () => void;
	setEditText: (value: string) => void;
	deleteTodo: (id: number) => void;
}

export const TodoItem: React.FC<ITodoItemProps> = observer(
	({ todo, editTodoId, editText, toggleCompletion, editTodo, saveEditedTodo, cancelEdit, setEditText, deleteTodo }) => (
		<li style={styles.task}>
			<div style={styles.taskContent}>
				{/* Editable Title */}
				{editTodoId === todo.id ? (
					<input
						type="text"
						value={editText}
						onChange={e => setEditText(e.target.value)}
						style={styles.input}
						onKeyDown={e => {
							if (e.key === "Enter") {
								saveEditedTodo();
							}
						}}
					/>
				) : (
					<div>
						<span
							style={{
								textDecoration: todo.completed ? "line-through" : "none",
								fontWeight: "bold",
							}}
						>
							{todo.text}
						</span>

						{/* Display Date */}
						<p style={{ fontSize: "12px", color: "#555" }}>
							<strong>Date:</strong> {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No due date"}
						</p>

						{/* Display Description */}
						<p style={{ fontSize: "14px", color: "#777" }}>
							<strong>Description:</strong> {todo.description?.trim() ? todo.description : "No description provided"}
						</p>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div style={styles.buttonContainer}>
				<button
					onClick={() => toggleCompletion(todo.id)}
					style={styles.button}
					aria-label={todo.completed ? "Mark as Uncompleted" : "Mark as Completed"}
				>
					{todo.completed ? "Mark as Uncompleted" : "Mark as Completed"}
				</button>

				{/* Edit and Save Options */}
				{editTodoId === todo.id ? (
					<>
						<button onClick={saveEditedTodo} style={styles.button}>
							Save
						</button>
						<button onClick={cancelEdit} style={styles.button}>
							Cancel Editing
						</button>
					</>
				) : (
					<button onClick={() => editTodo(todo.id)} style={styles.button}>
						Edit
					</button>
				)}

				{/* Delete Button */}
				{todo.completed && editTodoId !== todo.id && (
					<button onClick={() => deleteTodo(todo.id)} style={{ ...styles.button, ...styles.buttonDanger }}>
						Delete
					</button>
				)}
			</div>
		</li>
	)
);
