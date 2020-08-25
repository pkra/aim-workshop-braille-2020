#!/bin/bash

set -e

for filename in $(ls *.in.html); do
  input="${filename%.*}"
  base="${input%.*}"
  brf="${base}.out.brf"
  roundtrip="${base}.out.round"
  file2brl --config-file "_plainhtml.cfg" "${filename}" > "${brf}"
  file2brl --backward "${brf}" > "${roundtrip}"
done