# Use Nginx for serving static web files
FROM nginx:alpine

# Copy project files
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
