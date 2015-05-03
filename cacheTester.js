// Alan - 2.3GHz Intel Core i7 - 6 MB L3 cache
// Might have 8192 cache sets (2^13) with 12 lines of 64 bytes (2^6)
// Check if your system has a similar cache.

// should need to use pointer chasing method from : http://www.tau.ac.il/~tromer/papers/cache-joc-20090619.pdf - Why not?

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


// invalidation of all cache sets in L3 buffer
var current;

for (var round = 0; round < 100; round++) {
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

  console.log("ROUND " + round);
  console.log(diffTime1 - diffTime2); // diffTime1 generally should be > diffTime2 : TRUE
  console.log(diffTime3 - diffTime2); // should be around 0 / alternate between positive and negative? : TRUE
  console.log(diffTime4 - diffTime1); // should be around 0 / alternate between positive and negative? : TRUE - round 0 is strangely always positive

  /**
  console.log(diffTime1);
  console.log(diffTime2);
  console.log(diffTime3);
  console.log(diffTime4);
  **/
}
