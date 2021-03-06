// -----[Keep the tests in the same order!]----
// (if additional are added, keep them at the very end!)

const chai = require("chai"),
  { assert } = chai;
let Translator;

suite("Functional Tests", () => {
  // DOM already mocked -- load translator then run tests
  suiteSetup(() => (Translator = require("../public/translator.js")));

  suite("Function translate(input, locale)", () => {
    // The translated sentence is appended to the `translated-sentence` `div` and the translated words or
    // terms are wrapped in `<span class="highlight">...</span> tags when the "Translate" button is pressed.
    test("Translation appended to the `translated-sentence` `div`", done => {
      const translationDiv = document.querySelector("#translated-sentence"),
        output = 'freeCodeCamp is my <span class="highlight">favourite.</span>',
        input = "freeCodeCamp is my favorite.";

      Translator.convert(input, "#text-input", "american-to-british");
      assert.strictEqual(translationDiv.innerHTML, output);
      done();
    });

    // If there are no words or terms that need to be translated,the message 'Everything looks good to me!'
    // is appended to the `translated-sentence` `div` when the "Translate" button is pressed.
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      const translationDiv = document.querySelector("#translated-sentence"),
        output = "Everything looks good to me!",
        input = "freeCodeCamp is awesome.";

      Translator.convert(input, "#text-input", "american-to-british");
      assert.strictEqual(translationDiv.innerHTML, output);
      done();
    });

    // If the text area is empty when the "Translation" button is pressed,
    // append the message 'Error: No text to translate.' to the `error-msg` `div`.
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      const output = "Error: No text to translate.";

      Translator.convert("", "#text-input", "american-to-british");
      assert.equal(document.querySelector("#error-msg").innerHTML, output);
      done();
    });
  });

  suite("Function clearAll()", () => {
    // The text area and both the `translated-sentence` and `error-msg`
    // `divs` are cleared when the "Clear" button is pressed.
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      const errorDiv = document.querySelector("#error-msg"),
        translationDiv = document.querySelector("#translated-sentence");

      // Simulate translation, error message & button click
      errorDiv.textContent = "Error: No text to translate.";
      document.querySelector("#text-input").value = "biro";
      translationDiv.textContent = "ballpoint pen";
      Translator.clearAll();

      assert.strictEqual(document.querySelector("#error-msg").textContent, "");
      assert.strictEqual(document.querySelector("#text-input").value, "");
      assert.strictEqual(translationDiv.innerHTML, "");
      done();
    });
  });
});
