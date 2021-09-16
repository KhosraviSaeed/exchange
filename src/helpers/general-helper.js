import { WEBSITE_TITLE, BASE_IMAGE } from "../configs/constants-config";

function generate_title(pagetitle) {
  return `${pagetitle} | ${WEBSITE_TITLE}`;
}

function copyToClipboard(value) {
  const dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute("id", "dummy_id");
  document.getElementById("dummy_id").value = value;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function toImageUrl(path) {
  if (window.mockMode) return "/games/Baghlava.png";
  if (!path) return "";

  let output = BASE_IMAGE;
  if (path.startsWith("/")) {
    output += path;
  } else {
    output += `/${path}`;
  }
  return output;
}

export const commaSeparator = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// A helper for converting non-persian numbers to persian ones.
let arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"],
  persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"],
  englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

function searchAndReplaceInNumbers(value, source, target) {
  for (let i = 0, len = target.length; i < len; i++) {
    value = value.replace(new RegExp(source[i], "g"), target[i]);
  }
  return value;
}

function numbersFormatter(value, to = "fa") {
  value = typeof value === "number" ? String(value) : value;
  if (!value) return value;
  let output = value;
  if (to === "fa") {
    output = searchAndReplaceInNumbers(output, englishNumbers, persianNumbers);
    output = searchAndReplaceInNumbers(output, arabicNumbers, persianNumbers);
  } else if (to === "en") {
    output = searchAndReplaceInNumbers(output, persianNumbers, englishNumbers);
    output = searchAndReplaceInNumbers(output, arabicNumbers, englishNumbers);
  }
  return output;
}

function priceFormatter(val) {
  return numbersFormatter(commaSeparator(String(val)), "fa");
}

function objetcToDate (ob) {
  return `${numbersFormatter(ob.year)}/${numbersFormatter(ob.month)}/${numbersFormatter(ob.day)}`
}
export {
  generate_title,
  copyToClipboard,
  toImageUrl,
  numbersFormatter,
  priceFormatter,
  objetcToDate
};
