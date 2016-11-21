#!/bin/bash

vv=$(cat CHANGELOG.md|awk 'BEGIN{version=0}{if($1~/^[0-9]+\.[0-9]+\.[0-9]+$/){version=$1;print version}}'|head -n 1) && echo "Current version: $vv" && sed -i .prev -E "s/# gulp\-githooks v[0-9]+\.[0-9]+\.[0-9]+/# gulp\-githooks v$vv/" README.md && rm -f README.md.prev


