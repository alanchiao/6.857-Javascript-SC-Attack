var probeBuffer = new ArrayBuffer(8192 * 1024);
var probeView = new DataView(probeBuffer);

var primeBuffer = new ArrayBuffer(8192 * 1024); // will find eviction sets in this
var primeView = new DataView(primeBuffer);

var offset = 64;


var pagesToOffset = []; // array of arrays, each representing an non-canonical page

// general algorithm : for each offset, representing a cache line, find the 11 others.
// in the 8MB array, we have 131k offsets (8192 * 1024 / 64 = 131k)
//
// 12 offsets form a cache set. 8192 cache sets.
// Need to take advantage of the fact that 12 offsets can only be together if they share bits 6 - 12. --> Sets of 8192 cache sets.


// iterate through entirety of probe buffer
function iterateProbeBuffer() {
  var current;
  for (var cline = 0; cline < ((8192 * 1024) / offset); cline++) {
    current = probeView.getUint32(cline * offset);
  } 
}

// find set of cachelines that share bits 6 - 12 with a given cacheline number
function findSearchSet(cachelineNum) {
  searchSet = []
  for (var cline = 0; cline < 8192 * 1024/offset; cline++) {
    if (cline === cachelineNum) { // don't want to search self again
      continue;
    }

    if (((cline * offset * 8) >> 6) % Math.pow(2, 7) === ((cachelineNum * offset * 8) >> 6) % Math.pow(2, 7)) {
      searchSet.push(cline);
    } 
  }
  return searchSet;
}


function checkInSameCacheSet(cline1, cline2) {
  iterateProbeBuffer();

  var current;

  var startTime1 = window.performance.now();
  current = primeView.getUint32(cline1 * offset);
  var endTime1 = window.performance.now();
  var diffTime1 = endTime1 - startTime1;
  
  var startTime2 = window.performance.now();
  current = primeView.getUint32(cline2 * offset);
  var endTime2 = window.performance.now();
  var diffTime2 = endTime2 - startTime2;
  console.log("diffTime1");
  console.log(diffTime1);
  console.log("diffTime2");
  console.log(diffTime2);
  if ((diffTime1 - diffTime2 > 16 * Math.pow(10, -5)) {
    return true;
  } else {
    return false;
  }
}

// find cache set of 11 other cache lines in the same
// cache set as cline
function findCacheSet(targetCline) {
  var searchSet = findSearchSet(targetCline);
  var cacheSet = [targetCline]
  for (var i = 0; i < searchSet.length; i++) {
    if (checkInSameCacheSet(targetCline, searchSet[i]) === true) {
      cacheSet.push(searchSet[i])
    }
  }
  return cacheSet;
}

console.log(findCacheSet(0));
