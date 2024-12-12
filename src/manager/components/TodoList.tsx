import React, { useState } from "react";
import { Pagination, Input, Card, Button, Tag } from "antd";
import { observer } from "mobx-react";
import { ITodo } from "../interfaces/ITodo";
import { styles } from "../styles /styles";
import { TodoItem } from "./TodoItem";

interface ITodoListProps {
	todos: ITodo[];
	editTodoId: number | null;
	editText: string;
	searchText: string;
	toggleCompletion: (id: number) => void;
	editTodo: (id: number) => void;
	saveEditedTodo: () => void;
	cancelEdit: () => void;
	setEditText: (value: string) => void;
	deleteTodo: (id: number) => void;
	setSearchText: (text: string) => void;
}

export const TodoList: React.FC<ITodoListProps> = observer(
	({
		todos,
		editTodoId,
		editText,
		searchText,
		toggleCompletion,
		editTodo,
		saveEditedTodo,
		cancelEdit,
		setEditText,
		deleteTodo,
		setSearchText,
	}) => {
		const [currentPage, setCurrentPage] = useState(1);
		const [pageSize, setPageSize] = useState(10);

		// Filter todos based on search text (text, date, or id)
		const filteredTodos = todos.filter(
			todo =>
				todo.text.includes(searchText) || todo.dueDate.includes(searchText) || todo.id.toString().includes(searchText)
		);

		// Sort todos by urgency (earliest date first)
		const sortedTodos = filteredTodos.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

		// Handle pagination
		const startIndex = (currentPage - 1) * pageSize;
		const paginatedTodos = sortedTodos.slice(startIndex, startIndex + pageSize);

		// Pagination change handler
		const handlePageChange = (page: number, newPageSize?: number) => {
			setCurrentPage(page);
			if (newPageSize) {
				setPageSize(newPageSize);
			}
		};

		return (
			<div style={styles.container}>
				{/* Search Input */}
				<Input
					placeholder="Search todos by text, date, or ID"
					value={searchText}
					onChange={e => setSearchText(e.target.value)}
					style={styles.searchInput}
				/>

				{/* Todo List */}
				<div style={styles.taskList}>
					{paginatedTodos.length === 0 ? (
						<p>No todos available</p>
					) : (
						paginatedTodos.map(todo => (
							<Card key={todo.id} style={styles.todoCard}>
								<div style={styles.todoHeader}>
									<Tag color="blue">{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No Due Date"}</Tag>
									<Button type="primary" onClick={() => toggleCompletion(todo.id)} style={styles.toggleButton}>
										{todo.completed ? "Undo" : "Complete"}
									</Button>
								</div>
								<TodoItem
									todo={todo}
									editTodoId={editTodoId}
									editText={editText}
									toggleCompletion={toggleCompletion}
									editTodo={editTodo}
									saveEditedTodo={saveEditedTodo}
									cancelEdit={cancelEdit}
									setEditText={setEditText}
									deleteTodo={deleteTodo}
								/>
							</Card>
						))
					)}
				</div>

				{/* Pagination */}
				{filteredTodos.length > 0 && (
					<Pagination
						total={filteredTodos.length}
						pageSize={pageSize}
						current={currentPage}
						onChange={handlePageChange}
						pageSizeOptions={["10", "20", "50", "100"]}
						showSizeChanger
						onShowSizeChange={(_, size) => setPageSize(size)}
					/>
				)}
			</div>
		);
	}
);
