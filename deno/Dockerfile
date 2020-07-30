FROM hayd/alpine-deno:1.2.1

WORKDIR /app
USER deno

ADD . .
RUN deno cache index.ts

CMD ["run", "--allow-net", "index.ts"]