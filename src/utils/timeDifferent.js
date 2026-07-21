const getTotalHours = (booking_date, start_time, end_time) => {
  const start = new Date(`${booking_date}T${start_time}:00`);
  let end = new Date(`${booking_date}T${end_time}:00`);

  if (isNaN(start) || isNaN(end)) {
    return NaN;
  }

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  const hours = (end - start) / (1000 * 60 * 60);

  return Number(hours);
};
module.exports = getTotalHours;
