// The new YouTube layout uses scoped styles, which breaks root-level class selectors for some reason.
// This loader does a little trickery to prepend an ID selector to every class selector in the CSS.
module.exports = function (content) {
	const opts = this.getOptions();
	content = content.replace(/\/\*# sourceMappingURL=.* \*\//g, "");
	return content.replace(/((?:^|\})\s*)([^{]*)(\{)/gm, (match, prefix, selectors, brace) => {
		const processed = selectors.replace(/(\.[^,]+)/g, `:global(${opts.prepend}) $1`);
		return prefix + processed + brace;
	});
};
