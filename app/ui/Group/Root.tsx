import { cloneVNode, defineComponent, onUpdated } from "vue";
import { type VariantProps, cva } from "cva";
import type { HTMLAttributes } from "vue";

const groupRootVariants = cva("flex border-none relative h-fit", {
  variants: {
    orientation: { horizontal: "flex-row", vertical: "flex-col" },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});
type GroupRootVariants = VariantProps<typeof groupRootVariants>;

interface Props {
  orientation?: GroupRootVariants["orientation"];
  class?: HTMLAttributes["class"];
}

const GroupRoot = defineComponent(({ class: className, orientation = "vertical" }: Props, { slots }) => {
  if (slots.default) {
    const children = slots.default()?.filter(ch => ch.type.toString() !== "Symbol(v-cmt)");
    const modChildren: (typeof children[0])[] = [];

    for (let i = 0; i < children.length; ++i) {
      const nVnode = cloneVNode(children[i]);
      if (!nVnode.props)
        nVnode.props = {};

      if (orientation === "horizontal") {
        if (i === 0)
          nVnode.props.class = "rounded-r-0!";
        else if (i === children.length - 1)
          nVnode.props.class = "rounded-l-0!";
        else
          nVnode.props.class = "rounded-0!";
      }
      else if (orientation === "vertical") {
        if (i === 0)
          nVnode.props.class = "rounded-b-0!";
        else if (i === children.length - 1)
          nVnode.props.class = "rounded-t-0!";
        else
          nVnode.props.class = "rounded-0!";
      }

      modChildren.push(nVnode);
    }

    return () => (
      <div class={[groupRootVariants({ orientation }), className]}>
        { modChildren }
      </div>
    );
  }
  else { return () => (<div></div>); }
}, { props: ["orientation"] });
export default GroupRoot;
