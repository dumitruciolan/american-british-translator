// -----[Keep the tests in the same order!]----
// (if additional are added, keep them at the very end!)

const chai = require("chai"),
  jsdom = require("jsdom"),
  { assert } = chai,
  { JSDOM } = jsdom;
let Translator;

suite("Unit Tests", () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Translator
    return JSDOM.fromFile("./views/index.html").then(dom => {
      global.window = dom.window;
      global.document = dom.window.document;

      Translator = require("../public/translator.js");
    });
  });

  suite("Function translate(input, locale)", () => {
    suite("American to British English", () => {
      test("Mangoes are my favorite fruit. --> Mangoes are my favourite fruit.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "Mangoes are my favourite fruit.",
          input = "Mangoes are my favorite fruit.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("I ate yogurt for breakfast. --> I ate yoghurt for breakfast.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "I ate yoghurt for breakfast.",
          input = "I ate yogurt for breakfast.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("We had a party at my friend's condo. --> We had a party at my friend's flat.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "We had a party at my friend's flat.",
          input = "We had a party at my friend's condo.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("Can you toss this in the trashcan for me? --> Can you toss this in the bin for me?", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          input = "Can you toss this in the trashcan for me?",
          output = "Can you toss this in the bin for me?";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("The parking lot was full. --> The car park was full.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          input = "The parking lot was full.",
          output = "The car park was full.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("Like a high tech Rube Goldberg machine. --> Like a high tech Heath Robinson device.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "Like a high tech Heath Robinson device.",
          input = "Like a high tech Rube Goldberg machine.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("To play hooky means to skip class or work. --> To bunk off means to skip class or work.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          input = "To play hooky means to skip class or work.",
          output = "To bunk off means to skip class or work.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("No Mr. Bond, I expect you to die. --> No Mr Bond, I expect you to die. ", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          input = "No Mr. Bond, I expect you to die.",
          output = "No Mr Bond, I expect you to die.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("Dr. Grosh will see you now. --> Dr Grosh will see you now. ", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          input = "Dr. Grosh will see you now.",
          output = "Dr Grosh will see you now.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("Lunch is at 12:15 today. --> Lunch is at 12.15 today.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "Lunch is at 12.15 today.",
          input = "Lunch is at 12:15 today.";

        Translator.convert(input, "#text-input", "american-to-british");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });
    });

    suite("British to American English", () => {
      test("We watched the footie match for a while. --> We watched the soccer match for a while.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "We watched the soccer match for a while.",
          input = "We watched the footie match for a while.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("Paracetamol takes up to an hour to work. --> Tylenol takes up to an hour to work.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          input = "Paracetamol takes up to an hour to work.",
          output = "Tylenol takes up to an hour to work.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("First, caramelise the onions. --> First, caramelize the onions.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "First, caramelize the onions.",
          input = "First, caramelise the onions.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("I spent the bank holiday at the funfair. --> I spent the public holiday at the carnival.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "I spent the public holiday at the carnival.",
          input = "I spent the bank holiday at the funfair.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("I had a bicky then went to the chippy. --> I had a cookie then went to the fish-and-chip shop.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "I had a cookie then went to the fish-and-chip shop.",
          input = "I had a bicky then went to the chippy.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("I've just got bits and bobs in my bum bag. --> I've just got odds and ends in my fanny pack.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "I've just got odds and ends in my fanny pack.",
          input = "I've just got bits and bobs in my bum bag.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("The car boot sale at Boxted Airfield was called off. --> The swap meet at Boxted Airfield was called off.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          input = "The car boot sale at Boxted Airfield was called off.",
          output = "The swap meet at Boxted Airfield was called off.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("Have you met Mrs Kalyani? --> Have you met Mrs. Kalyani?", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "Have you met Mrs. Kalyani?",
          input = "Have you met Mrs Kalyani?";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("Prof Joyner of King's College, London. --> Prof. Joyner of King's College, London.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "Prof. Joyner of King's College, London.",
          input = "Prof Joyner of King's College, London.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });

      test("Tea time is usually around 4 or 4.30. --> Tea time is usually around 4 or 4:30.", done => {
        const translationDiv = document.querySelector("#translated-sentence"),
          output = "Tea time is usually around 4 or 4:30.",
          input = "Tea time is usually around 4 or 4.30.";

        Translator.convert(input, "#text-input", "british-to-american");
        assert.strictEqual(translationDiv.textContent, output);
        done();
      });
    });
  });
});
