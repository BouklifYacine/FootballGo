FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY prisma ./prisma/

RUN npm pkg delete scripts.postinstall

RUN npm install

RUN npx prisma generate

RUN npm pkg set scripts.postinstall="prisma generate"

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]