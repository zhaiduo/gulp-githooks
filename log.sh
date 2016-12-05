#!/bin/bash

newvv=$(npm version patch|sed -e 's/v//g'|awk 'BEGIN{version=0}{if($1~/^[0-9]+\.[0-9]+\.[0-9]+$/){version=$1;print version}}'|head -n 1) && ~/gitchangelog/gitchangelog > CHANGELOG.md && sed -i .prev -E "s/# gulp\-githooks v[0-9]+\.[0-9]+\.[0-9]+/# gulp\-githooks v$newvv/" README.md && rm -f README.md.prev && git add . && git commit -m "$newvv" && git push && cid=$(git log|awk '{print $2}'|head -n 1) && git tag -a $newvv $cid -m "$newvv" && git push --tags


