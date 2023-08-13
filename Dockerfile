FROM node:lts as build-stage
ARG MODE
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN if [$MODE = "development"];  \
    then npm run build; \
    else npm run build_production; \
    fi

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
