DOCKER := $(shell command -v docker 2> /dev/null)
COMPOSE := $(shell command -v docker-compose 2> /dev/null)

VERSION := $(shell cat VERSION | tr -d "[:space:]")
COMMIT := $(shell git rev-parse --short HEAD)

default: build

dependencies:
ifndef DOCKER
	$(error "Docker is not installed")
endif
ifndef COMPOSE
	$(error "Docker Compose is not installed")
endif

build: dependencies
	docker-compose build

push:
	docker tag open311-nodejs docker-repo.bloomington.in.gov/library/open311-nodejs:${VERSION}-${COMMIT}
	docker push docker-repo.bloomington.in.gov/library/open311-nodejs:${VERSION}-${COMMIT}
