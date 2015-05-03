// Algorithm one from the paper
// Computer Specs : Alan - 2.3GHz Intel Core i7 - 6 MB L3 cache
//                  Might have 8192 cache sets (2^13) with 12 lines of 64 bytes (2^6)

// probeView from paper - for invalidation
var probeBuffer = new ArrayBuffer(8192 * 1024); // 8 MB eviction buffer
var probeView = new DataView(probeBuffer); 
// primeView from paper - testing data retrieval
var primeBuffer = new ArrayBuffer(8192 * 1024);
var primeView = new DataView(primeBuffer); 
var x = 1; // page in question mb

// L3 cache line size
var offset = 64;

while (true) {
  // iteratively access all members of S
  var current;
  for (var i = 0; i < ((8192 * 1023) / offset); i++) {
    current = probeView.getUint32(i * offset);
  }

  // first retrieval, hypothesized to be from RAM
  var startTime1 = window.performance.now();
  current = primeView.getUint32(x);
  var endTime1 = window.performance.now();
  var diffTime1 = endTime1 - startTime1;

  // select random page s from S and remove it

  // iteratively access all members of S\s

  // second retrieval, hope it is significantly faster (if not, then not in same cache set as x)
  var startTime2 = window.performance.now();
  current = primeView.getUint32(x);
  var endTime2 = window.performance.now();
  var diffTime2 = endTime2 - startTime2;

  if (diffTime1 - diffTime2 > threshold) { // then place s back into S, in same cache set
    
  }
}
