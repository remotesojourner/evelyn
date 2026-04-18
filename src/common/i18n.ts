import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18next.use(LanguageDetector).init({
	detection: { caches: [] },
	fallbackLng: "en",
	interpolation: { escapeValue: false },
	resources: {
		en: {
			comment: require("../translations/en/comment.json"),
			footer: require("../translations/en/footer.json"),
			options: require("../translations/en/options.json"),
			post: require("../translations/en/post.json"),
			reply: require("../translations/en/reply.json"),
			time: require("../translations/en/time.json"),
		},
	},
});

export default i18next;
