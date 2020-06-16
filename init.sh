#!/bin/sh

# ----------> Setup
echo ┌─────────────────────────┐
echo │ OK! Lets get started... │
echo └─────────────────────────┘
read -p '└─────> Project name : ' varname
echo

if [ -d "app/snippets/${varname}" ]; then
  echo 😡 That project already exists!!!
  echo 😔 Sorry, bye
  exit
fi

# Create view

{
  echo "doctype"
  echo "html"
  echo "  head"
  echo "    meta(charset='utf-8')"
  echo "    meta(http-equiv='Content-Type',content='text/html; charset=utf-8')"
  echo "    meta(http-equiv='X-UA-Compatible', content='IE=edge')"
  echo "    meta(name='viewport', content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')"
  echo "    title Project title"
  echo "    link(rel='stylesheet' href='../snippets/${varname}/main.styl')"
  echo "  body"
  echo "    #main You should do something about this"
  echo "    script(src='../snippets/${varname}/index.js')"
} > app/views/${varname}.pug

# Create snippet dir
mkdir app/snippets/${varname}
{
  echo "@import '../../css/main.styl'"
  echo "#main"
  echo "    height 100%"
} > app/snippets/${varname}/main.styl

echo "console.log('here')" > app/snippets/${varname}/index.js

# ----------> End