import { ref } from "vue";

export interface IConfirmationDialog {
  title: string;
  subtitle: string;
  content?: string; // TODO: string | VNode
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
