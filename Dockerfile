# Gunakan Debian 10 (buster) agar kompatibel dengan host Debian 9
FROM node:18-buster

# Ganti repo ke archive.debian.org biar bisa apt-get update
RUN sed -i 's|deb.debian.org|archive.debian.org|g' /etc/apt/sources.list && \
    sed -i 's|security.debian.org|archive.debian.org|g' /etc/apt/sources.list && \
    apt-get -o Acquire::Check-Valid-Until=false update && \
    apt-get install -y mariadb-client bash && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm audit fix || true

COPY . .
RUN rm -f .env

# Generate Prisma Client di build time
RUN npx prisma generate

# Salin wait-for-it.sh ke container
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]
