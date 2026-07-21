const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My Driving School API with Swagger',
    version: '1.0.0',
    description:
      'This is a simple CRUD API application made with Express and documented with Swagger',
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Your Name',
      url: 'https://yourwebsite.com',
      email: 'info@email.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:8080/api',
      description: 'Development server',
    },
    {
      url: 'https://drivingserver.kyleinfotech.co.in/api',
      description: 'Live server',
    },
    {
      url: 'https://working.kyleinfotech.co.in/api',
      description: 'Live working server',
    },
    {
      url: 'https://api.drive4pass.co.uk/api',
      description: 'Live server for UK',
    },
  ],
  tags: [
    { name: 'Booking', description: 'Booking management' },
    { name: 'Sale', description: 'Sale management' },
    { name: 'Pupil', description: 'Pupil management' },
    { name: 'PriceMaster', description: 'Price Master management' },
    { name: 'PackageMaster', description: 'Package Master management' },
    { name: 'InstructorWorkingDay', description: 'Instructor Working Day management' },
    { name: 'Instructor', description: 'Instructor management' },
    // { name: 'FeePayment', description: 'Fee Payment management' },
    { name: 'FeeInstallment', description: 'Fee Installment management' },
    { name: 'FeeInstallmentMaster', description: 'Fee Installment Master management' },
    { name: 'FeeType', description: 'Fee Type management' },
    { name: 'PaymentMode', description: 'Payment Mode management' },
    { name: 'Admission', description: 'Admission management' },
    { name: 'Student', description: 'Student management' },
    { name: 'Section', description: 'Section management' },
    { name: 'Session', description: 'Session management' },
    { name: 'Specialization', description: 'Specialization management' },
    { name: 'Course', description: 'Course management' },
    { name: 'User', description: 'User management' },
    { name: 'Branch', description: 'Branch management' },
    { name: 'Auth', description: 'Authentication related endpoints' },
  ],
  components: {
    // schemas: require('../utils/swaggerSchemas'),
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js', './src/routes/Master/*.js', './src/routes/FEE/*.js', './src/routes/DS/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
