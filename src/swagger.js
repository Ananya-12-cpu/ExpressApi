const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express Todo API",
      version: "1.0.0",
      description: "API documentation for the Express Todo app",
    },
    servers: [
      {
        url: "http://localhost:3000", // Change if your server runs on a different port
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AddUpdateUser: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            // add other fields as needed
          },
        },
        AddUpdateTodo: {
          type: "object",
          required: ["title", "description", "completed", "userId"],
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" },
            userId: { type: "integer" },
            // add other fields as needed
          },
        },
        AddUpdateRole: {
          type: "object",
          required: ["name", "description"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            // add other fields as needed
          },
        },
        // Add more schemas as needed
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
