Feature: Playwright site

    Scenario: Check home page
        Given I navigate to "/"
        Then I see in title "Bells Chess Club"
        Then there is a "heading" with value "Club Nights"
        Then there is a "heading" with value "Contact"
        Then there is an element "a" with value "07503 448568"
        Then there is a "paragraph" with value "Bennets Bar"
        Then there is a "paragraph" with value "13 Hailes St, Edinburgh EH3 9NF"
        Then there is a link to "https://maps.app.goo.gl/hEGp6269cyveNRqH8"

    Scenario: Home page links to bennets page
        Given I navigate to "/"
        When I click link "Banter blitz @ Bennets info"
        Then there is a "heading" with value "Back Stage at Bennets Bar"

    Scenario: Check bennets page
        Given I navigate to "/bennets"
        Then there is a "heading" with value "Back Stage at Bennets Bar"
        Then there is a "paragraph" with value "8 Leven St, Edinburgh EH3 9LG"
        Then there is a link to "https://maps.app.goo.gl/yTHbsmWTdC7i9vBT7"
