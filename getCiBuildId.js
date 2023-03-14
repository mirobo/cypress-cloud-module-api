function getCiBuildId() {
  if (process.env.GITLAB_CI) {
    return `${process.env.CI_COMMIT_REF_NAME}-${process.env.CI_PIPELINE_ID}`;
  } else {
    return new Date().toISOString();
  }
}
console.log(getCiBuildId());
module.exports = getCiBuildId;
