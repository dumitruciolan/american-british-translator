import { americanOnly } from "./american-only.js";
import { americanToBritishSpelling } from "./american-to-british-spelling.js";
import { americanToBritishTitles } from "./american-to-british-titles.js";
import { britishOnly } from "./british-only.js";

// select the required elements
const translateButton = document.querySelector("#translate-btn"),
  selector = document.querySelector("#locale-select"),
  textBox = document.querySelector("#text-input");

// check word capitalization
const checkCapitalization = (key, dict) => {
  return key[0] === key[0].toUpperCase()
    ? dict[key.toLowerCase()].charAt(0).toUpperCase() +
        dict[key.toLowerCase()].slice(1)
    : dict[key.toLowerCase()];
};

// insert the provided text in the boxes
const fillBoxes = (inputText, translatedText, errorText) => (
  (document.querySelector("#text-input").value = inputText),
  (document.querySelector("#translated-sentence").innerHTML = translatedText),
  (document.querySelector("#error-msg").textContent = errorText)
);

// align words in the right k:v order
const flipKeysAndValues = obj => {
  const result = {};
  Object.keys(obj).forEach(key => (result[obj[key]] = key));
  return result;
};

const americanToBritishDict = { ...americanToBritishSpelling, ...americanOnly },
  britishToAmericanSpelling = flipKeysAndValues(americanToBritishSpelling),
  britishToAmericanDict = { ...britishToAmericanSpelling, ...britishOnly },
  britishToAmericanTitles = flipKeysAndValues(americanToBritishTitles);

// main function
const translate = (text, mode) => {
  // user story 7
  if (text === "") return fillBoxes("", "", "Error: No text to translate.");

  let ans = text.split(/\s+/g),
    dictionary,
    dictionaryTitles;
  const stringsToTranslateArr = [];

  if (mode === "american-to-british") {
    dictionary = americanToBritishDict;
    dictionaryTitles = americanToBritishTitles;
  } else {
    dictionary = britishToAmericanDict;
    dictionaryTitles = britishToAmericanTitles;
  }

  // strToTranslateArr contain words to change that is a string,
  // (not individual word) used in section Translate String (with lookahead)
  Object.keys(dictionary).forEach(key => {
    if (key.includes(" ") && text.toLowerCase().includes(key))
      stringsToTranslateArr.push(key);
  });

  ans.forEach((word, index, objAns) => {
    const timeRegex = /(([0-9]|0[0-9]|1[0-9]|2[0-3])(:|\.)([0-5][0-9]))/g,
      cleanWord = word.replace(/[,.;!?]/g, ""), // clears word punctuation
      timeRegexResult = word.match(timeRegex);
    let tempTimeRegexResult, newTime, tempWord;

    // time translation (user story 3)
    if (timeRegexResult) {
      mode === "american-to-british"
        ? (tempTimeRegexResult = timeRegexResult[0].replace(":", "."))
        : (tempTimeRegexResult = timeRegexResult[0].replace(".", ":"));
      newTime = word.replace(timeRegexResult[0], tempTimeRegexResult); // preserves punctuation in original word

      return (ans[index] = `<span class='highlight'>${newTime}</span>`); // adding green highlight
    }

    // check capitalization, translate titles & add green highlight
    else if (dictionaryTitles.hasOwnProperty(word.toLowerCase())) {
      tempWord = checkCapitalization(word, dictionaryTitles);
      return (ans[index] = `<span class='highlight'>${tempWord}</span>`);
    }

    // translate string (with lookahead)
    else if (stringsToTranslateArr.length > 0) {
      let indexLookAhead = 0,
        tempStrLookAhead = word;

      stringsToTranslateArr.forEach((key, i, obj) => {
        if (key.startsWith(tempStrLookAhead.toLowerCase())) {
          while (
            tempStrLookAhead.length <= key.length &&
            index + indexLookAhead <= text.length
          ) {
            indexLookAhead++; // increment lookahead index
            tempStrLookAhead = tempStrLookAhead.concat(
              " ",
              ans[index + indexLookAhead]
            ); // concat space and next word

            const cleanTempStrLookAhead = tempStrLookAhead.replace(
              /[,.;!?]/g,
              ""
            );

            // check for capitalized initial word
            if (key === cleanTempStrLookAhead.toLowerCase()) {
              tempWord = checkCapitalization(key, dictionary);

              const newStr = tempStrLookAhead.replace(
                cleanTempStrLookAhead,
                tempWord
              ); // replace the tempWord into the newWord, preserving all punctuations
              ans[index] = `<span class='highlight'>${newStr}</span>`; // adding green highlight
              obj.splice(i, 1); // drop element from strToTranslateArr, saving computing time when next word is indexed in ans.forEach
              objAns.splice(index + 1, indexLookAhead); // drop element that has been "looked ahead" from ans array
              return (index = index + indexLookAhead); // modify index
            }
          }
        }
      });
    }

    // check for capitalization & translate the word
    else if (dictionary.hasOwnProperty(cleanWord.toLowerCase())) {
      tempWord = checkCapitalization(cleanWord, dictionary);
      const newWord = word.replace(cleanWord, tempWord); //replace the tempWord with newWord, preserving all punctuations
      return (ans[index] = `<span class='highlight'>${newWord}</span>`); //adding green highlight
    }

    // if there's no match
    else return (ans[index] = word);
  });

  // user story 6
  if (ans.join(" ") === text)
    return fillBoxes(text, "Everything looks good to me!", "");

  return fillBoxes(text, ans.join(" "), "");
};

// user story 1
translateButton.onclick = () => translate(textBox.value, selector.value);

// used by tests to avoid repetition
const convert = (inputString, targetInput, mode) => {
  document.querySelector(targetInput).value = inputString;
  translate(inputString, mode);
};

// user story 8
const clearAll = () => fillBoxes("", "", "");
document.querySelector("#clear-btn").onclick = clearAll;

// Export your functions for testing in Node.
// `try` prevents errors on  the client side
try {
  module.exports = { convert, clearAll };
} catch (e) {
  console.log(e);
}
