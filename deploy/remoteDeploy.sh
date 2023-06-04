#!/bin/sh
# Make sure this file has LF line endings and not CRLF line endings so it can run on linux.

cd ~/Documents/G3Tech/Server/G3Tech

docker load < g3tech.tar

docker compose down

docker compose up