Feature: Showing a list of projects
  As a user of our app
  I want to see a list of projects
  So that I can learn about the projects I have access to

Scenario: Showing the list of projects
  Given I am on the "Projects" page
  Then I should see a tabulated list of projects with columns
    | Name | Description | Date Created | Status |
  And the projects should be sorted by date in descending order
