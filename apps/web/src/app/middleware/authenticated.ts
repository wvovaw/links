import { SessionModel } from "~entities/session";

export default defineNuxtRouteMiddleware((to) => {
  const { isLogedIn } = SessionModel.useSessionStore();

  if (!isLogedIn && to.path !== "sign-in")
    return navigateTo("/sign-in");
},
);
