var GridIt = GridIt || {};

GridIt.init = function () {
  // Ajax config
  GridIt.ajaxSetup();

  // Retrieve DOM data
  GridIt.getElectric();
  GridIt.getGas();

  // Attach event listeners here

  $('form').on('submit', GridIt.saveBill );
  $('.electric-show').on('click', function (event) {
    event.preventDefault();
    $('.electric-container').toggle();
  });
  $('.gas-show').on('click', function (event) {
    event.preventDefault();
    $('.gas-container').toggle();
  });
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

// In case I need to sort the data
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
    },
    beforeSend: function () {
      $('.loader').html('Getting right back to you.');
    }
  }).done(function (data) {
    $('.loader').html('');

    bill.id = data.bill.id;
    bill.temperature = data.bill.temperature;
    bill.prediction = data.bill.prediction;

    // Add bill to data collection
    if (bill.utility === 'gas') {
      GridIt.gasBills.push(bill);
      $('.gas-bills .table tr:eq(0)').after(bill.renderRow());
    } else {
      GridIt.electricBills.push(bill);
      $('.electric-bills .table tr:eq(0)').after(bill.renderRow());
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
        $('p.gas-prediction').html("Your predicted amount is $" + predicted.amount +
          " with avg monthly temperature of " + predicted.temperature + " degrees.");
        $('.gas-bills .table tr:eq(0)').after(predicted.renderRow());
        $('.gas-container .view form').hide();
      } else {
        GridIt.electricBills.push(predicted);
        $('p.electric-prediction').html("Your predicted amount is $" + predicted.amount +
          " with avg monthly temperature of " + predicted.temperature + " degrees.");
        $('.electric-bills .table tr:eq(0)').after(predicted.renderRow());
        $('.electric-container .view form').hide();
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
