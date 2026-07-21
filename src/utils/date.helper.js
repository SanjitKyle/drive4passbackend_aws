/**
 * Sort installment months based on academic session start month
 * Example:
 * months = [1,2,3,4,5,6]
 * sessionStart = 4
 * Result => [4,5,6,1,2,3]
 */
exports.sortInstallmentMonths = (months = [], sessionStart = 1) => {
  if (!Array.isArray(months)) return [];

  return months.sort((a, b) => {
    const aOrder = a < sessionStart ? a + 12 : a;
    const bOrder = b < sessionStart ? b + 12 : b;
    return aOrder - bOrder;
  });
};


/**
 * Get last date of a month
 * month: 1-12
 * year: YYYY
 */
exports.getLastDateOfMonth = (year, month) => {
  return new Date(year, month, 0); // JS trick: day 0 = last day of previous month
};


/**
 * Calculate last due date based on fee_type.last_due_after_days
 * If last_due_after_days = 5 → 5th of next month
 * If last_due_after_days = "LAST" → last day of month
 */
exports.calculateLastDueDate = (year, month, last_due_after_days) => {
  if (last_due_after_days === "LAST") {
    return exports.getLastDateOfMonth(year, month);
  }

  return new Date(year, month - 1, last_due_after_days);
};


/**
 * Check if payment is late
 */
exports.isLatePayment = (dueDate, lastDueDate) => {
  return new Date(dueDate) > new Date(lastDueDate);
};


/**
 * Generate due date for installment
 * Default = 1st of month
 */
exports.generateDueDate = (year, month) => {
  return new Date(year, month - 1, 1);
};
