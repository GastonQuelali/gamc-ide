export const createPrediosPopupTemplate = () => ({
  title: "PREDIO {expression/codcat-format}",
  outFields: ["*"],
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "CodCat", label: "Código Catastral" },
        { fieldName: "Sbdistrito", label: "Nombre Subdistrito" },
        {
          fieldName: "SHAPE.STArea()",
          label: "Área",
          format: { digitSeparator: true, places: 2 },
        },
      ],
    },
  ],
  expressionInfos: [
    {
      name: "codcat-format",
      title: "Código Catastral Formateado",
      expression:
        "Concatenate(Mid($feature.CodCat, 0, 2), '-', Mid($feature.CodCat, 2, 3), '-', Mid($feature.CodCat, 5, 3))",
    },
  ],
});

export const PREDIO_LABEL_FIELD = "$feature.Nro_predio";

export const LABEL_SYMBOL = {
  type: "text",
  color: [64, 101, 235, 255],
  font: { size: "11px", family: "arial" },
};
