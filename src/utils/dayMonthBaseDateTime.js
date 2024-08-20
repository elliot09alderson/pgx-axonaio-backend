
const moment = require('moment-timezone');

function getDateRange(month = null) {
  const tz = 'Asia/Kolkata'; // Indian timezone
  const now = moment().tz(tz);
  const startOfMonth = month !== null ? moment(month, 'M').tz(tz) : now.clone().startOf('month');
  const startDate = startOfMonth.format('YYYY-MM-DD') + ' 00:00:00';
  const endDate = now.format('YYYY-MM-DD') + ' 23:59:59';
  return {
    from: moment.tz(startDate, tz).toDate(),
    to: moment.tz(endDate, tz).toDate()
  };
}

module.exports = { getDateRange }