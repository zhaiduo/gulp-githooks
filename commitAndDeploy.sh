#!/bin/bash

if [ "$1" == "" ]; then
    echo Usage: $0 "\"new: Update Content\""
    echo "e.g.: ./commitAndDeploy.sh \"fix: xxx bug\""
    exit 0
fi

git add . && git commit -m "$1" && newvv=$(npm version patch|sed -e 's/v//g'|awk 'BEGIN{version=0}{if($1~/^[0-9]+\.[0-9]+\.[0-9]+$/){version=$1;print version}}'|head -n 1) && ~/gitchangelog/gitchangelog > CHANGELOG.md && sed -i .prev -E "s/# gulp\-githooks v[0-9]+\.[0-9]+\.[0-9]+/# gulp\-githooks v$newvv/" README.md && rm -f README.md.prev && git add . && git commit -m "new: Update log" && git push && cid=$(git log|awk '{print $2}'|head -n 1) && git tag -a $newvv $cid -m "$newvv" && git push --tags && npm publish


