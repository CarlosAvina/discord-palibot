import EMOJI_NUMBERS from "../consts/emojiNumbers";

export default function numberToEmoji(number: number) {
  const stringNumber = String(number);
  const chars = stringNumber.split("");

  let res = "";
  chars.forEach((char) => {
    res += EMOJI_NUMBERS[Number(char)];
  });

  return res;
}
