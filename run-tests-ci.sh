# export DEBUG=*,-cypress-verbose:packherd:*,currents:*

echo "Starting cypress-cloud runner"
ciBuildId=$(node getCiBuildId.js)
echo "CURRENTS_PROJECT_ID: ${CURRENTS_PROJECT_ID}, ci-build-id: ${ciBuildId}, CURRENTS_API_URL: ${CURRENTS_API_URL}"
npx cypress-cloud --parallel --record --ci-build-id $ciBuildId