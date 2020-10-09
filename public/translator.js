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
  errorBox = document.querySelector("#error-msg"),
  timeString = textBox.value,
  translationList = [];
let mode = "american-to-british";

const objectFlip = obj => {
  const ret = {};
  Object.keys(obj).forEach(key => (ret[obj[key]] = key));
  return ret;
};

// aligning all translated words in the right k:v order
const americanToBritishDict = { ...americanToBritishSpelling, ...americanOnly },
  britishToAmericanSpelling = objectFlip(americanToBritishSpelling),
  britishToAmericanDict = { ...britishToAmericanSpelling, ...britishOnly },
  britishToAmericanTitles = objectFlip(americanToBritishTitles);

// merging all k:v into a nested array
Object.keys(americanOnly).forEach(key =>
  translationList.push([key, americanOnly[key]])
);
Object.keys(americanToBritishSpelling).forEach(key =>
  translationList.push([key, americanToBritishSpelling[key]])
);
Object.keys(americanToBritishTitles).forEach(key =>
  translationList.push([key, americanToBritishTitles[key]])
);
Object.keys(britishOnly).forEach(key =>
  translationList.push([britishOnly[key], key])
);

// main function
const translate = (text, mode) => {
  //   user story 7
  if (text === "")
    return (
      (errorBox.textContent = "Error: No text to translate."),
      (translatedBox.textContent = "")
    );

  let ans = text.split(/\s+/g), dictionary, dictionaryTitles;

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
    if (key.includes(" "))
      if (text.toLowerCase().includes(key)) strToTranslateArr.push(key);
  });

  ans.forEach((word, index, objAns) => {
    const cleanWord = word.replace(/[,.;!?]/g, ""); //clean out punctuations from word for Translate Word
    const timeRegex = /(([0-9]|0[0-9]|1[0-9]|2[0-3])(:|\.)([0-5][0-9]))/g;
    const times = timeString.match(timeRegex);

    let timeRegexResult, tempTimeRegexResult;

    // time replacement (user story 3)
    if (times)
      times.forEach(time =>
        mode === "american-to-british"
          ? (newString = newString.replace(
            time,
            `<span class='highlight'>${time.replace(":", ".")}</span>`
          ))
          : (newString = newString.replace(
            time,
            `<span class='highlight'>${time.replace(".", ":")}</span>`
          ))
      );

    if (mode === "american-to-british") {
      timeRegexResult = word.match(timeRegex);
      if (timeRegexResult)
        tempTimeRegexResult = timeRegexResult[0].replace(":", ".");
    } else {
      timeRegexResult = word.match(timeRegex);
      if (timeRegexResult)
        tempTimeRegexResult = timeRegexResult[0].replace(".", ":");
    }

    // Translate Time
    if (timeRegexResult) {
      const newTime = word.replace(timeRegexResult[0], tempTimeRegexResult); // to preserve punctuation in original word
      return (ans[index] = `<span class='highlight'>${newTime}</span>`); //adding green highlight
    }

    // Translate Titles
    else if (dictionaryTitles.hasOwnProperty(word.toLowerCase())) {
      let tempWord;

      if (word[0] === word[0].toUpperCase())
        //check for capitalized initial word
        tempWord =
          dictionaryTitles[word.toLowerCase()].charAt(0).toUpperCase() +
          dictionaryTitles[word.toLowerCase()].slice(1);
      else tempWord = dictionaryTitles[word.toLowerCase()];

      return (ans[index] = `<span class='highlight'>${tempWord}</span>`); //adding green highlight
    }

    // Translate String (with lookahead)
    else if (strToTranslateArr.length > 0) {
      let indexLookAhead = 0, tempWord, tempStrLookAhead = word;

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

            if (key === cleanTempStrLookAhead.toLowerCase()) {
              if (tempStrLookAhead[0] === tempStrLookAhead[0].toUpperCase())
                //check for capitalized initial word
                tempWord =
                  dictionary[key].charAt(0).toUpperCase() + dictionary[key].slice(1);
              else tempWord = dictionary[key];

              const newStr = tempStrLookAhead.replace(
                cleanTempStrLookAhead,
                tempWord
              ); //replace the tempWord into the newWord, preserving all punctuations
              ans[index] = `<span class='highlight'>${newStr}</span>`; //adding green highlight
              obj.splice(i, 1); //drop element from strToTranslateArr, saving computing time when next word is indexed in ans.forEach
              objAns.splice(index + 1, indexLookAhead); //drop element that has been "looked ahead" from ans array
              index = index + indexLookAhead; //modify index
              return;
            }
          }
        }
      });
    }

    // Translate Word
    else if (dictionary.hasOwnProperty(cleanWord.toLowerCase())) {
      let tempWord;

      if (word[0] === word[0].toUpperCase())
        //check for capitalized initial word
        tempWord =
          dictionary[cleanWord.toLowerCase()].charAt(0).toUpperCase() +
          dictionary[cleanWord.toLowerCase()].slice(1);
      else tempWord = dictionary[cleanWord.toLowerCase()];

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

  mode === "american-to-british"
    ? translationList.forEach(
      term =>
        (newString = newString.replace(
          term[0],
          `<span class='highlight'>${term[1]}</span>`
        ))
    )
    : translationList.forEach(
      term =>
        (newString = newString.replace(
          term[1],
          `<span class='highlight'>${term[0]}</span>`
        ))
    );
};

// user story 1
translateButton.onclick = () => {
  const text = textBox.value, mode = selector.value;
  translate(text, mode);
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
  module.exports = { translate, clearAll };
} catch (e) {
  console.log(e);
}
