# Use the official Bun image as the base
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /harhar

# Copy package files first to leverage Docker cache for dependencies
COPY package.json ./
COPY bun.lockb ./

# Install dependencies using Bun
RUN bun install

COPY . .
# COPY src ./
# COPY astro.config.mjs ./
# COPY eslint.config.mjs ./
# COPY tsconfig.json ./

# Build the Astro project
# RUN bun astro build

# Expose the port Astro will run on
EXPOSE 4321

# Run the Astro server
CMD ["bun", "run", "dev", "--host"]
