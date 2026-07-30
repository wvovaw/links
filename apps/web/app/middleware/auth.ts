import { SessionModel } from "~entities/session";

export default defineNuxtRouteMiddleware(() => {
  const sessionStore = SessionModel.useSessionStore();

  if (!sessionStore.isLogedIn) return navigateTo("/sign-in");
});
