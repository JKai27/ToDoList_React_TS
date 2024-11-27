import ReactDOM from "react-dom/client";
import React from "react";
import { Index } from "./manager/components";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<Index />
	</React.StrictMode>
);
