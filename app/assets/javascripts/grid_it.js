var GridIt = GridIt || {};

GridIt.init = function () {
  // Ajax config
  GridIt.ajaxSetup();

  // Retrieve DOM data
  GridIt.getElectric();
  GridIt.getGas();

  // Attach event listeners here

  $('.form').on('submit', function (event) {
    event.preventDefault();
    var formType = this.classList[1],
      $node = $(this),
      $form = $(event.target);
    GridIt.saveBill($form, formType, $node, 'post');
  });
  $('.electric-show').on('click', function (event) {
    event.preventDefault();
    $('.electric-container').toggle();
    GridIt.Graph3.draw('electric');
  });
  $('.gas-show').on('click', function (event) {
    event.preventDefault();
    $('.gas-container').toggle();
    GridIt.Graph3.draw('gas');
  });
  // Clear out any messages
  $('.jumbotron').on('click', function () {
    $('p.alert').html('');
    $('p.notice').html('');
  });

  // Edit bill router
  $('.edit-bill-container').on('click', function (event) {
    event.preventDefault();
    var actionType = event.target.className;
    var $form = $(event.target).parent().find('form');

    // Route depending on target
    if (actionType === "exit-edit" ) {
      $('.edit-bill-container').hide();
      $('p.alert').html('');
    } else if (actionType === "bill-submit") {
      console.log('clicked!');
      GridIt.saveBill($form, 'edit-form', 'undefined', 'patch');
    }
  });

  // Event listeners for bills on table
  $('.electric-bills .table').on('click', function () {
    var index = $(event.target).parent().index() - 1;
    var bill = GridIt.electricBills[index];
    var $container = $('.edit-bill-container');
    console.log(bill);

    $container.load('/bills/' + bill.id + '/edit .edit-bill');
    $container.show();
  });

  // $('.gas-bills .table')
};

// Retrieve the list of bills from DOM
GridIt.getElectric = function () {
  var dataString = $('.electric-graph').attr('data');
  if ( dataString !== undefined ) {
    this.electricBills = JSON.parse(dataString);
    return true;
  }
};

GridIt.getGas = function () {
  var dataString = $('.gas-graph').attr('data');
  if ( dataString !== undefined ) {
    this.gasBills = JSON.parse(dataString);
    return true;
  }
};

// In case I need to sort the data
GridIt.compare = function (a, b) {
  if (a.amount > b.amount)
     return -1;
  if (a.amount < b.amount)
     return 1;
  // a must be equal to b
  return 0;
};

// Event handler for any form submission on main page
GridIt.saveBill = function ($form, formType, $node, method) {
  var $amount = $form.find("#bill_amount"),
    $bill_period = $form.find("#bill_bill_period"),
    $utility = $form.find("#bill_utility"),
    url;

  if (formType === 'edit-form') {
    url = $form.attr('action');
  } else {
    url = '/bills';
  }

  // Run validation check
  if (!GridIt.validations($amount.val(), $bill_period.val(), $utility.val(), formType)) {
    return false;
  }
  var bill = new GridIt.Bill($amount.val(), $bill_period.val(), $utility.val());

  $.ajax({
    type: method,
    url: url,
    data: { bill : {
      amount : bill.amount,
      bill_period : bill.bill_period,
      utility : bill.utility
      }
    },
    beforeSend: function () {
      $('.loader').show();
    }
  }).done(function (data) {
    $('.loader').hide();

    bill.id = data.bill.id;
    bill.temperature = data.bill.temperature;
    bill.prediction = data.bill.prediction;

    // Add bill to data collection
    if (bill.utility === 'gas') {
      GridIt.gasBills.push(bill);
      $('.gas-bills .table').append(bill.renderRow());
    } else {
      GridIt.electricBills.push(bill);
      console.log(bill);

      $('.electric-bills .table').append(bill.renderRow());
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
        $('.gas-bills .table').append(predicted.renderRow());
      } else {
        GridIt.electricBills.push(predicted);
        $('p.electric-prediction').html("Your predicted amount is $" + predicted.amount +
          " with avg monthly temperature of " + predicted.temperature + " degrees.");
        $('.electric-bills .table').append(predicted.renderRow());
      }
    }

    // call method to redraw graph
    GridIt.Graph3.draw('electric');
    GridIt.Graph3.draw('gas');
    // Clean up
    $form.parent().next().show();

    // Show predict if ready
    if ($node !== 'undefined' ) {
      GridIt.hideSetup($node.parent());
    }

    $form.parent().remove();
    $('.edit-bill-container').hide();
  }).fail( function (error) {
    $('.loader').hide();
    $('p.alert').html("Something went wrong. Try again.");
    return false;
  });
};

GridIt.validations = function (amount, bill_period, utility, type) {
  var bills, bill, date, bill_date, test_date;

  if ( utility === 'electric') {
    bills = GridIt.electricBills;
  } else {
    bills = GridIt.gasBills;
  }

  // First check that fields are populated at all
  if (amount === '' || bill_period === '') {
    $('p.alert').html('Need to populate both the amount and bill period.');
    return false;
  }

  // Convert strings to correct data type explicitly
  amount = parseFloat(amount);
  date = new Date(bill_period);
  // Fix the date - one day ahead
  date.setDate(date.getDate() + 1);

  // Check to see if there is already a bill for that month
  bill = $.grep(bills, function (n, i) {
    bill_date = new Date(n.bill_period);
    bill_date.setDate(bill_date.getDate() + 1);
    return bill_date.getMonth() === date.getMonth() &&
      bill_date.getYear() === date.getYear() &&
      !n.prediction;
  });

  // General validations
  // Amount needs to be the correct format
  if (isNaN(amount) || amount < 0 ) {
    $('p.alert').html('Amount needs to be a positive number.');
    return false;
    // Bill_period needs to be earlier than current month
  } else if (date > Date.now()) {
    $('p.alert').html('Bill period should be no later than last month.');
    return false;
  } else if ( bill[0] !== undefined && type !== 'edit-form') {
    $('p.alert').html('Bill for this month was already saved.');
    return false;
  }

  // Form specific validations
  test_date = new Date();
  test_date.setMonth(test_date.getMonth() - 1);
  if (type === 'setup-form') {
    if ( Math.abs(date - test_date) / (1000 * 60 * 60 * 24) < 30 ) {
      $('p.alert').html("Bill can't be the previous month for the setup.");
      return false;
    } else if ( ((new Date() - date) / (1000 * 60 * 60 * 24 * 365.26)) > 1) {
      $('p.alert').html("Bill should be from within a year.");
      return false;
    }

  }
  if (type === 'predict-form') {
    if ( Math.abs(date - test_date) / (1000 * 60 * 60 * 24) > 30 ) {
      $('p.alert').html("Bill must be from the previous month in order to predict.");
      return false;
    }
  }
  // If all pass
  $('p.alert').html('');
  return true;
};

GridIt.hideSetup = function ($node) {
  if ($node.parent().find('.setup-form').length === 1) {
    $node.hide();
    $node.parent().find('.predict').removeClass('hide');
  }
};


// Make sure to have our CSRF token on all post requests
GridIt.ajaxSetup = function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });
};
