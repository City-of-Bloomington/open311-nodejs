FROM node:15.1 
# 15.14

# sort of a hack to make docker cache dependencies based on the state of
# package.json - will only run npm install again if package.json changes
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --loglevel verbose
RUN mkdir -p /home/node/uReport && cp -a /tmp/node_modules /home/node/uReport/

# the .dockerignore file will exclude the node_modules folder from being
# copied from the local machine when we ADD below
WORKDIR /home/node/uReport
ADD . /home/node/uReport

ENTRYPOINT [ "npm" ]