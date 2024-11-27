import { observer } from "mobx-react-lite";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Index } from "./index";

export const Router: React.FC = observer(() => (
	<HashRouter>
		<Routes>
			<Route path="/" element={<Index />} />
		</Routes>
	</HashRouter>
));
