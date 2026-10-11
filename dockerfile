FROM nginx:1.29.1-alpine

RUN apk add --no-cache nodejs npm
WORKDIR /astro
COPY package.json package-lock.json ./
RUN npm ci && npx astro telemetry disable
COPY . .
RUN chmod +x /astro/daily-rebuild-cron-script.sh
RUN chmod +x /astro/docker-startup-script.sh

RUN (crontab -l 2>/dev/null; echo "0 3 * * * /bin/sh /astro/daily-rebuild-cron-script.sh") | crontab -

EXPOSE 80

CMD ["/bin/sh", "/astro/docker-startup-script.sh"]
