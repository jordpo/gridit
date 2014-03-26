var GridIt = GridIt || {};

GridIt.Graph3 = {};

GridIt.Graph3.draw = function (utility) {
  var $container = $('.' + utility + '-graph'),
    data;
  $container.empty();

  // Retrieve data
  if (utility === 'electric') {
    data = GridIt.electricBills;
  } else {
    data = GridIt.gasBills;
  }

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = parseFloat($container.css('width')) - margin.left - margin.right,
      height = parseFloat($container.css('height')) - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.08);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select('.' + utility + '-graph').append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  data.forEach(function(d) {
    var date = new Date(d.bill_period);
    date.setDate(date.getDate() + 1);
    d.date = (date.getMonth() + 1) + "/" + date.getFullYear();
    d.amount = +d.amount;
  });

  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.amount; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("amount");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.amount); })
      .attr("height", function(d) { return height - y(d.amount); });

  var sortTimeout = setTimeout(function() {
    change(); }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(GridIt.compare)
        .map(function(d) { return d.date; }))
        .copy();

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.date); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
};
