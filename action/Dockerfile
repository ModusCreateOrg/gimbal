FROM moduscreate/gimbal:latest

LABEL "name"="Gimbal CLI Action"
LABEL "maintainer"="Mitchell Simoens <mitchell.simoens@moduscreate.com>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="GitHub Action for Gimbal"
LABEL "com.github.actions.description"="Runs Gimbal on the repo."
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="blue"

# used in gimbal's GitHubActions class to detect this is indeed running in GitHub Actions
ENV GITHUB_ACTIONS_CI true

ENTRYPOINT ["gimbal"]
