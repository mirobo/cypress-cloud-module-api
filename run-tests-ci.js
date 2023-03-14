const { run } = require('cypress-cloud');
const getCiBuildId = require('./getCiBuildId');

async function main() {
  let exitCode = 0;
  const result = await run({
    ciBuildId: getCiBuildId(),
  }).catch((err) => {
    console.error(`error occurred`);
    console.error(JSON.stringify(err, null, 2));
    exitCode = 999;
  });
  console.info(`Result object from cypress-cloud run command:\r\n${JSON.stringify(result, null, 2)}`);
  if (result && result.failures) {
    console.error(`One or more tests could not be executed - setting exit code to 3`);
    console.error(JSON.stringify(result, null, 2));
    exitCode = 3;
  }
  if (result && result.totalFailed > 0) {
    console.error(`Tests failed - setting exit code to 1`);
    exitCode = 1;
  }
  process.exit(exitCode);
}

main();
