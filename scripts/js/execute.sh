#!/bin/bash

# BASE_DIR - base directory for the untrusty scripts
# SRC_FILE - BASE_DUR plus the name of the text file where the source code resides
# BIN_FILE - BASE_DUR plus the name of the file that will execute the program resides
# INPUT_FILE - BASE_DUR plus the name of the file that will be used as input for the program

if [ -n "${INPUT_FILE}" ]; then
  node "${BIN_FILE}" < "${INPUT_FILE}"
else
  node "${BIN_FILE}"
fi
