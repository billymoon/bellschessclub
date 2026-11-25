// Generated from: bdd/sample.feature
import { test } from "playwright-bdd";

test.describe('Playwright site', () => {

  test('Check home page', async ({ Given, Then, page }) => { 
    await Given('I navigate to "/"', null, { page }); 
    await Then('I see in title "Bells Chess Club"', null, { page }); 
    await Then('there is a "heading" with value "Club Nights"', null, { page }); 
    await Then('there is a "heading" with value "Contact"', null, { page }); 
    await Then('there is an element "a" with value "07503 448568"', null, { page }); 
    await Then('there is a "paragraph" with value "Bennets Bar"', null, { page }); 
    await Then('there is a "paragraph" with value "13 Hailes St, Edinburgh EH3 9NF"', null, { page }); 
    await Then('there is a link to "https://maps.app.goo.gl/hEGp6269cyveNRqH8"', null, { page }); 
  });

  test('Home page links to bennets page', async ({ Given, When, Then, page }) => { 
    await Given('I navigate to "/"', null, { page }); 
    await When('I click link "Banter blitz @ Bennets info"', null, { page }); 
    await Then('there is a "heading" with value "Back Stage at Bennets Bar"', null, { page }); 
  });

  test('Check bennets page', async ({ Given, Then, page }) => { 
    await Given('I navigate to "/bennets"', null, { page }); 
    await Then('there is a "heading" with value "Back Stage at Bennets Bar"', null, { page }); 
    await Then('there is a "paragraph" with value "8 Leven St, Edinburgh EH3 9LG"', null, { page }); 
    await Then('there is a link to "https://maps.app.goo.gl/yTHbsmWTdC7i9vBT7"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('bdd/sample.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I navigate to \"/\"","stepMatchArguments":[{"group":{"start":14,"value":"\"/\"","children":[{"start":15,"value":"/","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then I see in title \"Bells Chess Club\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Bells Chess Club\"","children":[{"start":16,"value":"Bells Chess Club","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then there is a \"heading\" with value \"Club Nights\"","stepMatchArguments":[{"group":{"start":11,"value":"\"heading\"","children":[{"start":12,"value":"heading","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":32,"value":"\"Club Nights\"","children":[{"start":33,"value":"Club Nights","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then there is a \"heading\" with value \"Contact\"","stepMatchArguments":[{"group":{"start":11,"value":"\"heading\"","children":[{"start":12,"value":"heading","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":32,"value":"\"Contact\"","children":[{"start":33,"value":"Contact","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then there is an element \"a\" with value \"07503 448568\"","stepMatchArguments":[{"group":{"start":20,"value":"\"a\"","children":[{"start":21,"value":"a","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":35,"value":"\"07503 448568\"","children":[{"start":36,"value":"07503 448568","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then there is a \"paragraph\" with value \"Bennets Bar\"","stepMatchArguments":[{"group":{"start":11,"value":"\"paragraph\"","children":[{"start":12,"value":"paragraph","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":34,"value":"\"Bennets Bar\"","children":[{"start":35,"value":"Bennets Bar","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then there is a \"paragraph\" with value \"13 Hailes St, Edinburgh EH3 9NF\"","stepMatchArguments":[{"group":{"start":11,"value":"\"paragraph\"","children":[{"start":12,"value":"paragraph","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":34,"value":"\"13 Hailes St, Edinburgh EH3 9NF\"","children":[{"start":35,"value":"13 Hailes St, Edinburgh EH3 9NF","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then there is a link to \"https://maps.app.goo.gl/hEGp6269cyveNRqH8\"","stepMatchArguments":[{"group":{"start":19,"value":"\"https://maps.app.goo.gl/hEGp6269cyveNRqH8\"","children":[{"start":20,"value":"https://maps.app.goo.gl/hEGp6269cyveNRqH8","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":17,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":18,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given I navigate to \"/\"","stepMatchArguments":[{"group":{"start":14,"value":"\"/\"","children":[{"start":15,"value":"/","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I click link \"Banter blitz @ Bennets info\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Banter blitz @ Bennets info\"","children":[{"start":14,"value":"Banter blitz @ Bennets info","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then there is a \"heading\" with value \"Back Stage at Bennets Bar\"","stepMatchArguments":[{"group":{"start":11,"value":"\"heading\"","children":[{"start":12,"value":"heading","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":32,"value":"\"Back Stage at Bennets Bar\"","children":[{"start":33,"value":"Back Stage at Bennets Bar","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":23,"pickleLine":18,"tags":[],"steps":[{"pwStepLine":24,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Given I navigate to \"/bennets\"","stepMatchArguments":[{"group":{"start":14,"value":"\"/bennets\"","children":[{"start":15,"value":"/bennets","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then there is a \"heading\" with value \"Back Stage at Bennets Bar\"","stepMatchArguments":[{"group":{"start":11,"value":"\"heading\"","children":[{"start":12,"value":"heading","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":32,"value":"\"Back Stage at Bennets Bar\"","children":[{"start":33,"value":"Back Stage at Bennets Bar","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":26,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Then there is a \"paragraph\" with value \"8 Leven St, Edinburgh EH3 9LG\"","stepMatchArguments":[{"group":{"start":11,"value":"\"paragraph\"","children":[{"start":12,"value":"paragraph","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":34,"value":"\"8 Leven St, Edinburgh EH3 9LG\"","children":[{"start":35,"value":"8 Leven St, Edinburgh EH3 9LG","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then there is a link to \"https://maps.app.goo.gl/yTHbsmWTdC7i9vBT7\"","stepMatchArguments":[{"group":{"start":19,"value":"\"https://maps.app.goo.gl/yTHbsmWTdC7i9vBT7\"","children":[{"start":20,"value":"https://maps.app.goo.gl/yTHbsmWTdC7i9vBT7","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end

// Source hash: 8f2727a9