import statusColors from "../consts/statusColors";

const returnEmbedColor = (place: number) => {
  if (place < 10) return statusColors.green;
  if (place < 15) return statusColors.yellow;

  return statusColors.red;
};

export default returnEmbedColor;