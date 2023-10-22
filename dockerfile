FROM node
# WORKDIR /app
# COPY package*.json /.
# RUN npm install
# COPY . .
# EXPOSE 8080
# CMD [ "npm", "start" ]

# para correr un container deberia llamarse con
# docker run -d -p 8080:8080 --name example_container example_image