import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware((context, next) => {
    const pathname = context.url.pathname;

    if (pathname.startsWith("/admin")) {
        const { value: session } = context.cookies.get("session") ?? {};

        const { username, password } = JSON.parse(session ?? "{}");

        if (username === "admin" && password === "admin12345" && (pathname === "/admin" || pathname === "/admin/")) {
            return context.redirect("/admin/dashboard");
        } else if ((username !== "admin" || password !== "admin12345") && (pathname === "/admin/dashboard" || pathname === "/admin/dashboard/")) {
            return context.redirect("/admin");
        }
    }

    return next();
});