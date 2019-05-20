workflow "Run Code Review" {
  resolves = ["PHPCS Code Review"]
  on = "pull_request"
}

action "PHPCS Code Review" {
  uses = "rtCamp/action-phpcs-code-review@master"
  secrets = ["GH_BOT_TOKEN"]
  args = ["WordPress,WordPress-Core,WordPress-Docs"]
}

workflow "Run Code Review on push" {
  resolves = ["PHPCS Code Review"]
  on = "push"
}

action "PHPCS Code Review on Push" {
  uses = "rtCamp/action-phpcs-code-review@master"
  secrets = ["GH_BOT_TOKEN"]
  args = ["WordPress,WordPress-Core,WordPress-Docs"]
}

