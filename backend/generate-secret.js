const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret); // Output this key and copy it
