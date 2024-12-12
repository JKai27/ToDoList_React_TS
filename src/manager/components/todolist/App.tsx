import React from "react";
import { observer } from "mobx-react-lite";
import {
	Button,
	Tooltip,
	Input,
	List,
	Typography,
	Space,
	Modal,
	Badge,
	message,
	Checkbox,
	DatePicker,
	Pagination,
	Dropdown,
	Menu,
	Collapse,
} from "antd";
import { DownOutlined, EditOutlined } from "@ant-design/icons";

import moment from "moment";
import { todoStore } from "../stores/TodoStore"; // Adjust the path as per your project structure

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const App: React.FC = observer(() => {
	const handleAddTodo = () => {
		if (!todoStore.newTodo.trim()) {
			void message.error("Todo text cannot be empty");
			return;
		}
		todoStore.addTodo();
		void message.success("Todo added successfully!");
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		todoStore.searchText = e.target.value;
	};

	const handleSortByDueDate = () => {
		todoStore.sortByDueDate();
		void message.info("Sorted by due date");
	};

	const handleMenuClick = (key: string) => {
		if (key === "ascending") {
			todoStore.sortAscending();
		} else if (key === "descending") {
			todoStore.sortDescending();
		}
	};

	const menu = (
		<Menu
			onClick={({ key }) => handleMenuClick(key)}
			items={[
				{ key: "ascending", label: "Sort Ascending" },
				{ key: "descending", label: "Sort Descending" },
			]}
		/>
	);

	const handleDeleteCompletedTasks = () => {
		Modal.confirm({
			title: "Are you sure?",
			content: "This will delete all completed tasks.",
			onOk: () => {
				todoStore.deleteCompletedTasks();
				void message.success("Completed tasks deleted");
			},
		});
	};

	return (
		<div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
			{/* Header */}
			<div
				style={{
					position: "fixed",
					top: "0",
					left: "0",
					width: "100%",
					backgroundColor: "#228B22",
					color: "#fff",
					textAlign: "center",
					padding: "10px 0",
					fontSize: "16px",
					zIndex: 1000,
				}}
			>
				<Typography.Title level={2} style={{ margin: 0, fontWeight: "bold", color: "#fff" }}>
					Todo List
				</Typography.Title>
			</div>
			<div style={{ paddingTop: "60px" }}></div>

			{/* Add Todo Form */}
			<Space direction="vertical" style={{ width: "100%" }}>
				<Input
					value={todoStore.newTodo}
					onChange={e => (todoStore.newTodo = e.target.value)}
					placeholder="Add a new task"
					onPressEnter={handleAddTodo}
					style={{ marginBottom: "12px" }}
				/>
				<TextArea
					value={todoStore.description}
					onChange={e => (todoStore.description = e.target.value)}
					placeholder="Description (optional)"
					autoSize
					style={{ marginBottom: "12px" }}
				/>
				<DatePicker
					value={todoStore.dueDate ? moment(todoStore.dueDate, "YYYY-MM-DD") : null} // Display date in ISO format
					onChange={date => {
						// When the date changes, format it to ISO format (YYYY-MM-DD) or reset if cleared
						todoStore.dueDate = date ? date.format("YYYY-MM-DD") : "";
					}}
					style={{ width: "100%", marginBottom: "12px" }}
					placeholder="Select due date"
					disabledDate={current => current && current < moment().startOf("day")} // Disable past dates
				/>
				<Input
					placeholder="Search todos by name, due date, or description"
					value={todoStore.searchText}
					onChange={handleSearch}
					allowClear
					style={{ marginBottom: "20px" }}
				/>
				<Button type="primary" onClick={handleAddTodo}>
					Add Todo
				</Button>
				<Tooltip title="Sort the taks by priority, tasks on earlier dates are placed first">
					<Button onClick={handleSortByDueDate} style={{ marginTop: "20px" }}>
						Sort by Due Date
					</Button>
				</Tooltip>
			</Space>

			{/* Action Buttons */}
			<Space style={{ margin: "20px 0" }}>
				<Dropdown overlay={menu}>
					<Button>
						Sort <DownOutlined />
					</Button>
				</Dropdown>
				;
				<Tooltip title={todoStore.allCompleted ? "Unmark all tasks as incomplete" : "Mark all tsaks as completed"}>
					<Button onClick={() => todoStore.toggleAllCompleted()} style={{ marginRight: "10px" }}>
						{todoStore.allCompleted ? "Unmark All Completed" : "Mark All Completed"}
					</Button>
				</Tooltip>
				<Tooltip title="Delete individual or all completed tasks">
					<Button danger onClick={handleDeleteCompletedTasks}>
						Delete Completed
					</Button>
				</Tooltip>
			</Space>

			{/* Todo List */}
			<List
				bordered
				dataSource={todoStore.paginatedTodos} // Show only paginated todos
				renderItem={todo => (
					<List.Item
						style={{
							borderRadius: "8px",
							marginBottom: "10px",
							backgroundColor: todo.completed ? "#e6f7ff" : "#ffffff", // Highlight completed tasks
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
						}}
					>
						<div style={{ width: "100%" }}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								{/* Todo Text and Checkbox */}
								<div style={{ display: "flex", alignItems: "center", flex: 1 }}>
									<Checkbox
										checked={todo.completed}
										onChange={() => todoStore.toggleCompletion(todo.id)}
										style={{ marginRight: "10px" }}
									/>
									<Text
										delete={todo.completed} // Strike-through text if completed
										style={{ cursor: "pointer", flex: 1, fontWeight: "bold" }}
										onClick={() => todoStore.toggleCompletion(todo.id)}
									>
										{todo.text}
									</Text>
								</div>

								{/* Edit Button */}
								<Tooltip title="Edit Todo">
									<Button
										type="link"
										icon={<EditOutlined />}
										onClick={() => todoStore.editTodo(todo.id)}
										style={{
											marginLeft: "10px",
											color: "#1890ff",
											padding: "0",
											fontSize: "16px",
										}}
									/>
								</Tooltip>
							</div>

							{/* Description */}
							{todo.description && (
								<Collapse defaultActiveKey={["1"]}>
									<Panel header="Description" key="1" style={{ padding: "10px 20px" }}>
										<Paragraph type="secondary" style={{ margin: "5px 0" }}>
											{todo.description}
										</Paragraph>
									</Panel>
								</Collapse>
							)}

							{/* Due Date */}
							{todo.dueDate && (
								<Typography.Paragraph
									type="secondary"
									style={{
										margin: "5px 0",
										paddingLeft: "20px",
										fontStyle: "italic",
									}}
								>
									<strong>Due Date:</strong> {todo.dueDate}
								</Typography.Paragraph>
							)}
						</div>
					</List.Item>
				)}
			/>

			{/* Pagination */}
			<Pagination
				current={todoStore.currentPage}
				pageSize={todoStore.pageSize}
				total={todoStore.filteredTodos.length} // Total filtered todos
				onChange={page => todoStore.setCurrentPage(page)}
				showSizeChanger
				pageSizeOptions={["10", "20", "50", "100"]}
				onShowSizeChange={(current, size) => todoStore.setPageSize(size)}
				style={{ marginTop: "20px", textAlign: "center" }}
			/>

			{/* Edit Todo Modal */}
			{todoStore.editTodoId !== null && (
				<Modal
					title="Edit Todo"
					visible={todoStore.editTodoId !== null}
					onOk={() => todoStore.saveEditedTodo()}
					onCancel={() => todoStore.cancelEdit()}
				>
					<Input
						value={todoStore.editText}
						onChange={e => (todoStore.editText = e.target.value)}
						placeholder="Update task name"
						style={{ marginBottom: "10px" }}
					/>
					<TextArea
						value={todoStore.description}
						onChange={e => (todoStore.description = e.target.value)}
						placeholder="Edit or add a description (optional)"
						autoSize
					/>
					<DatePicker
						value={todoStore.dueDate ? moment(todoStore.dueDate) : null}
						onChange={date => (todoStore.dueDate = date ? date.format("YYYY-MM-DD") : "")}
						placeholder="Edit due date"
						style={{ width: "100%" }}
					/>
				</Modal>
			)}

			{/* Incomplete Tasks Badge */}
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				<Text>Incomplete Tasks</Text>
				<Badge count={todoStore.incompleteCount} showZero />
			</div>
			<div style={{ paddingBottom: "80px" }}></div>

			{/* Footer */}
			<div
				style={{
					position: "fixed",
					bottom: "0",
					left: "0",
					width: "100%",
					backgroundColor: "#228B22",
					color: "#fff",
					textAlign: "center",
					padding: "10px 0",
					fontSize: "16px",
				}}
			>
				<Typography.Text>© 2024 Todo Application. All rights reserved.</Typography.Text>
			</div>
		</div>
	);
});

export { App };
