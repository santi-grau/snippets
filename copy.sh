#!/bin/sh

# ----------> Setup
echo ┌─────────────────────────┐
echo │ OK! Lets get started... │
echo └─────────────────────────┘
read -p '└─────> Project name : ' varname
read -p '└─────> Project source : ' source
echo

if [ -d "app/snippets/${varname}" ]; then
  echo 😡 That project already exists!!!
  echo 😔 Sorry, bye
  exit
fi

if [ ! -d "app/snippets/${source}" ]; then
  echo 😔 No source project found
  exit
fi

# ----------> Copy

cp -a "app/views/${source}.pug" "app/views/${varname}.pug"
cp -r "app/snippets/${source}" "app/snippets/${varname}"

echo Copied ${source} to ${varname}

# ----------> End