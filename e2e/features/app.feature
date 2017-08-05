Feature: Opening the app
  As a user of our app
  I want to see the app
  So that I can do useful work

Scenario: Initial loading of the "Datasets" page
  When I open our app
  Then I should see the "Datasets" page

Scenario: Navigating using tabs
  When I open our app
  Then I should be able to navigate using the tabs
    | Datasets | Analyses |
