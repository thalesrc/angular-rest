const { writeFileSync } = require('fs');
const [, , email, token ] = process.argv;

writeFileSync('.npmrc', `
//registry.npmjs.org/:email=${email}
//registry.npmjs.org/:_authToken=${token}
`)