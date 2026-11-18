import React from "react";
import { render } from "react-dom";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import { WATCH_INFO } from "common/elements";
import i18n from "common/i18n";
import Router from "router";
import configureStore from "store/configureStore";
import "styles/global.scss";

const store = configureStore();

const renderRoot = (mountElement: HTMLElement) => {
	render(
		<I18nextProvider i18n={i18n}>
			<Provider store={store}>
				<Router />
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

const mountComments = () => {
	if (document.getElementById("tube-mount")) return true;

	const watchInfoSection = document.getElementById(WATCH_INFO);
	if (watchInfoSection) {
		const mount = insertMountElement(watchInfoSection);
		renderRoot(mount);
		return true;
	}

	return false;
};

if (window.OPTIONS_PAGE) {
	renderRoot(document.getElementById("tube-mount")!);
} else if (!mountComments()) {
	const observer = new MutationObserver(() => {
		if (mountComments()) {
			observer.disconnect();
		}
	});
	observer.observe(document.body || document.documentElement, {
		childList: true,
		subtree: true,
	});
}
