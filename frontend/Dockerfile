FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build step is skipped in dev mode using volumes, but needed for production
# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
