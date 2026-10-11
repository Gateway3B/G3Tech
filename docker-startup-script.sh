#!/bin/sh
set -eu
# Build with the API credentials supplied by the Portainer stack.
/bin/sh /astro/daily-rebuild-cron-script.sh
crond
exec nginx -g 'daemon off;'
