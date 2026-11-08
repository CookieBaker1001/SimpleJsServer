# Simple JS Server

A lightweight REST API and webbapplication built with Node.js and Express. This application allows users to perform the four fundamental API methods on images and text entries. The user can uppload, view, edit and delete images as well as create, view, search, edit and delete pieces of text. 

## Features
### Image management
- Upload png images
- Retrieve all uploaded images
- Display all images in a responsive HTML-page
- Rename and delete images

### Text management
- Create text entries
- Retrieve all text entries
- Search entries by their content
Edit content and delete text entries

## Technologies
Node.js
Express
Javascript
HTML
CSS
Docker

## API Endpoints
Images

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /images | Retrieve all images |
| GET | /images/:filename | Retrieve a specific image |
| POST | /images | Upload an image |
| PUT | /images/:filename | Edit an images name |
| DELETE | /images/:filename | Remove an image |

Texts

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /texts | Retrieve all text entries |
| GET | /texts?search=word | Search entries that contain some bit of text |
| POST | /texts | Upload a text entry |
| PUT | /texts/:filename | Edit the content of a text entry |
| DELETE | /texts/:filename | Remove a text entry |

## Run the application
This application requires you to have Docker installed on your machine.

To run the application, you need the docker image. To get the image you can either clone the Github-repository and run the Dockerfile within it, or you can pull the image from my Docker Hub account.

### Clone the repo
If you prefer to clone the repo, open a terminal and run the following commands:

    git clone https://github.com/CookieBaker1001/SimpleJsServer.git
    cs SimpleServer

(Note: At this stage you can just run the application in your IDE of choice if you want but that requires you to have Node.js installed on your machine.)

Build the Docker image

    docker build -t simple-js-server .

Run the container form a terminal

    docker run -d --name simple-js-server -p 8080:8080 -v simple-js-server-data:/app/uploads simple-js-server

### Pull the image
You can alternatively pull the docker image directly from my Docker Hub account

    docker run -d --name simple-js-server -p 8080:8080 -v simple-js-server-data:/app/uploads schneizelstein/simple-js-server:latest

Now that you have the image and a container-instance is running, you can access the application in your browser by navigating to:

    http://localhost:8080

You can then stop and start the container whenever you like with:

    docker stop simple-js-server
    docker start simple-js-server

## Learning experiences
- Building a webbapplication that features a REST API in Node.js/Express
- Working with HTTP-methods and handling request and response objects
- Separating code, logic and routes into modules
- Reading and writing files
- Containerizing the application using Docker