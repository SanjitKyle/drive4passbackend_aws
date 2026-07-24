const express = require('express');
const dotenv = require('dotenv').config();
const connectMongoDb = require('./config/mongodb');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth.middleware');

const authRoutes = require('./routes/auth.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Allow all origins for development purposes.
// For production, you should restrict this to your frontend's domain.
app.use(cors({
  origin: ' * '
}));

// Connect to db
connectMongoDb();

app.get('/', (_, resp) => {
  resp.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/en', require('./routes/DS/enquiry_email.routes.js'));
app.use('/api/en', require('./routes/DS/course_form_email.routes.js'));
app.use('/api/en', require('./routes/DS/enquire.routes.js'));
app.use('/api/en', require('./routes/DS/course_form.routes.js'));
app.use('/api/en', require('./routes/DS/adi_training_form.routes.js'));
app.use('/api/en', require('./routes/DS/franchise_enquiry.routes.js'));


// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// App Routes
app.use('/api', require('./routes/auth.routes'));


// Group protected routes under authMiddleware
app.use('/api', authMiddleware, [
  require('./routes/school.routes'),
  require('./routes/branch.routes'),
  require('./routes/user.routes'),
  require('./routes/course.routes'),
  require('./routes/specialization.routes'),
  require('./routes/session.routes'),
  require('./routes/section.routes'),
  require('./routes/category.routes'),
  require('./routes/student.routes'),
  require('./routes/admission.routes'),
]);


app.use('/api', authMiddleware, [
  require('./routes/FEE/feetype.routes'),
  require('./routes/FEE/paymentmode.routes'),
  require("./routes/FEE/feeinstallment.route"),
  require("./routes/FEE/feeinstallmentmaster.route"),
  require("./routes/FEE/feepayment.routes.js")
]);

// LMS routes under /api/lms
app.use('/api/lms', authMiddleware, [
  require('./routes/LMS/institute.routes'),
  require('./routes/LMS/leadstatus.routes'),
  require("./routes/LMS/leadsource.routes"),
  require("./routes/LMS/leadtype.routes"),
  require("./routes/LMS/lead.routes"),
  require("./routes/LMS/lead_tagging.routes"),
]);

// DS routes under /api/ds
app.use('/api/ds', authMiddleware, [
  require('./routes/DS/uploads.routes'),
  require('./routes/DS/package_master.routes'),
  require('./routes/DS/instructor_master.routes'),
  require('./routes/DS/price_master.routes'),
  require('./routes/DS/instructor_working_day.routes'),
  require('./routes/DS/instructor_working_hour.routes'),
  require('./routes/DS/weekly_availability.js'),
  require('./routes/DS/sale.routes.js'),
  require('./routes/DS/pupil.routes.js'),
  require('./routes/DS/pupil_credits.routes.js'),
  require('./routes/DS/pupil_credits_log.routes.js'),
  require('./routes/DS/booking.routes.js'),
  require('./routes/DS/money.routes.js'),
  require('./routes/DS/area.routes.js'),
  require('./routes/DS/notification_routes.js'),
  require('./routes/DS/logs.routes.js'),
  require('./routes/DS/transfer.routes.js'),
  require('./routes/DS/subarea.routes.js'),
  require('./routes/DS/franchise_fees.routes.js'),
  require('./routes/DS/pdi_fees_amount.routes'),
  require('./routes/DS/internal_note.routes.js')
]);



// app.get('/*', (_, resp) => {
//  resp.status(404).json({ error: 'Route not found' });
// });


// 404 Not Found
app.use((req, res) => {
  res.json({ status: false, message: 'Invalid route request' });
});

// Global error handler
// app.use((err, req, res, next) => {
//   res.json({ status: false, message: 'Internal Server Error', err });
// });

// Error handler (at the end of all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
// app.listen(PORT);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
})
