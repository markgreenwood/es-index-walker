const indices = require('./indices.json');
const R = require('ramda');

// console.log(`# of indices: ${R.keys(indices).length}`);
console.log(`type counts: ${JSON.stringify(R.map(R.length, indices), null, 2)}`);
