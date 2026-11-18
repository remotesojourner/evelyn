export const REDDIT_ORIGIN = "https://oauth.reddit.com/*";

const getPermissionsApi = () =>
	(globalThis as any).browser?.permissions || chrome.permissions;

const callPermissionMethod = (
	method: "contains" | "request",
	origin: string
): Promise<boolean | null> => {
	const permissionsApi = getPermissionsApi();
	if (!permissionsApi?.[method]) return Promise.resolve(null);

	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (value: boolean | null) => {
			if (!settled) {
				settled = true;
				resolve(value);
			}
		};

		try {
			const maybePromise = permissionsApi[method](
				{ origins: [origin] },
				(granted: boolean) => {
					if (chrome.runtime.lastError || typeof granted !== "boolean") {
						finish(null);
					} else {
						finish(granted);
					}
				}
			);
			if (maybePromise && typeof maybePromise.then === "function") {
				maybePromise.then(
					(granted: unknown) =>
						finish(typeof granted === "boolean" ? granted : null),
					(err: unknown) => {
						if (!settled) {
							settled = true;
							reject(err);
						}
					}
				);
			}
		} catch {
			// Firefox's browser.permissions throws if passed a callback; retry promise-only.
			try {
				permissionsApi[method]({ origins: [origin] }).then(
					(granted: unknown) =>
						finish(typeof granted === "boolean" ? granted : null),
					(err: unknown) => {
						if (!settled) {
							settled = true;
							reject(err);
						}
					}
				);
			} catch (err) {
				reject(err);
			}
		}
	});
};

/** Checks whether the extension currently holds host permission for `origin`. */
export const hasOriginPermission = (origin: string): Promise<boolean | null> =>
	callPermissionMethod("contains", origin).catch(() => null);

/** Requests host permission for `origin` from within a user-gesture handler. */
export const requestOriginPermission = (origin: string): Promise<boolean | null> =>
	callPermissionMethod("request", origin);
