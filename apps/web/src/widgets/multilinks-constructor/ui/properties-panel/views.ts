import type { Component } from "vue";

import type { PanelViewId } from "../../model/provider";

import { BlockPropertiesEditor } from "../block-properties-editor";
import { PagePropertiesEditor } from "../page-properties-editor";
import { ThemeEditor } from "../theme-editor";

export interface PropertyView {
  id: PanelViewId;
  /** Reached through data, so `uno.config.ts#safelist` names it: the extractor cannot see it. */
  icon: string;
  label: string;
  component: Component;
}

export const PROPERTY_VIEWS: PropertyView[] = [
  { id: "blocks", icon: "i-lucide:layout-list", label: "Blocks properties", component: BlockPropertiesEditor },
  { id: "page", icon: "i-lucide:file-text", label: "Page properties", component: PagePropertiesEditor },
  { id: "theme", icon: "i-lucide:palette", label: "Theme properties", component: ThemeEditor },
];

export const DEFAULT_VIEW_ID: PanelViewId = "blocks";
