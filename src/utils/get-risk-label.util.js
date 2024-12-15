function getRiskLabel(accuracy) {
  switch (true) {
    case accuracy >= 0 && accuracy <= 30:
      return 'Saudável';
    case accuracy > 30 && accuracy <= 70:
      return 'Intermediário';
    case accuracy > 70 && accuracy <= 100:
      return 'Alto';
    default:
      return 'Não identificado';
  }
}

module.exports = { getRiskLabel };
