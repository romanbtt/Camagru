# Use an official Nginx image as a base
FROM nginx:stable-alpine

# Copy static files to the Nginx document root
COPY . /usr/share/nginx/html

# The default command will start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]