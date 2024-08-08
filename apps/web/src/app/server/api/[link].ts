import { getLinkByLinkName } from "../utils/getLinkByLinkName";

export default defineCachedEventHandler(async (e) => {
  const linkName = getRouterParam(e, "link");

  if (linkName) {
    const link = await getLinkByLinkName(linkName);
    if (link)
      link.$nitroCachedAt = new Date();

    return link;
  }
}, {
  // name: "link"
  // maxAge: 60 * 60,
  // getKey: e => getRouterParam(e, "link")!,
  // TODO: Invalidate cache with await useStorage('cache').removeItem('nitro:handlers:link:linkName.json') where linkName is the value returned by getKey
});
