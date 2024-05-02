import { type VNode, ref } from "vue";

export interface IConfirmationDialog {
  title: string;
  subtitle: string;
  /** The body of the confirmation dialog window. Can be a string or a vue virtual dom */
  content?: string | VNode;
  /** Called on 'confirm' button push */
  onConfirm: Function;
  /** Called on 'cancel' button push */
  onCancel: Function;
}

const defaultConfirmationDialog = {
  title: "Confirmation",
  subtitle: "Additional confirmation needed",
  content: "Please, confirm your intent",
  onConfirm: () => { return true; },
  onCancel: () => { return false; },
};
const config = ref<IConfirmationDialog>(defaultConfirmationDialog);
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

export function useConfirmation() {
  function createConfirmation(params: Partial<IConfirmationDialog>) {
    Object.assign(config.value, params);

    config.value.onConfirm = () => {
      if (params.onConfirm)
        confirm(params.onConfirm());
      else confirm();
      config.value = defaultConfirmationDialog;
    };

    config.value.onCancel = () => {
      if (params.onCancel)
        cancel(params.onCancel());
      else cancel();
      config.value = defaultConfirmationDialog;
    };

    return reveal;
  }

  return {
    createConfirmation,
    show: isRevealed,
    config,
  };
}

/**
 * Example of use:
 *
 * import { useConfirmation } from "~shared/ui/confirmation-dialog";
 *
 *  const { createConfirmation } = useConfirmation();
 *
 *  const confirmation = createConfirmation({
 *    title: "Changes will be lost",
 *    subtitle: "You have unsaved changes",
 *    content: "Do you want to leave this page? Your unsaved changes won't be saved!",
 *    onConfirm() {
 *      return "confirm";
 *    },
 *    onCancel() {
 *      return "cancel";
 *    },
 *  });
 *
 *  const { isCanceled, data } = await confirmation();
 *  console.log("data passed: ", data) // outputs 'confirm' or 'cancel' depending on what callback was called
 *  if (isCanceled)
 *    return false;
 *  else return true;
 */
