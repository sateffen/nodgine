
(function() {
	"use strict";
	Object.defineProperty(GLOBAL, "$APPLICATION", {
		value	: require("./Controller/Application.js"),
		writable: false
	});
	Object.defineProperty(GLOBAL, "$ROUTER", {
		value	: require("./Controller/Router.js"),
		writable: false
	});
	Object.defineProperty(GLOBAL, "$LOGGER", {
		value	: require("./Controller/Logger.js"),
		writable: false
	});
	
})();