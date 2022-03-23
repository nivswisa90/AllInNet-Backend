#First stage
FROM node as build
WORKDIR /backend
# Copy necessary files
COPY package.json .
#Install packages
RUN npm install -g npm@latest
RUN npm install --silent ignore-warnings

# Second stage
FROM node:slim
WORKDIR /backend
RUN useradd -ms /bin/bash ball
RUN chown -R ball:ball /backend 
RUN chmod 755 /backend
COPY . .
COPY --from=build /backend/node_modules ./node_modules
USER ball
# Main
ENTRYPOINT ["npm","start"]