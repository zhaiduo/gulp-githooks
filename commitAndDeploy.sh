#!/bin/bash

if [ "$1" == "" ]; then
    echo Usage: $0 "\"new: Update Content\""
    echo "e.g.: ./commitAndDeploy.sh \"fix: xxx bug\""
    exit 0
fi

git add . && git commit -m "$1" && npm version patch && ~/gitchangelog/gitchangelog > CHANGELOG.md && ./updateReadme.sh


