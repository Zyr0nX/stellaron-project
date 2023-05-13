import TextMapEN from "StarRailData/TextMap/TextMapEN.json";

type TextMap = Record<number, string>;

export const hashLookup = (hash: number) => {
  if (!Object.prototype.hasOwnProperty.call(TextMapEN, hash)) {
    throw new Error(`Hash ${hash} not found`);
  }
  return (TextMapEN as TextMap)[hash];
};
