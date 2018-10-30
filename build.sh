#!/bin/bash
declare -a dependencies=(docker docker-compose)
for i in "${dependencies[@]}"; do
    command -v $i > /dev/null 2>&1 || { echo "$i is not installed" >&2; exit 1; }
done

#buildtime=$(date +%s)
#echo "Current epoch time: $buildtime"
echo "Please enter a tag (stable/dev/etc) or 'skip' to skip build and just push LATEST:"
echo "You can also use version numbers for tags (0.0.1, etc)"
read -p ":" buildtag

if [[ $buildtype != "skip" ]]
then
    echo The image will also be tagged as LATEST.
    docker-compose build
    docker tag open311-nodejs docker-repo.bloomington.in.gov/library/open311-nodejs:$buildtag
    #docker tag open311-nodejs docker-repo.bloomington.in.gov/library/open311-nodejs:latest
fi

read -p "Push to repo? (y/n)"
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker push docker-repo.bloomington.in.gov/library/open311-nodejs:$buildtag
fi

