# Docker image
FROM moduscreate/gimbal:latest

# Action name
LABEL "name"="Gimbal Web Performance Budgeting Action"

# Repository
LABEL "repository"="https://github.com/ModusCreateOrg/gimbal"

# Homepage
LABEL "homepage"="https://github.com/ModusCreateOrg/gimbal"

# Gimbal Maintainer
LABEL "maintainer"="Mitchell Simoens <mitchell.simoens@moduscreate.com>"

# Current version
LABEL "version"="1.2.3"

# Action name
LABEL "com.github.actions.name"="Gimbal Web Performance Budgeting Action"

# Desc
LABEL "com.github.actions.description"="Prevents web performance regression and outputs comments with detailed reports."

# Icon
LABEL "com.github.actions.icon"="package"

#Color
LABEL "com.github.actions.color"="blue"

# Env var
ENV GITHUB_ACTIONS true

# Entrypoint
ENTRYPOINT ["gimbal"]
