var buffer = new ArrayBuffer(8192 * 1024); // 8 MB eviction buffer
var lines = new DataView(buffer);
var offset = 64;

var order = [];
for (var i=0; i < 64*500; i+=64) {
	order.push(i);
}
order = shuffle(order);

// function resetCache() {
// 	for (var i = 8192 * 1024 - 64; i >= 0; i-=offset) {
// 		lines.getUint32(i);
// 	}
// }

function probe(set, candidate) {
	lines.getUint32(candidate);
	set.forEach(function (l) {
		lines.getUint32(l);
	});
	var t1 = window.performance.now();
	lines.getUint32(candidate);
	var t2 = window.performance.now();
	threshold = .0015
	return t2 - t1 > threshold;
}

// console.log(probe([], 0));
// resetCache();

var conflict_set = [];
var i = 0;
order.forEach(function (candidate) {
	if (!probe(conflict_set, candidate)) {
		conflict_set.push(candidate);
	} else {
		console.log(i);
	}
	i++;
});

// console.log(conflict_set);

// lines.diff(conflict_set).forEach(function (candidate) {
// 	if (probe(conflict_set, candidate)) {
// 		eviction_set = []
// 		conflict_set.forEach(function (l) {
// 			if (!probe(conflict_set.diff([l]), candidate)) {
// 				eviction_set.push(l);
// 			}
// 		});
// 		console.log(eviction_set);
// 		conflict_set = conflict_set.diff(eviction_set);
// 	}
// });

// Helper functions
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
