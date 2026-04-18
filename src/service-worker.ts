export interface FetchRequest {
	method: "GET" | "POST";
	url: string;
}

export interface FetchResponse {
	error?: string;
	data: any;
}

const BASE_URL = "https://www.reddit.com";

chrome.runtime.onMessage.addListener(
	(request: FetchRequest, _, sendResponse) => {
		fetch(BASE_URL + request.url, {
			credentials: "include",
			method: request.method,
			headers: { "Accept": "application/json" },
		})
			.then(async (res) => {
				if (!res.ok) {
					sendResponse({ error: `HTTP ${res.status}` });
					return;
				}
				const text = await res.text();
				if (text.trimStart().startsWith('<')) {
					sendResponse({ error: "AUTH_REQUIRED" });
					return;
				}
				sendResponse({ data: JSON.parse(text) });
			})
			.catch((error) => sendResponse({ error: String(error) }));

		return true;
	}
);

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
