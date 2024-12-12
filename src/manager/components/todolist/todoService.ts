import axios from "axios";
import { ITodo } from "src/manager/interfaces/ITodo";

export const addTodo = async (todo: ITodo): Promise<ITodo> => {
	try {
		const response = await axios.post("http://localhost:8080/todos", todo);
		console.log("Todo added successfully:", response.data);
		return response.data; // This is the saved Todo object from the backend
	} catch (error) {
		console.log("Error adding todo:", error);
		throw error;
	}
};
