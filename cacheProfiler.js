
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
// S[i] is true if "i" is in "x"'s set. S[i] is false if untried.
var S = {}
for (var i=0; i<8192*1023/offset; i++) {
  S[i] = false;
}

function accessMembers(set) {
  Object.keys(set).forEach(function(member) {
    probeView.getUint32(member * offset);
  });
}

function removeRandom(set) {
  untried = Object.keys(set).filter(function(member) {return !set[member];});
  s = Math.floor(Math.random() * Object.keys(untried).length)
  delete set[untried[s]]
}

threshold = 0.02

while (Object.keys(S).length > 12) {
  // iteratively access all members of S
  accessMembers(S);

  var current;
  // first retrieval, hypothesized to be from RAM
  var startTime1 = window.performance.now();
  current = primeView.getUint32(x);
  var endTime1 = window.performance.now();
  var diffTime1 = endTime1 - startTime1;

  // select random page s from S and remove it
  removeRandom(S)
  // iteratively access all members of S\s
  accessMembers(S);
  // second retrieval, hope it is significantly faster (if not, then not in same cache set as x)
  var startTime2 = window.performance.now();
  current = primeView.getUint32(x);
  var endTime2 = window.performance.now();
  var diffTime2 = endTime2 - startTime2;

  if (diffTime1 - diffTime2 > threshold) { // then place s back into S, in same cache set
    S[s] = true;
    console.log("Found in set: ", s)
  }
  if (Object.keys(S).length % 10000 === 0) {
    console.log("Number of Elements ", Object.keys(S).length);
  }
}
