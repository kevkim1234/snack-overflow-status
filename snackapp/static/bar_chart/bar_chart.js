//==============================================================================
//
//                                  bar_chart
//
// Appends a bar chart of the given data inside the DOM element with the given
// id. 'h' is the height in pixels of the chart. 'data' is assumed to be an
// array of objects, each of which has a 'key' field, which is to be the label
// on that datum's bar, and a 'stock' field, which will determine the height of
// the bar.
//
//==============================================================================

function bar_chart(id, h, data) {

      // container is the DOM element in which the chart will be appended (the
      // parent), and containerSize holds info on its dimenions and position
  var container = document.getElementById(id),
      containerSize = container.getBoundingClientRect(),

      // determine the SVG margins and width/height of the chart based on the
      // parent element's dimensions
      margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = containerSize.width - margin.left - margin.right,
      height = h - margin.top - margin.bottom,

      // small details
      textOffset = 6, axisOffset = 5,

      // categorical colors for bars
      google = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099",
                "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
                "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300",
                "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"],

      // determine the ordering of bars in interactivity functions
      byName = true, desc = true;

  // sort the data for when it is first displayed
  data.sort(function(a, b) {
    return b.stock - a.stock; // initially sorted by value, descending
  });

  //============================================================================
  //
  //                            MARGINS AND ANCHORS
  //
  //============================================================================

  var marginLabel = 100;  // TODO: make this better
  var marginValue = 30;   // TODO: make this better
  var marginChart = width - marginLabel - marginValue;

  var anchorSVG   = [margin.left, margin.top];
  var anchorLabel = [marginLabel - axisOffset, 0];
  var anchorChart = [marginLabel, 0];

  //============================================================================
  //
  //                                  SCALES
  //
  //============================================================================

  var scaleBarWidth   = d3.scaleLinear()
    										  .domain([0, data[0].stock])
                          .range([0, marginChart]);
  var scaleBarHeight  = d3.scaleBand()
    											.domain(data.map(key))
                          .range([0, height])
                          .paddingInner(0.1)
                          .paddingOuter(0.05);
  var scaleBarFill    = d3.scaleOrdinal()
                          .domain(data.map(key))
                          .range(google);
  var scaleLabel      = d3.scalePoint()
        									.domain(data.map(key))
                          .range([scaleBarHeight.step() / 2,
                                  height - scaleBarHeight.step() / 2]);

  //============================================================================
  //
  //                               SVG ELEMENTS
  //
  //============================================================================

  // the actual SVG
  var SVG = d3.select("#" + id)
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

  // the pseudo-SVG, with margins applied
  var svg = SVG.append("g").attr("id", "bar_chart");
  positionElement(svg, anchorSVG);

  // labels for bar names
  var axisLabel = d3.axisLeft(scaleLabel);
  var axisLabelVis = svg.append("g").attr("class", "axis").call(axisLabel);
  positionElement(axisLabelVis, anchorLabel);

  // bar chart
  var chart = svg.append("g").attr("id", "chart");
  positionElement(chart, anchorChart);

  // bars themselves
  var bars = chart.selectAll("rect")
  								.data(data, key)
                  .enter()
                  .append("rect")
                  .attr("x", xBar)
                  .attr("y", yBar)
                  .attr("height", heightBar)
                  .attr("fill", fillBar)
                  .on("click", sortBars);

  // labels for bar values
  var texts = chart.selectAll("text")
  								.data(data, key)
                  .enter()
                  .append("text")
  								.attr("x", 0) // is this the best starting spot?
                  .attr("y", yText)
  								.text(textText);

  // initial transitions (bars grow horizontally)
  bars.transition()
  		.delay(function(d, i) { return i * 25; })
  		.duration(function(d, i) { return 1000 - i * 25; })
  		.attr("width", widthBar);
  texts.transition()
  		.delay(function(d, i) { return i * 25; })
  		.duration(function(d, i) { return 1000 - i * 25; })
  		.attr("x", xText);

  // when the window is resized, the bar chart will also resize to fill the
  // container again (TODO: a way to attach this to container???)
  window.addEventListener("resize", updateChartSize);

  //============================================================================
  //
  //                          INTERACTIVITY FUNCTIONS
  //
  //============================================================================

  // sorts the data array by name if byName is true, else by value if byName is
  // false, then updates scales and SVG elements as appropriate
  function sortBars() {
    byName ? sortByName() : sortByValue();
    byName = !byName;
  }

  // sorts the data array and updates the chart (bars, text values) and labels
  // by name (data[i].stock)
  function sortByName() {
    data.sort(function(a, b) {
      return desc ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key);
    });
    updateChartOrder();
  }

  // sorts the data array and updates the chart (bars, text values) and labels
  // by value (data[i].stock)
  function sortByValue() {
    desc = !desc;
    data.sort(function(a, b) {
      return desc ? b.stock - a.stock : a.stock - b.stock;
    });
    updateChartOrder();
  }

  // updates the domains of the scales for the bar height and labels and
  // visually updates the chart (bars, text values) and labels
  function updateChartOrder() {
    scaleBarHeight.domain(data.map(key));
    scaleLabel.domain(data.map(key));
    bars.transition()
        .delay(function(d, i) { return i * 25; })
        .duration(function(d, i) { return 1000 - i * 25; })
        .attr("y", yBar);
    texts.transition()
        .delay(function(d, i) { return i * 25; })
        .duration(function(d, i) { return 1000 - i * 25; })
        .attr("y", yText);
    axisLabelVis.transition().duration(1000).call(axisLabel);
  }

  // updates containerSize, width, SVG width, marginChart, and scaleBarWidth
  // according to container's size, then visually updates the widths of the bars
  // and x-coordinates of the text values
  function updateChartSize() {
    containerSize = container.getBoundingClientRect();
    width = containerSize.width - margin.left - margin.right;
    SVG.attr("width", width + margin.left + margin.right);
    marginChart = width - marginLabel - marginValue;
    scaleBarWidth.range([0, marginChart]);
    bars.attr("width", widthBar);
    texts.attr("x", xText);
  }

  //============================================================================
  //
  //                            ATTRIBUTE FUNCTIONS
  //
  //============================================================================

  // bar attributes
  function xBar() { return 0; }
  function yBar(d) { return scaleBarHeight(d.key); }
  function widthBar(d) { return scaleBarWidth(d.stock); }
  function heightBar() { return scaleBarHeight.bandwidth(); }
  function fillBar(d) { return scaleBarFill(d.key); }

  // bar text value attributes
  function xText(d) { return d.stock ? widthBar(d) + textOffset : 0; }
  function yText(d) { return yBar(d) + scaleBarHeight.step() / 2 + 3; }
  function textText(d) { return d.stock === 0 ? "Out of stock!" : d.stock; }

  //============================================================================
  //
  //                                  HELPERS
  //
  //============================================================================

  // position the given element at the given anchor
  function positionElement(element, anchor) {
    element.attr("transform", "translate(" + anchor[0] + "," + anchor[1] + ")");
  }

  // returns the key field of the given object
  function key(d) {
    return d.key;
  }
}
