var GridIt = GridIt || {};

GridIt.init = function () {
  // Ajax config
  GridIt.ajaxSetup();

  // Retrieve DOM data
  GridIt.getElectric();
  GridIt.getGas();

  // Attach event listeners here

  $('form').on('submit', GridIt.saveBill );
};

// Retrieve the list of bills from DOM
GridIt.getElectric = function () {
  this.electricBills = JSON.parse($('.electric-bills').attr('data'));
  return true;
};

GridIt.getGas = function () {
  this.gasBills = JSON.parse($('.gas-bills').attr('data'));
  return true;
};

GridIt.compare = function (a, b) {
  if (a.bill_period > b.bill_period)
     return -1;
  if (a.bill_period < b.bill_period)
     return 1;
  // a must be equal to b
  return 0;
};

// Event handler for any form submission on main page
GridIt.saveBill = function (event) {
  event.preventDefault();
  var $form = $(event.target),
    $amount = $form.find("#bill_amount"),
    $bill_period = $form.find("#bill_bill_period"),
    $utility = $form.find("#bill_utility");

  // Validations
  if ($amount.val() === '' || $bill_period.val() === '') {
    $('p.alert').html('Need to populate both the amount and bill period.');
    return false;
  } else {
    $('p.alert').html('');
  }

  var bill = new GridIt.Bill($amount.val(), $bill_period.val(), $utility.val());

  $.ajax({
    type: 'POST',
    url: '/bills',
    data: { bill : {
      amount : bill.amount,
      bill_period : bill.bill_period,
      utility : bill.utility
      }
    }
  }).done(function (data) {
    bill.id = data.bill.id;
    bill.temperature = data.bill.temperature;
    bill.prediction = data.bill.prediction;

    // Add bill to data collection
    if (bill.utility === 'gas') {
      GridIt.gasBills.push(bill);
      $('.gas-bills .table').prepend(bill.renderRow());
    } else {
      GridIt.electricBills.push(bill);
      $('.electric-bills .table').prepend(bill.renderRow());
    }

    // create a new predicted bill if received
    if (data.predicted !== undefined ) {
      var predicted = new GridIt.Bill(data.predicted.amount, data.predicted.bill_period,
        data.predicted.utility);
      predicted.id = data.predicted.id;
      predicted.temperature = data.predicted.temperature;
      predicted.prediction = data.predicted.prediction;

      // Add predicted to collection
      if (predicted.utility === 'gas') {
        GridIt.gasBills.push(predicted);
        $('.gas-bills .table').prepend(predicted.renderRow());
      } else {
        GridIt.electricBills.push(predicted);
        $('.electric-bills .table').prepend(predicted.renderRow());
      }
    }

    // TODO - call method to redraw graph

    // Clean up
    $form.hide();
    $form.next().show();
  });
};


// Make sure to have our CSRF token on all post requests
GridIt.ajaxSetup = function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });
};
