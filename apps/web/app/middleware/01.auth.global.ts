import { BackendApi } from "~shared/api";

export default defineNuxtRouteMiddleware(async (to) => {
  // hide guest only routes from authenticated users
  if (["/sign-up", "/sign-in"].includes(to.path)) {
    const session = await BackendApi.SessionApi.getCurrentSession();
    if (session)
      return navigateTo("/");
  }
});
