Feature: Showing a list of datasets
  As a user of our app
  I want to see a list of datasets
  So that I can learn which datasets I have

Scenario: Showing the header of the list
  Given I am on the "Datasets" page
  Then I should see a tabulated list of datasets with columns
    | Date Created | Description |
