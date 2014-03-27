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
    GridIt.saveBill($form, formType, 'post', function () {

      // call method to redraw graph
      GridIt.Graph3.draw($form.find("#bill_utility").val());

      // Clean up
      $form.parent().next().show();
      GridIt.hideSetup($node.parent());

      $form.parent().remove();

      $('p.notice-bill').html('Bill saved.');
    });
  });

  // Show sections
  $('.electric-show').on('click', function (event) {
    event.preventDefault();
    $('.electric-container').toggle("slide", 1000);
    GridIt.Graph3.draw('electric');
  });
  $('.gas-show').on('click', function (event) {
    event.preventDefault();
    $('.gas-container').toggle("slide", 1000);
    GridIt.Graph3.draw('gas');
  });

  // Clear out any messages
  $('.row').on('click', function () {
    $('p.alert-bill, p.alert').html('');
    $('p.notice-bill, p.notice').html('');
  });

  // edit-bill-container event listener
  $('.edit-bill-container').on('click', GridIt.routeEdit);

  // Event listeners for bills on table
  $('.electric-bills .table').on('click', GridIt.showEdit);
  $('.gas-bills .table').on('click', GridIt.showEdit);

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

GridIt.showEdit = function (event) {
  var index = $(event.target).parent().index() - 1,
    bills,
    utility = $(this).parent().attr('class');

  if ( utility === 'electric-bills') {
    bills = GridIt.electricBills;
  } else {
    bills = GridIt.gasBills;
  }

  // Set current_selection properties
  GridIt.selectedRow = $(event.target).parent();
  GridIt.selectedBill = bills[index];
  var $container = $('.edit-bill-container');

  $container.load('/bills/' + bills[index].id + '/edit .edit-bill', function (response) {
    // Add the event listener for the delete link
    $('.delete-bill').on('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      console.log('delete!');
      GridIt.deleteBill($(event.target), function () {
        // delete from collection
        bills.splice(index, 1);
        //remove table row from DOM
        GridIt.selectedRow.remove();
        $('p.notice-bill').html('Bill deleted.');
        // clean up
        $('.edit-bill-container').hide();

        // call method to redraw graph
        if (utility === 'electric-bills') {
          GridIt.Graph3.draw('electric');
        } else {
          GridIt.Graph3.draw('gas');
        }
      });
    });
  });
  $container.show();
};

GridIt.routeEdit = function (event) {
  event.preventDefault();
  var actionType = event.target.className.split(' ')[0],
    $form = $(event.target).parent(),
    index = GridIt.selectedRow.index() - 1,
    bills, utility;

  utility = GridIt.selectedBill.utility;

  if ( utility === 'electric') {
    bills = GridIt.electricBills;
  } else {
    bills = GridIt.gasBills;
  }

  // Route depending on target
  if (actionType === "exit-edit" ) {
    $('.edit-bill-container').hide();
    $('p.alert-bill').html('');
  } else if (actionType === "bill-submit") {
    GridIt.saveBill($form, 'edit-form', 'patch', function () {
      // action to be taken after bill saved
      bills.splice(index, 1);
      GridIt.selectedRow.remove();
      $('.edit-bill-container').hide();
      GridIt.Graph3.draw(utility);
      $('p.notice-bill').html('Bill updated.');
    });
  }
};

// Event handler for any form submission on main page
GridIt.saveBill = function ($form, formType, method, callback) {
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
    // if predicted bill returned, insert it
    if (data.predicted !== undefined ) {
      GridIt.insertPredicted(data.predicted);
    }
    // apply changes to DOM via a callback
    callback();
  }).fail( function (error) {
    $('.loader').hide();
    $('p.alert-bill').html("Something went wrong. Try again.");
    return false;
  });
};

GridIt.insertPredicted = function (bill) {
  var predicted = new GridIt.Bill(bill.amount, bill.bill_period,
    bill.utility);
  predicted.id = bill.id;
  predicted.temperature = bill.temperature;
  predicted.prediction = bill.prediction;

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
};

GridIt.deleteBill = function ($link, callback) {
  var url = $link.attr('href');

  $.ajax({
    type: 'delete',
    url: url,
    beforeSend: function () {
      $('.loader').show();
    }
  }).done(function (data) {
    $('.loader').hide();
    // Update DOM
    callback();

  }).fail(function () {
    console.log('fail');
    $('.loader').hide();
    $('p.alert-bill').html("Something went wrong. Try again.");
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
    $('p.alert-bill').html('Need to populate both the amount and bill period.');
    return false;
  }

  // Convert strings to correct data type explicitly
  amount = parseFloat(amount);
  date = new Date(bill_period);
  // Fix the date - one day ahead
  date.setDate(date.getDate() + 1);

  // Check to see if there is already a bill for that month
  bill = $.grep(bills, function (n, i) {
    var bill_date = new Date(n.bill_period);

    bill_date.setDate(bill_date.getDate() + 1);
    return bill_date.getMonth() === date.getMonth() &&
      bill_date.getYear() === date.getYear() &&
      !n.prediction;
  });

  return GridIt.validationCheck(bill, amount, date, type);
};

GridIt.validationCheck = function (bill, amount, date, type) {
  // General validations
  // Amount needs to be the correct format
  if (isNaN(amount) || amount < 0 ) {
    $('p.alert-bill').html('Amount needs to be a positive number.');
    return false;
    // Bill_period needs to be earlier than current month
  } else if (date > Date.now()) {
    $('p.alert-bill').html('Bill period should be no later than last month.');
    return false;
  } else if ( bill[0] !== undefined && type !== 'edit-form') {
    $('p.alert-bill').html('Bill for this month was already saved.');
    return false;
  }

  // Form specific validations
  test_date = new Date();
  test_date.setMonth(test_date.getMonth() - 1);
  if (type === 'setup-form') {
    if ( Math.abs(date - test_date) / (1000 * 60 * 60 * 24) < 30 ) {
      $('p.alert-bill').html("Bill can't be the previous month for the setup.");
      return false;
    } else if ( ((new Date() - date) / (1000 * 60 * 60 * 24 * 365.26)) > 1) {
      $('p.alert-bill').html("Bill should be from within a year.");
      return false;
    }

  }
  if (type === 'predict-form') {
    if ( Math.abs(date - test_date) / (1000 * 60 * 60 * 24) > 30 ) {
      $('p.alert-bill').html("Bill must be from the previous month in order to predict.");
      return false;
    }
  }
  // If all pass
  $('p.alert-bill').html('');
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
