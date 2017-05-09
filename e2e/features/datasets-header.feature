Feature: Showing datasets table header
  As a user of our app
  I want to navigate to the datasets page
  So that I can see the datasets table headers

Scenario: Loading the datasets table headers
  Given I am on the datasets page
  Then We should see a column with name <Name>

  Examples:
    | Name |
    | Date Created |
    | Description |
