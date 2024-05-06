import { useToast } from "@links/ui";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { ILinkPageDocument } from "~shared/api/appwrite";
import { LinksApi } from "~shared/api/appwrite";
import { useConfirmation } from "~shared/ui/confirmation-dialog";

export const useLinksStore = defineStore("links", () => {
  /* State */
  const _links = ref<ILinkPageDocument[]>([]);

  /* Getters */
  const links = computed(() => _links.value);

  /* Actions */
  async function deleteLink(id: string) {
    const { toast } = useToast();
    const { createConfirmation } = useConfirmation();
    const confirm = createConfirmation({
      title: "Delete link",
      content: "Are you sure to delete selected link?",
      onConfirm: () => true,
      onCancel: () => false,
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
        await getLinksList();
      }
      catch (e: unknown) {
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
  async function getLinksList() {
    const data = await LinksApi.listLinks();
    _links.value = data.documents;
  }

  /* Setup */
  if (import.meta.client)
    getLinksList();

  return {
    links,
    deleteLink,
  };
});
