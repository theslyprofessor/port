



const port = require('port');

function createPort(readPort, writePort, resultArg, callback) {
	return new port({
		'read': readPort,
		'write': writePort,
		'flags': {
			'noprefs': true,
			'stderr': true,
			'open': `patch.pd`
		}
	}).on('stderr', (buffer) => {
		const data = buffer.toString();
		const result = data.match(new RegExp(`^${resultArg}:\s(.+)`));
		if (result) {
			callback(result[1]);
		}
	}).create();
}

function myCallback(data) {
	const list = data.split(',').map(Number);
	const multipliedList = list.map(num => num * 3);
	return multipliedList;
}


createPort(1111, 1112, 'result', myCallback);
const pd = new port({
	'read': 1111, // [netsend]
	'write': 1112, // [netreceive]
	'flags': {
	  'noprefs': true,
	  'stderr': true,
	  'open': `patch.pd`
	}
  }).on('stderr', (buffer) => {
	const data = buffer.toString();
	const result = data.match(/^result:\s(.+)/);
	console.log(result[1])
	// if (result) {
	// 	const list = result[1].split(',').map(Number);
	// 	const multipliedList = list.map(num => num * 3);
	// 	console.log(multipliedList);
	// }
  })
  .create();