# University Confessions 🤫

A place for university students to anonymously complain, confess, and relate about the stupid things we do.

## Summary of Project

University confessions is a project for COMP 230: Databases, at the University of The Fraser Valley. This project was supposed to demonstrate using a SQL database in a real-world situation.

### Goals of the project

Beyond the fact that University Confessions is a university project, we hope that university confessions can be a place for students to:

1. Connect and communicate with other university students anonymously.
2. Openly share their thoughts on university events, policies, and goings-ons.
3. Contribute without being subjected to racism, sexism, or general harassment.

### Team Members

| Student Name | Github Account                                 |
| ------------ | ---------------------------------------------- |
| Aaron Creor  | [@AaronCreor](https://github.com/AaronCreor)   |
| Josh Gaulton | [@Teranoss](https://githubc.om/Teranoss)       |
| Mykal Machon | [@MykalMachon](https://github.com/MykalMachon) |

## Project Technologies

This project is a server-side rendered, web application that was built using the following technologies.

### Application

#### Server

- **Node.js** : An open-source javascript runtime that enables the creation of javascript applications with network, file, and general system access. We use this as the baseline for our server
- **Express** : An open-source node.js framework that makes configuring an http server application with Node.js much easier. We use his to manage how the application respons to http requests (handles incoming, and sends responses to client). 

#### Templates & Views

- **Liquid.js** : An open source templating language based on HTML and shopify's Liquid specification. We use this to create the apps Views (page templates)
- **Sass** : A CSS pre-compiler / spec that enables features like CSS nesting, variables, and more.

### Hosting

- **Heroku Hosting** : This is used to host our app that handles all incoming http requests, interacts with the an SQL database, and executes application logic.
- **Heroku PostgreSQL** : This hosts an PostgreSQL database that is accessed through our Node.js app


