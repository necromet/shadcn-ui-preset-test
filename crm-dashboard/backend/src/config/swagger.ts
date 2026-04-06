import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Church Management System API',
      description:
        'API for managing church members, cell groups (CGF), attendance, ministries, and events.',
      version: '1.0.0',
      contact: {
        name: 'Church Admin',
        email: 'admin@church.org',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Local development server',
      },
    ],
  },
  apis: [path.resolve(__dirname, '../../openapi.yaml')],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
