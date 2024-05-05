import { defineStore } from "pinia";
import { ref } from "vue";
import type { ILinkPageDocument } from "~shared/api/appwrite";
import { LinksApi } from "~shared/api/appwrite";

export const useLinksStore = defineStore("links", () => {
  /* State */
  const _links = ref<ILinkPageDocument[]>([]);

  /* Getters */
  const links = computed(() => _links.value);

  /* Actions */
  async function getLinksList() {
    const data = await LinksApi.listLinks();
    _links.value = data.documents;
  }

  /* Setup */
  if (import.meta.client)
    getLinksList();

  return {
    links,
  };
});
