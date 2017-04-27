Feature: Opening the app page
  As a user of our app
  I want to navigate to the app page
  So that I can do useful work

Scenario: Loading the app
  Given I am on the app page
  Then I should see a message saying that the app works

Scenario: Initial loading of the Datasets page
  Given I am on the app page
  Then I should be redirected to the /datasets page