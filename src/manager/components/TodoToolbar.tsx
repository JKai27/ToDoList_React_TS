import React from "react";
import { styles } from "../styles /styles";

interface ITodoToolbarProps {
	deleteCompletedTasks: () => void;
	sortAscending: () => void;
	sortDescending: () => void;
	markAllCompleted: () => void;
}

export const TodoToolbar: React.FC<ITodoToolbarProps> = ({
	deleteCompletedTasks,
	sortAscending,
	sortDescending,
	markAllCompleted,
}) => (
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
);
