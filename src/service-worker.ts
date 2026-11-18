import { hasOriginPermission } from "common/permissions";

export interface FetchRequest {
	method: "GET" | "POST";
	url: string;
}

export interface OpenOptionsRequest {
	action: "OPEN_OPTIONS";
}

export type WorkerRequest = FetchRequest | OpenOptionsRequest;

export interface FetchResponse {
	error?: string;
	data?: any;
}

const BASE_URL = "https://oauth.reddit.com";

chrome.runtime.onMessage.addListener(
	(request: WorkerRequest, _, sendResponse) => {
		if ("action" in request && request.action === "OPEN_OPTIONS") {
			const runtimeApi =
				(globalThis as any).browser?.runtime || chrome.runtime;
			runtimeApi.openOptionsPage();
			sendResponse({ data: true });
			return false;
		}

		const fetchReq = request as FetchRequest;
		fetch(BASE_URL + fetchReq.url, {
			credentials: "include",
			method: fetchReq.method,
			headers: { Accept: "application/json" },
		})
			.then(async (res) => {
				const text = await res.text();
				if (
					res.status === 401 ||
					res.status === 403 ||
					text.trimStart().startsWith("<")
				) {
					sendResponse({ error: "AUTH_REQUIRED" });
					return;
				}
				if (!res.ok) {
					sendResponse({ error: `HTTP ${res.status}` });
					return;
				}
				sendResponse({ data: JSON.parse(text) });
			})
			.catch(async (error) => {
				const granted = await hasOriginPermission(`${BASE_URL}/*`);
				if (granted === false) {
					sendResponse({ error: "PERMISSION_REQUIRED" });
					return;
				}
				sendResponse({ error: String(error) });
			});

		return true;
	}
);

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
