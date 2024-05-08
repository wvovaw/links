import { UITag } from "~ui";

type TagTypes = Partial<InstanceType<typeof UITag>["$props"]>;

export default defineComponent((props: TagTypes, { slots }) => {
  const text = slots.default ? slots.default()[0].children as string : "PROVIDE DEFAULT SLOT!!!";
  const { copy, copied } = useClipboard({ source: text });
  const icon = computed(() => copied.value ? "i-lucide:copy-check" : "i-lucide:copy");
  return () => <UITag {...props} class="w-fit" iconRight={icon.value} onIconRightClick={() => copy(text)}>{text}</UITag>;
});
