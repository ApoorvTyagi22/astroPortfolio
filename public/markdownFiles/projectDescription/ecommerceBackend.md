---
title: "Backend Of An e-commerce website"
subtitle: "Building the backend of an ecommerce website using express, and mongoose."
date: "6 Aug 2024"
---

## Note

The code for this project can be found on [GitHub](https://github.com/ApoorvTyagi22/BackEndProject.git). The code is fully documented. Some images may take a while to load on this webpage.

# Introduction

The problem statement is to make the backend of an e-commerce website, which should have the following features:

1. allows the users to register and log in.
2. The users can be of two types, admin and customer.
3. The admin can add categories and products to the website.
4. The customers can view the products and add them to the cart.
5. The customers can also view the cart and place an order.
6. The admin can view the orders placed by the customers.

The project is structured in a way so that it can easily be extended to accommodate more features. The entire code is divided into 4 parts:

1. **Models**: Contains the schema of the collections in the database.
2. **Routes**: Contains the routes of the project.
3. **Controllers**: Contains the main logic of handling the requests.
4. **Middleware**: Contains the middleware functions that are used to authenticate the user.

This structure makes the modules loosely coupled promoting better coding practices. We make use of Postman to send API requests to the server.

Backend systems like this play a crucial role in enabling online businesses to operate effectively. It helps the business in the following aspects:

1. Scalability and Growth
2. Security
3. Customer Experience

# Background

This program makes use of **REST APIs** which stands for (Representational State Transfer Application Programming Interfaces). They are a set of rules and principles that allow different software systems to communicate over the web.

Some of the key features of REST APIs are:

1. The client has to send the state in each request.
2. They are hosted on the server and utilize HTTP methods to perform the operations.

3. The following operations are used in this program:
   1. **GET**: To fetch the data
   2. **POST**: To create the data
   3. **PUT**: To update the data
   4. **DELETE**: To delete the data

Additionally, The raw password is never stored in the database as it is not secure. The password is hashed before storing it in the database (**bcryptjs** is used for this). Hashing is a one-way function; it converts the password into a fixed-length string using the given salt value. The same password will always generate the same hash. Thus, the hash is the string that is stored as the password in the database. When the user logs in, the password entered by the user is hashed and compared with the hash stored in the database. If the hashes match, the user is authenticated. As mentioned above, a salt value is also given during the initialization of the hash, the value adds a random string to the hash which in turn helps in tackling against dictionary attacks.

Consecutively, **Token-based authentication** is utilized in the solution. When the user logs in, a token is generated and sent to the user. Following this, the token is set as the header of the request. The token is verified by the server before processing the request. If the token is valid, the request is processed. If the token is invalid, the request is rejected. In addition, the token has limited time validity. The token is generated using the jsonwebtoken library.

**Mongoose** is used to interact with the MongoDB database. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model the application data. Mongoose is used to define the schema of the collections used in our program.

Mongoose is used to:

1. Create the models
2. Interact with the database and Perform essential operations

Express is used to create the server. Express is a flexible Node.js web application framework. It provides a robust set of features for web and mobile applications. Express is used to create the server and listen to the HTTP requests.

# Implementation

![Design Flowchart](/Figures/ecommerceBackend/backendDesignArchitecture.jpg)

The flow chart above represents the entire workflow of the program, and how all the modules work together to deliver the final product. The request body is sent to the server in JSON format. Which is then sent to the routers and then to the middleware. If the request is valid, it is sent to the controllers.

The controllers then communicate with the database using the models. The response is then sent back to the client. This structure improves code readability, while also streamlining future development and simplifying ongoing maintenance. API calls are responded with a status code and a message. The status code is used to identify the type of response.

The following status codes are used in the project:

![API response chart](/Figures/ecommerceBackend/ApiResponse.jpg)

Using these status codes makes it easy to identify the type of response. Furthermore, the message is also sent along with the status code. The message is used to provide additional information about the response.

# Conclusion

Conclusively, This project is a simple backend implementation of an e-commerce website built using some key libraries such as express, mongoose, and bcrypt. It can be extended to include more features, or by adding a frontend to it.
