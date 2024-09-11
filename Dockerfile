FROM oven/bun:latest

WORKDIR /harhar

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

EXPOSE 4321

CMD ["bun", "run", "dev", "--host"]
