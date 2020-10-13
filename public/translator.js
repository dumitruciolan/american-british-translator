import { americanOnly } from "./american-only.js";
import { americanToBritishSpelling } from "./american-to-british-spelling.js";
import { americanToBritishTitles } from "./american-to-british-titles.js";
import { britishOnly } from "./british-only.js";

// select required elements
const translatedBox = document.querySelector("#translated-sentence"),
  translateButton = document.querySelector("#translate-btn"),
  selector = document.querySelector("#locale-select"),
  clearButton = document.querySelector("#clear-btn"),
  textBox = document.querySelector("#text-input"),
  errorBox = document.querySelector("#error-msg");

// words capitalization
const checkCapitalization = (key, dict) => {
  return key[0] === key[0].toUpperCase()
    ? dict[key.toLowerCase()].charAt(0).toUpperCase() +
        dict[key.toLowerCase()].slice(1)
    : dict[key.toLowerCase()];
};

// aligning words in the right k:v order
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
  //   user story 7
  if (text === "")
    return (
      (errorBox.textContent = "Error: No text to translate."),
      (translatedBox.textContent = "")
    );

  let ans = text.split(/\s+/g),
    dictionary,
    dictionaryTitles;

  if (mode === "american-to-british") {
    dictionary = americanToBritishDict;
    dictionaryTitles = americanToBritishTitles;
  } else {
    dictionary = britishToAmericanDict;
    dictionaryTitles = britishToAmericanTitles;
  }

  // strToTranslateArr will contain words to change that is a string,
  // (not individual word) used in section Translate String (with lookahead)
  const strToTranslateArr = [];
  Object.keys(dictionary).forEach(key => {
    if (key.includes(" ") && text.toLowerCase().includes(key))
      strToTranslateArr.push(key);
  });

  ans.forEach((word, index, objAns) => {
    const timeRegex = /(([0-9]|0[0-9]|1[0-9]|2[0-3])(:|\.)([0-5][0-9]))/g,
      cleanWord = word.replace(/[,.;!?]/g, ""), //clean out word punctuations
      timeRegexResult = word.match(timeRegex);
    let tempTimeRegexResult, newTime, tempWord;

    // time translation (user story 3)
    if (timeRegexResult) {
      mode === "american-to-british"
        ? (tempTimeRegexResult = timeRegexResult[0].replace(":", "."))
        : (tempTimeRegexResult = timeRegexResult[0].replace(".", ":"));
      newTime = word.replace(timeRegexResult[0], tempTimeRegexResult); // to preserve punctuation in original word

      return (ans[index] = `<span class='highlight'>${newTime}</span>`); //adding green highlight
    }

    // translate titles & adding green highlight
    else if (dictionaryTitles.hasOwnProperty(word.toLowerCase())) {
      //check for capitalized initial word
      tempWord = checkCapitalization(word, dictionaryTitles);
      return (ans[index] = `<span class='highlight'>${tempWord}</span>`);
    }

    // Translate String (with lookahead)
    else if (strToTranslateArr.length > 0) {
      let indexLookAhead = 0,
        tempStrLookAhead = word;

      strToTranslateArr.forEach((key, i, obj) => {
        if (key.startsWith(tempStrLookAhead.toLowerCase())) {
          while (
            tempStrLookAhead.length <= key.length &&
            index + indexLookAhead <= text.length
          ) {
            indexLookAhead++; //increment lookahead index
            tempStrLookAhead = tempStrLookAhead.concat(
              " ",
              ans[index + indexLookAhead]
            ); // concat space and next word

            const cleanTempStrLookAhead = tempStrLookAhead.replace(
              /[,.;!?]/g,
              ""
            );

            //check for capitalized initial word
            if (key === cleanTempStrLookAhead.toLowerCase()) {
              tempWord = checkCapitalization(key, dictionary);

              const newStr = tempStrLookAhead.replace(
                cleanTempStrLookAhead,
                tempWord
              ); //replace the tempWord into the newWord, preserving all punctuations
              ans[index] = `<span class='highlight'>${newStr}</span>`; //adding green highlight
              obj.splice(i, 1); //drop element from strToTranslateArr, saving computing time when next word is indexed in ans.forEach
              objAns.splice(index + 1, indexLookAhead); //drop element that has been "looked ahead" from ans array
              return (index = index + indexLookAhead); //modify index
            }
          }
        }
      });
    }

    // Translate Word
    else if (dictionary.hasOwnProperty(cleanWord.toLowerCase())) {
      //check for capitalized initial word
      tempWord = checkCapitalization(cleanWord, dictionary);
      const newWord = word.replace(cleanWord, tempWord); //replace the tempWord into the newWord, preserving all punctuations
      return (ans[index] = `<span class='highlight'>${newWord}</span>`); //adding green highlight
    }

    // No Match
    else return (ans[index] = word);
  });

  const newString = ans.join(" ");

  //   user story 6
  if (newString === text)
    return (
      (translatedBox.innerHTML = "Everything looks good to me!"),
      (errorBox.textContent = "")
    );
  // user story 2
  return (translatedBox.innerHTML = newString), (errorBox.textContent = "");
};

// user story 1
translateButton.onclick = () => translate(textBox.value, selector.value);

// used by tests to avoid repetition
const convert = (inputString, targetInput, mode) => {
  document.querySelector(targetInput).value = inputString;
  translate(inputString, mode);
};

// user story 8
const clearAll = () => (
  (textBox.value = ""),
  (translatedBox.innerHTML = ""),
  (errorBox.textContent = "")
);
clearButton.onclick = clearAll;

// Export your functions for testing in Node.
// `try` prevents errors on  the client side
try {
  module.exports = { convert, clearAll };
} catch (e) {
  console.log(e);
}
