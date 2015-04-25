// Alan - 2.3GHz Intel Core i7 - 6 MB L3 cache
// Might have 8192 cache sets (2^13) with 12 lines of 64 bytes (2^6)

// probeView from paper - for invalidation
var probeBuffer = new ArrayBuffer(8192 * 1024); // 8 MB eviction buffer
var probeView = new DataView(probeBuffer); 
// primeView from paper - testing data retrieval
var primeBuffer = new ArrayBuffer(8192 * 1024); // 8 MB eviction buffer
var primeView = new DataView(primeBuffer); 

// L3 cache line size
var offset = 64;
// page in question mb
var x = 1;

// invalidation of all cache sets in L3 buffer
var current;
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

console.log(diffTime1 - diffTime2); // diffTime1 generally should be > diffTime2
console.log(diffTime3 - diffTime2); // should be around 0 / alternate between positive and negative?
