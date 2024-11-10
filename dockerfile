FROM nginx:alpine

RUN mkdir /astro
WORKDIR /astro
COPY . .
RUN rm .env
RUN chmod +x /astro/daily-rebuild-cron-script.sh
RUN chmod +x /astro/docker-startup-script.sh
RUN apk add --update npm=10.8.0-r0
RUN npm i && npx astro telemetry disable
RUN cp -r /astro/dist/* /usr/share/nginx/html

RUN (crontab -l 2>/dev/null; echo "0 3 * * * /bin/sh /astro/daily-rebuild-cron-script.sh") | crontab -

EXPOSE 80

CMD ["/bin/sh", "/astro/docker-startup-script.sh"]
