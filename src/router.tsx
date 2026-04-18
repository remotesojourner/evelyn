import React from "react";
import { MemoryRouter } from "react-router-dom";

import { App } from "components/app";

export default () => (
	<MemoryRouter initialEntries={[window.OPTIONS_PAGE ? "/options" : "/comments"]}>
		<App />
	</MemoryRouter>
);
