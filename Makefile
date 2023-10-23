DOCKER := $(shell command -v docker 2> /dev/null)

VERSION := $(shell cat VERSION | tr -d "[:space:]")
COMMIT := $(shell git rev-parse --short HEAD)

default: build

dependencies:
ifndef DOCKER
	$(error "Docker is not installed")
endif

build: dependencies
	docker build --platform=linux/amd64 -t cob/open311-nodejs .

push:
	docker tag cob/open311-nodejs docker-repo.bloomington.in.gov/cob/open311-nodejs:test-${VERSION}-${COMMIT}
	docker push docker-repo.bloomington.in.gov/cob/open311-nodejs:test-${VERSION}-${COMMIT}
