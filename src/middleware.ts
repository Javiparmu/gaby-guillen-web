import { defineMiddleware } from "astro/middleware";
import { adminPassword, adminUsername } from "./utils/constants";

export const onRequest = defineMiddleware((context, next) => {
    const pathname = context.url.pathname;

    if (pathname.startsWith("/34c83614")) {
        const { value: session } = context.cookies.get("session") ?? {};

        const { username, password } = JSON.parse(session ?? "{}");

        if (username === adminUsername && password === adminPassword && (pathname === "/34c83614" || pathname === "/34c83614/")) {
            return context.redirect("/34c83614/dashboard");
        } else if ((username !== adminUsername || password !== adminPassword) && (pathname === "/34c83614/dashboard" || pathname === "/34c83614/dashboard/")) {
            return context.redirect("/34c83614");
        }
    }

    return next();
});