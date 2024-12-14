function formatDate(date) {
  const convertToDateObject = new Date(date);
  const getDay = convertToDateObject.getDate();
  const getMonth = convertToDateObject.getMonth() + 1;
  const getYear = convertToDateObject.getFullYear();
  return `${getDay}/${getMonth}/${getYear}`;
}

module.exports = { formatDate };
