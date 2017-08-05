Feature: Showing a list of analyses
  As a user of our app
  I want to see a list of analyses
  So that I can learn which analyses are available

Scenario: Showing the list of most recent analyses
  Given I am on the "Analyses" page
  Then I should see a tabulated list of analyses with columns
    | Date Created | Description | Status |
  And the analyses should be sorted by date in descending order
