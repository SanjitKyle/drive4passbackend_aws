const m2s = require('mongoose-to-swagger');

// Import all models
const School = require('../models/school.model');
const Branch = require('../models/branch.model');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const Admission = require('../models/admission.model');
const Course = require('../models/course.model');
const Section = require('../models/section.model');
const Session = require('../models/session.model');
const Specialization = require('../models/specialization.model');
const Category = require('../models/category.model');

// LMS Models
const Lead = require('../models/LMS/lead.model');
const LeadStatus = require('../models/LMS/leadstatus.model');
const LeadSource = require('../models/LMS/leadsource.model');
const LeadType = require('../models/LMS/leadtype.model');
const LeadTagging = require('../models/LMS/lead_tagging.model');
const Institute = require('../models/LMS/institute.model');

// FEE Models
const FeeType = require('../models/FEE/feetype.model');
const FeePayment = require('../models/FEE/feepayment.model.js');
const FeeInstallment = require('../models/FEE/feeinstallment.model');
const FeeInstallmentMaster = require('../models/FEE/feeinstallmentmaster.model');
const PaymentMode = require('../models/FEE/paymentmode.model');

// DS Models
const Booking = require('../models/DS/booking.model');
const Area = require('../models/DS/area.model');
const InstructorMaster = require('../models/DS/instructor_master.model');
const InstructorWorkingDay = require('../models/DS/instructor_working_day.model');
const InstructorWorkingHour = require('../models/DS/instructor_working_hour.model');
const Money = require('../models/DS/money.model');
const PackageMaster = require('../models/DS/package_master.model');
const PriceMaster = require('../models/DS/price_master.model');
const Pupil = require('../models/DS/pupil.model');
const PupilCredits = require('../models/DS/pupil_credits.model');
const PupilCreditLogs = require('../models/DS/pupil_credit_logs.model');
const Sale = require('../models/DS/sale.model');
const WeeklyAvailability = require('../models/DS/weekly_availability');

const schemas = {
    School: m2s(School),
    Branch: m2s(Branch),
    User: m2s(User),
    Student: m2s(Student),
    Admission: m2s(Admission),
    Course: m2s(Course),
    Section: m2s(Section),
    Session: m2s(Session),
    Specialization: m2s(Specialization),
    Category: m2s(Category),

    // LMS
    Lead: m2s(Lead),
    LeadStatus: m2s(LeadStatus),
    LeadSource: m2s(LeadSource),
    LeadType: m2s(LeadType),
    LeadTagging: m2s(LeadTagging),
    Institute: m2s(Institute),

    // FEE
    FeeType: m2s(FeeType),
    FeePayment: m2s(FeePayment),
    FeeInstallment: m2s(FeeInstallment),
    FeeInstallmentMaster: m2s(FeeInstallmentMaster),
    PaymentMode: m2s(PaymentMode),

    // DS
    Booking: m2s(Booking),
    Area: m2s(Area),
    Instructor: m2s(InstructorMaster),
    InstructorWorkingDay: m2s(InstructorWorkingDay),
    InstructorWorkingHour: m2s(InstructorWorkingHour),
    Money: m2s(Money),
    PackageMaster: m2s(PackageMaster),
    PriceMaster: m2s(PriceMaster),
    Pupil: m2s(Pupil),
    PupilCredits: m2s(PupilCredits),
    PupilCreditLogs: m2s(PupilCreditLogs),
    Sale: m2s(Sale),
    WeeklyAvailability: m2s(WeeklyAvailability)
};

module.exports = schemas;
