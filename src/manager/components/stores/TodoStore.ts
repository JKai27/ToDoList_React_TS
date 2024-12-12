import { makeAutoObservable } from "mobx";
import { ITodo } from "src/manager/interfaces/ITodo";
import moment from "moment";

class TodoStore {
	public todos: ITodo[] = [];
	public editTodoId: number | null = null;
	public editText: string = "";
	public newTodo: string = "";
	public description: string = "";
	public searchText: string = "";
	public dueDate: string = "";
	public currentPage: number = 1;
	public pageSize: number = 10;

	constructor() {
		makeAutoObservable(this);
		this.loadTodos();
	}

	// Set current page
	public setCurrentPage(page: number) {
		this.currentPage = page;
	}

	// Set page size
	public setPageSize(size: number) {
		this.pageSize = size;
	}

	// Validate the new todo
	public validateNewTodo(): boolean {
		if (!this.newTodo.trim()) {
			alert("Todo text cannot be empty.");
			return false;
		}

		const isDuplicate = this.todos.some(todo => todo.text.toLowerCase() === this.newTodo.trim().toLowerCase());
		if (isDuplicate) {
			alert("This task already exists.");
			return false;
		}

		return true;
	}

	// Add a new todo
	public addTodo() {
		if (!this.validateNewTodo()) {
			return;
		}

		// Check if dueDate is a valid date
		const formattedDueDate =
			this.dueDate && moment(this.dueDate, "YYYY-MM-DD", true).isValid() ? this.dueDate : moment().format("YYYY-MM-DD");

		const newTask: ITodo = {
			id: Date.now(),
			text: (this.newTodo || "").trim(),
			completed: false,
			dueDate: formattedDueDate,
			description: (this.description || "").trim(),
		};

		this.todos.push(newTask);

		// Recalculate pagination and navigate to the last page
		const totalPages = Math.ceil(this.filteredTodos.length / this.pageSize);
		this.setCurrentPage(totalPages);

		// Clear the input fields after adding
		this.newTodo = "";
		this.description = "";
		this.dueDate = "";

		this.saveTodos();
	}

	// Toggle completion status of a todo
	public toggleCompletion(id: number) {
		const todo = this.todos.find(t => t.id === id);
		if (todo) {
			todo.completed = !todo.completed;
			this.saveTodos();
		}
	}

	// Edit a todo
	public editTodo(id: number) {
		const todoToEdit = this.todos.find(t => t.id === id);
		if (todoToEdit) {
			this.editTodoId = id;
			this.editText = todoToEdit.text;
			this.description = todoToEdit.description || "";
			this.dueDate = todoToEdit.dueDate || "";
		}
	}

	// Save edited todo
	public saveEditedTodo() {
		if (this.editTodoId !== null && this.editText.trim() !== "") {
			const isDuplicate = this.todos.some(
				todo => todo.text.toLowerCase() === this.editText.trim().toLowerCase() && todo.id !== this.editTodoId
			);

			if (isDuplicate) {
				alert("This task already exists.");
				return;
			}

			const todo = this.todos.find(t => t.id === this.editTodoId);
			if (todo) {
				// Check if the updated due date is a valid date and not in the past
				const formattedDueDate = this.dueDate
					? moment(this.dueDate, "YYYY-MM-DD", true).isValid() && moment(this.dueDate).isSameOrAfter(moment(), "day")
						? moment(this.dueDate).format("YYYY-MM-DD")
						: null
					: todo.dueDate; // Retain previous due date if empty input

				if (!formattedDueDate) {
					alert("Due date cannot be in the past.");
					return;
				}

				// Update todo properties
				todo.text = this.editText.trim();
				todo.description = this.description.trim();
				todo.dueDate = formattedDueDate;

				// Reset editing fields
				this.editTodoId = null;
				this.editText = "";
				this.description = "";
				this.dueDate = "";

				this.saveTodos();
			}
		} else {
			alert("Todo name cannot be empty.");
		}
	}

	// Cancel editing
	public cancelEdit() {
		this.editTodoId = null;
		this.editText = "";
	}

	// Delete completed todos
	public deleteCompletedTasks() {
		this.todos = this.todos.filter(todo => !todo.completed);
		this.saveTodos(); // Save todos after deletion
	}

	// Delete a specific todo
	public deleteTodo(id: number) {
		this.todos = this.todos.filter(todo => todo.id !== id);
		this.saveTodos(); // Save todos after deletion
	}
	// Check if all todos are completed
	get allCompleted() {
		return this.todos.every(todo => todo.completed);
	}

	// Toggle completion of all todos
	public toggleAllCompleted() {
		const allCompleted = this.allCompleted;
		this.todos.forEach(todo => (todo.completed = !allCompleted));
		this.saveTodos();
	}

	// Mark all todos as completed
	public markAllCompleted() {
		this.todos.forEach(todo => (todo.completed = true));
		this.saveTodos();
	}

	// Sort todos alphabetically in ascending order
	public sortAscending() {
		this.todos = [...this.todos].sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
		this.saveTodos();
	}

	// Sort todos alphabetically in descending order
	public sortDescending() {
		this.todos = [...this.todos].sort((a, b) => b.text.toLowerCase().localeCompare(a.text.toLowerCase()));
		this.saveTodos();
	}

	// Sort todos by due date (earlier dates first)
	public sortByDueDate() {
		this.todos = [...this.todos].sort((a, b) => {
			const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
			const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
			return dateA - dateB; // Sort ascending (earlier dates first)
		});
		this.saveTodos(); // Save the sorted order
	}

	public updateDueDate(id: number, newDueDate: string) {
		if (isNaN(Date.parse(newDueDate))) {
			alert("Invalid date format.");
			return;
		}

		const today = new Date();
		const selectedDate = new Date(newDueDate);

		// Ensure the due date is not in the past
		if (selectedDate.getTime() < today.setHours(0, 0, 0, 0)) {
			alert("Due date cannot be in the past.");
			return;
		}

		const todo = this.todos.find(t => t.id === id);
		if (todo) {
			todo.dueDate = newDueDate;
			this.saveTodos(); // Save todos after updating due date
		} else {
			alert("Todo not found.");
		}
	}

	// Save todos to local storage
	public saveTodos() {
		localStorage.setItem("todos", JSON.stringify(this.todos));
	}

	// Load todos from local storage
	public loadTodos() {
		const savedTodos = localStorage.getItem("todos");
		if (savedTodos) {
			this.todos = JSON.parse(savedTodos) as ITodo[];
		}
	}

	// Search todos
	get filteredTodos() {
		const search = this.searchText.toLowerCase();
		return this.todos.filter(
			t =>
				t.text.toLowerCase().includes(search) ||
				t.description?.toLowerCase().includes(search) ||
				t.dueDate?.toLowerCase().includes(search)
		);
	}

	// Get count of incomplete tasks
	get incompleteCount() {
		return this.todos.filter(todo => !todo.completed).length;
	}

	// Paginate todos (based on currentPage and pageSize)
	get paginatedTodos() {
		const startIndex = (this.currentPage - 1) * this.pageSize;
		const endIndex = startIndex + this.pageSize;
		return this.filteredTodos.slice(startIndex, endIndex);
	}

	// Notify user of upcoming tasks
	public notifyUpcomingTasks() {
		const today = new Date();
		this.todos.forEach(todo => {
			const dueDate = new Date(todo.dueDate);
			if (!todo.completed && dueDate.getTime() - today.getTime() < 2 * 24 * 60 * 60 * 1000) {
				alert(`Task "${todo.text}" is due soon!`);
			}
		});
	}
}

export const todoStore = new TodoStore();
