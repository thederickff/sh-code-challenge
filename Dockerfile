FROM node:14.16.0-slim

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3210

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm start