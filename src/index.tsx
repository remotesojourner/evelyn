import { createMemoryHistory } from "history";
import React from "react";
import { render } from "react-dom";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import { WATCH_INFO } from "common/elements";
import i18n from "common/i18n";
import Router from "router";
import configureStore from "store/configureStore";
import "styles/global.scss";

const history = createMemoryHistory();
const store = configureStore(history);

const renderRoot = (mountElement: HTMLElement) => {
	render(
		<I18nextProvider i18n={i18n}>
			<Provider store={store}>
				<Router history={history} />
			</Provider>
		</I18nextProvider>,
		mountElement
	);
};

const insertMountElement = (parent: Element) => {
	const element = document.createElement("div");
	element.id = "tube-mount";
	element.classList.add("standard-width-container");
	element.classList.add("row");
	parent.appendChild(element);

	return element;
};

const observer = new MutationObserver(() => {
	const watchInfoSection = document.getElementById(WATCH_INFO);
	if (watchInfoSection) {
		observer.disconnect();
		const mount = insertMountElement(watchInfoSection);
		renderRoot(mount);
	}
});

if (window.OPTIONS_PAGE) {
	renderRoot(document.getElementById("tube-mount")!);
} else {
	observer.observe(document.body, { childList: true, subtree: true });
}
