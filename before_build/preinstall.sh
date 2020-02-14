#!/bin/bash
cd ./semantic/semantic-ui/
sed -i "" "s|@import url('https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin&display=swap')|/* removed */|g" semantic.css
