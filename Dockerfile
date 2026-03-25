# A lightweight OS Kernel (shared with host)
FROM node:18-alpine

# set the working directory inside the container
WORKDIR /usr/src/app

# copy package.json to install libraries
COPY app/package*.json ./

# install dependencies (express)
RUN npm install

# copy the rest of the app code
COPY app/ .

# open port 3000 to access the site
EXPOSE 3000

# run the containerized process
CMD ["node", "index.js"]