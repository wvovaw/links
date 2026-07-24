export default defineCachedEventHandler(async (e) => {
  const slug = getRouterParam(e, "link");
  if (!slug)
    return null;

  const config = useRuntimeConfig();
  try {
    const link = await $fetch(`/public/links/${slug}`, {
      baseURL: config.public.backendUrl,
    });
    return link;
  }
  catch {
    return null;
  }
});
