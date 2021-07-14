exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.superBoard = (req, res) => {
  res.status(200).send("super Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("admin Content.");
};

exports.financeBoard = (req, res) => {
  res.status(200).send("finance Content.");
};
