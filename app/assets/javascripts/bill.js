var GridIt = GridIt || {};

GridIt.Bill = function (amount, bill_period, utility) {
  this.amount = amount;
  this.bill_period = bill_period;
  this.utility = utility;
};

GridIt.Bill.prototype.renderRow = function () {
  var $row = $('<tr>'),
    prediction_text,
    date = new Date(this.bill_period);
  date.setDate(date.getDate() + 1);

  if (this.prediction) {
    prediction_text = 'Yes';
  } else {
    prediction_text = 'No';
  }

  $row.append($('<td>', {html: (date.getMonth() + 1) + "/" + date.getFullYear() }));
  $row.append($('<td>', {html: "$" + this.amount }));
  $row.append($('<td>', {html: this.temperature + " F" }));
  $row.append($('<td>', {html: prediction_text }));

  return $row;
};
