type BlockPropertyType = "string" | "number" | "checkbox" | "switch" | "select" | "color" | "url";
type BlockName = "Button" | "Paragraph";

export interface BlockProperty {
  type: BlockPropertyType;
  key: string;
  label: string;
  value?: any;
  defaultValue?: any;
  required?: boolean;
};

export interface IBlock {
  id: string;
  name: BlockName;
  properties?: BlockProperty[];
}

export interface IPage {
  id: string;
  title: string;
  blocks: IBlock[];
}
