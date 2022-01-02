#!/bin/bash

# BASE_DIR - base directory for the untrusty scripts
# SRC_FILE - BASE_DUR plus the name of the text file where the source code resides
# BIN_FILE - BASE_DUR plus the name of the file that will execute the program resides
# INPUT_FILE - BASE_DUR plus the name of the file that will be used as input for the program

cd "${BASE_DIR}"

for classfile in *.class; do
  classname=${classfile%.*}

  if javap -public ${classname} | fgrep -q "public static void main("; then
    if [ -n "${INPUT_FILE}" ]; then
      java ${classname} "$@" < "${INPUT_FILE}"
    else
      java ${classname} "$@"
    fi
  fi
done
