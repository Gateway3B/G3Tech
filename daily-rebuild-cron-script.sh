#!bin/sh
cd /astro && npx astro build && cp -r /astro/dist/* /usr/share/nginx/html && date > /astro/last-rebuilt.txt