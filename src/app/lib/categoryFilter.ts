import { Category, specOptions } from "./categorySpecs";

export const filtersByCategory: Record<Category, FilterOption[]> = {
  speaker: [
    {
      key: "brand",
      label: "Marka",
      type: "select",
      options: specOptions.brand,
    },
    {
      key: "size",
      label: "Veličina (cm)",
      type: "select",
      options: specOptions.size,
    },
    {
      key: "type",
      label: "Tip",
      type: "checkbox",
      options: specOptions.type,
    },
    { key: "price", label: "Cijena", type: "range" },
  ],
  amplifier: [
    {
      key: "brand",
      label: "Marka",
      type: "select",
      options: specOptions.brand,
    },
    {
      key: "channels",
      label: "Broj kanala",
      type: "select",
      options: specOptions.channels,
    },
    { key: "price", label: "Cijena", type: "range" },
  ],
  player: [
    {
      key: "brand",
      label: "Marka",
      type: "select",
      options: specOptions.brand,
    },
    {
      key: "size",
      label: "Veličina",
      type: "select",
      options: specOptions.playerSize,
    },
    {
      key: "android_auto",
      label: "Android Auto/Carplay",
      type: "checkbox",
      options: ["Da"],
    },
    { key: "price", label: "Cijena", type: "range" },
  ],
  // accessories: [
  //   {
  //     key: "brand",
  //     label: "Marka",
  //     type: "select",
  //     options: specOptions.brand,
  //   },
  //   {
  //     key: "material",
  //     label: "Materijal",
  //     type: "checkbox",
  //     options: ["plastic", "metal", "rubber"],
  //   },
  //   { key: "price", label: "Cijena", type: "range" },
  // ],
};
