var buffer = new ArrayBuffer(8192 * 1024); // 8 MB eviction buffer
var lines = new DataView(buffer); 

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function probe(set, candidate) {
	buffer.getUint32(candidate);
	set.forEach(function (l) {
		buffer.getUint32(l);
	});
	var t1 = window.performance.now();
	buffer.getUint32(candidate);
	var t2 = window.performance.now();
	// threshold = ???
	return t2 - t1 > threshold;
}

conflict_set = []
lines.forEach(function (candidate) {
	if (!probe(conflict_set, candidate)) {
		conflict_set.push(candidate);
	}
});

lines.diff(conflict_set).forEach(function (candidate) {
	if (probe(conflict_set, candidate)) {
		eviction_set = []
		conflict_set.forEach(function (l) {
			if (!probe(conflict_set.diff([l]), candidate)) {
				eviction_set.push(l);
			}
		});
		console.log(eviction_set);
		conflict_set = conflict_set.diff(eviction_set);
	}
});