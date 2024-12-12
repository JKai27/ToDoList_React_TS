import React from "react";
import { observer } from "mobx-react";
import { styles } from "../styles /styles";

interface ITodoInputProps {
	newTodo: string;
	setNewTodo: (value: string) => void;
	description: string;
	setDescription: (value: string) => void;
	addTodo: () => void;
}

// Wrap the component in observer to make it reactive
export const ITodoInput: React.FC<ITodoInputProps> = observer(
	({ newTodo, setNewTodo, description, setDescription, addTodo }) => (
		<div style={styles.inputContainer}>
			<input
				type="text"
				value={newTodo}
				onChange={e => setNewTodo(e.target.value)}
				placeholder="Enter new task name"
				style={styles.input}
				onKeyDown={e => {
					if (e.key === "Enter") {
						addTodo();
					}
				}}
			/>
			<input
				type="text"
				value={description}
				onChange={e => setDescription(e.target.value)}
				placeholder="Enter description"
				style={styles.input}
				onKeyDown={e => {
					if (e.key === "Enter") {
						addTodo();
					}
				}}
			/>
			<button onClick={addTodo} style={styles.button}>
				Add ToDo
			</button>
		</div>
	)
);
