# Build stage
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL
# Build your app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Overwrite the default Nginx config
RUN printf 'server {\n\
    listen 80;\n\
    server_name citeassist.uni-goettingen.de;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 to the Docker host, so we can access it 
# from the outside.
EXPOSE 80

# No need for CMD because using nginx's default command
