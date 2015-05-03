// Alan - 2.3GHz Intel Core i7 - 6 MB L3 cache
// Might have 8192 cache sets (2^13) with 12 lines of 64 bytes (2^6)
// Check if your system has a similar cache.

// should need to use pointer chasing method from : http://www.tau.ac.il/~tromer/papers/cache-joc-20090619.pdf - Why not?

$(document).ready(function() {
// probeView from paper - for invalidation
var probeBuffer = new ArrayBuffer(8192 * 1024); // 8 MB eviction buffer
var probeView = new DataView(probeBuffer); 
// primeView from paper - testing data retrieval
var primeBuffer = new ArrayBuffer(8192 * 1024);
var primeView = new DataView(primeBuffer); 

// L3 cache line size
var offset = 64;
// page in question mb
var x = 1;
var numRounds = 1000;

// initial data
var flushed1 = [];
var unflushed1 = [];
var unflushed2 = [];
var flushed2 = [];


// invalidation of all cache sets in L3 buffer
var current;

for (var round = 0; round < numRounds; round++) {
  for (var i = 0; i < ((8192 * 1023) / offset); i++) {
    current = probeView.getUint32(i * offset);
  }

  // first retrieval, hypothesized to be from RAM
  var startTime1 = window.performance.now();
  current = primeView.getUint32(x);
  var endTime1 = window.performance.now();
  var diffTime1 = endTime1 - startTime1;

  // second retrieval, hypothesized to be from L3
  var startTime2 = window.performance.now();
  current = primeView.getUint32(x);
  var endTime2 = window.performance.now();
  var diffTime2 = endTime2 - startTime2;

  // third retrieval, hypothesized to be from L3
  var startTime3 = window.performance.now();
  current = primeView.getUint32(x);
  var endTime3 = window.performance.now();
  var diffTime3 = endTime3 - startTime3;

  // eviction round 2
  for (var i = 0; i < ((8192 * 1023) / offset); i++) {
    current = probeView.getUint32(i * offset);
  }

  // fourth retrieval, hypothesized to be from RAM
  var startTime4 = window.performance.now();
  current = primeView.getUint32(x);
  var endTime4 = window.performance.now();
  var diffTime4 = endTime4 - startTime4;

  /**
  console.log("ROUND " + round);
  console.log(diffTime1 - diffTime2); // diffTime1 generally should be > diffTime2 : TRUE
  console.log(diffTime3 - diffTime2); // should be around 0 / alternate between positive and negative? : TRUE
  console.log(diffTime4 - diffTime1); // should be around 0 / alternate between positive and negative? : TRUE - round 0 is strangely always positive
  **/

  /**
  console.log("ROUND " + round);
  console.log(diffTime1);
  console.log(diffTime2);
  console.log(diffTime3);
  console.log(diffTime4);
  **/

  flushed1.push(Math.floor(diffTime1 * 100000));
  unflushed1.push(Math.floor(diffTime2 * 100000));
  unflushed2.push(Math.floor(diffTime3 * 100000));
  flushed2.push(Math.floor(diffTime4 * 100000));
}

var flushed1Data = toPD(flushed1);
var unflushed1Data = toPD(unflushed1);

// jqplot data visualization
plot1 = $.jqplot("chart1", [flushed1Data, unflushed1Data], {
  title: "Probability Density Function : flushed vs unflushed",
  cursor: {
      show: false
  },
  highlighter: {
      show: true,
      showMarker: false,
      useAxesFormatters: false,
      formatString: '%d, %.1f'
  },
  axesDefaults: {
      labelRenderer: $.jqplot.CanvasAxisLabelRenderer
  },
  seriesDefaults: {
      showMarker: false
  },
  series:[
    {label: 'flushed'},
    {label: 'unflushed'}
  ],
  legend: {
    show: true,
    location: 'ne'
  },
  axes: {
      xaxis: {
          label: 'Access Latency (10^-5 seconds)',
          pad:0,
          ticks: [],
          tickOptions: {
              formatString: "%d"
          },
          max: 50
      },
      yaxis: {
          label: 'Probability Density (%)',
          forceTickAt0: true,
          pad: 0
      }
  },
  grid: {
      drawBorder: false,
      shadow: false,
      background: "white"
  },
  canvasOverlay: {
      show: true
  }
});

});


///////////////////////////////////////////////////////
// Helper methods

// convert list of data points to probability density
var toPD = function(data) {
  counts = {}
  data.forEach(function(el) {
    if (el in counts) {
      counts[el] += 1;
    } else {
      counts[el] = 1;
    }
  });

  pdData = []
  for (var el in counts) {
    pdData.push([el, counts[el]/data.length]);
  }

  pdData.sort(function(a,b) {return a[0] - b[0];});
  // remove outliers
  while(pdData[pdData.length - 1][0] > 50) {
    pdData.pop();
  }

  return pdData;
}
