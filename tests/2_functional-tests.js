// -----[Keep the tests in the same order!]----
// (if additional are added, keep them at the very end!)

const chai = require("chai"),
  { assert } = chai;
let Translator;

suite("Functional Tests", () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require("../public/translator.js");
  });

  suite("Function translate(input, locale)", () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    
    test("Translation appended to the `translated-sentence` `div`", done => {
      const textArea = document.getElementById("text-input");
      const translationDiv = document.getElementById("translated-sentence");
      const output =
        'freeCodeCamp is my <span class="highlight">favourite.</span>';

      // Simulate click
      textArea.value = "freeCodeCamp is my favorite.";
      Translator.translate(textArea.value, "american-to-british");

      assert.strictEqual(translationDiv.innerHTML, output);
      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      const textArea = document.getElementById("text-input");
      const translationDiv = document.getElementById("translated-sentence");
      const output = "Everything looks good to me!";

      // Simulate click
      textArea.value = "freeCodeCamp is awesome.";
      Translator.translate(textArea.value, "american-to-british");

      assert.strictEqual(translationDiv.innerHTML, output);
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      const textArea = document.getElementById("text-input");
      const errorDiv = document.getElementById("error-msg");
      const output = "Error: No text to translate.";

      // Simulate click
      textArea.value = "";
      Translator.translate(textArea.value, "american-to-british");

      assert.strictEqual(errorDiv.innerHTML, output);
      done();
    });
  });

  suite("Function clearAll()", () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      const textArea = document.getElementById("text-input");
      const translationDiv = document.getElementById("translated-sentence");
      const errorDiv = document.getElementById("error-msg");

      // Simulate translation
      textArea.value = "biro";
      translationDiv.textContent = "ballpoint pen";

      // Simulate error message
      errorDiv.textContent = "Error: No text to translate.";

      // Simulate clicks
      Translator.clearAll();

      assert.strictEqual(textArea.value, "");
      assert.strictEqual(translationDiv.innerHTML, "");
      assert.strictEqual(errorDiv.textContent, "");
      done();
    });
  });
});
