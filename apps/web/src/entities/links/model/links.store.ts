import type { Link } from "~shared/api/backend";

import { useToast } from "@links/ui";
import { defineStore } from "pinia";
import { ref } from "vue";
import { LinksApi } from "~shared/api/backend";
import { useConfirmation } from "~shared/ui/confirmation-dialog";

export const useLinksStore = defineStore("links", () => {
  /* State */
  const _links = ref<Link[]>([]);

  /* Getters */
  const links = computed(() => _links.value);

  /* Actions */
  async function updateLink(params: {
    id: string;
    title: string;
    blocks: unknown[];
    seo: Record<string, unknown>;
    background: string;
    status: any;
    imageFileIds?: string[];
  }) {
    const { toast } = useToast();
    const { createConfirmation } = useConfirmation();
    const confirm = createConfirmation({
      title: "Update link",
      content: "Are you sure you want to update the link?",
    });

    const { data } = await confirm();
    if (data) {
      try {
        await LinksApi.updateContent({
          id: params.id,
          blocks: params.blocks,
          background: params.background,
          status: params.status,
          imageFileIds: params.imageFileIds,
        });
        await LinksApi.updateMetadata({
          id: params.id,
          title: params.title,
          seo: params.seo,
          status: params.status,
        });
        toast({
          title: "Succes",
          content: "The link is successfully updated",
          variant: "success",
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast({
            title: "Saving error",
            content: e.message,
            variant: "error",
          });
        }
      }
    }
  }
  async function deleteLink(id: string) {
    const { toast } = useToast();
    const { createConfirmation } = useConfirmation();
    const confirm = createConfirmation({
      title: "Delete link",
      content: "Are you sure to delete selected link?",
    });

    const { data } = await confirm();
    if (data) {
      try {
        await LinksApi.deleteLink(id);
        toast({
          title: "Succes",
          content: "The link deleted successfully",
          variant: "success",
        });
        await refreshLinksList();
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast({
            title: "Deletion error",
            content: e.message,
            variant: "error",
          });
        }
      }
    }
  }
  async function refreshLinksList() {
    const data = await LinksApi.listLinks();
    _links.value = data;
  }

  return {
    links,
    refreshLinksList,
    deleteLink,
    updateLink,
  };
});
