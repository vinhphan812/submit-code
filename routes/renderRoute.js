const express = require("express");

/**
 * @import("express")
 * @typedef { import("express").Application } Application
 * @typedef { import("express").RequestHandler } RequestHandler
 * @typedef { import("express").Router } Router
 * @typedef { import("express").IRoute } IRoute
 */

/**
 * is a function before in route
 * @typedef {{pattern?: string, handle: RequestHandler | RequestHandler[] , method?: String, routes?: Route[]}} Route
 * @type {object}
 */

/**
 * @typedef {{uses?: Route[], routes: Route[]}} Routes
 * @type {object}
 */

/**
 * init router by ExpressJS
 * @param {Routes} routes is a object config for router
 * @returns router for ExpressJS
 */
function render({ uses, routes }) {
	const app = express.Router();
	if (uses && uses.length > 0) {
		for (const use of uses) {
			if (use.pattern) app.use(use.pattern, use.handle);
			else app.use(use.handle);
		}
	}

	if (routes)
		for (const route of routes) {
			renderRoute(app, route);
		}
	return app;
}
/**
 *
 * @param {IRoute | Router} app
 * @param {Route} route
 */
function renderRoute(app, route) {
	if (route.method == "all" && !(app instanceof express.Router)) {
		// @ts-ignore
		const allRoute = app.route(route.pattern);
		if (route.handle) allRoute.all(route.handle);
		for (const child of route.routes) renderRoute(allRoute, child);
	} else {
		if (route.pattern)
			app[route.method || "get"](route.pattern, route.handle);
		else app[route.method || "get"](route.handle);
	}
}

module.exports = { render };
