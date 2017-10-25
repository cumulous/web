Feature: Showing a list of datasets
  As a user of our app
  I want to see a list of datasets
  So that I can learn which datasets I have

Scenario: Showing the list of most recent datasets
  Given I am on the "Datasets" page
  Then I should see a tabulated list of datasets with columns
    | Description | Project | Date Created | Created By | Status |
  And the datasets should be sorted by date in descending order
