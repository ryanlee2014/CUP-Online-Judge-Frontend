#!/bin/bash
cd ./semantic/semantic-ui/
echo 'Curent path:'
pwd
if [[ "$OSTYPE" == "darwin"* ]]; then
sed -i "" "s|@import url('https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin&display=swap')|/* removed */|g" semantic.css
else
sed -i "s|@import url('https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin&display=swap')|/* removed */|g" semantic.css
fi
cd ../../
node before_build/build_version.js
