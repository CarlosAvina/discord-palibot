import statusDescriptions from "../consts/statusDescriptions";

const returnEmbedDescription = (place: number) => {
  if (place < 10) return statusDescriptions.green;
  if (place < 13) return statusDescriptions.yellow;
  if (place < 17) return statusDescriptions.red;

  return statusDescriptions.black;
};

export default returnEmbedDescription;
