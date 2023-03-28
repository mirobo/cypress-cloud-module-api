const axios = require('axios');
const https = require('https');
const url = require('url');
const { getProxyForUrl } = require('proxy-from-env');

const SORRY_CYPRESS_DIRECTOR_HOST = 'some-sorry-cypress-director';
const data = {
  ci: {
    params: {},
    provider: null,
  },
  specs: ['cypress\\e2e\\1-getting-started\\todo.cy.js'],
  commit: {
    branch: 'main',
    remoteOrigin: '',
    authorEmail: 'mirobo',
    authorName: 'mirobo',
    message: 'update cypress-cloud to 1.4.5-beta.0\n',
    sha: '0c3a4449fe09f6d6c58fa3f3e5a3630aea68d6d5',
  },
  platform: {
    osName: 'win32',
    osVersion: '10.0.19044',
    browserName: 'Electron',
    browserVersion: '106.0.5249.51',
  },
  parallel: true,
  ciBuildId: '2023-03-16T12: 17: 33.582Z',
  projectId: 'someprojectid',
  recordKey: 'cccc',
  specPattern: ['cypress/e2e /**/*.cy.{js,jsx,ts,tsx}'],
  testingType: 'e2e',
  batchSize: 3,
};

async function post_with_https() {
  console.log('post_with_https');

  const result = await new Promise((resolve, reject) => {
    const req = https.request(
      {
        protocol: 'https:',
        hostname: SORRY_CYPRESS_DIRECTOR_HOST,
        port: 443,
        method: 'POST',
        path: '/runs',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve(body);
        });
        res.on('error', () => {
          console.log('error');
          reject(Error('HTTP call failed'));
        });
      }
    );
    req.write(JSON.stringify(data));
    req.end();
  });
  console.log(JSON.parse(result));
}

async function post_with_axios(proxy) {
  console.log('post_with_axios');
  const result = await axios({
    method: 'post',
    url: `https://${SORRY_CYPRESS_DIRECTOR_HOST}/runs`,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    proxy,
  });

  console.log(result.data);
}

async function main() {
  console.log(process.env.no_proxy);
  console.log(process.env.NO_PROXY);
  // default https client
  await post_with_https();

  // proxy=false
  // works when a proxy like px proxy is used on local machine
  await post_with_axios(false);

  // default proxy=true
  // fails.. ignores settings like NO_PROXY..
  await post_with_axios();
}

main();

// node
function checkNoProxy(uri, no_proxy) {
  const host = new url.URL(uri).hostname.split('.').reverse();
  if (typeof no_proxy === 'string') {
    noproxy = no_proxy.split(',').map((n) => n.trim());
  }

  return (
    noproxy &&
    noproxy.some((no) => {
      const noParts = no
        .split('.')
        .filter((x) => x)
        .reverse();
      if (!noParts.length) {
        return false;
      }
      for (let i = 0; i < noParts.length; i++) {
        if (host[i] !== noParts[i]) {
          return false;
        }
      }
      return true;
    })
  );
}

// axios
function skipProxy(url, no_proxy) {
  const noProxyEnv = no_proxy;
  if (!noProxyEnv) {
    return false;
  }
  const noProxyUrls = noProxyEnv.split(',');
  const parsedURL = new URL(url);
  return !!noProxyUrls.find((url) => {
    if (url.startsWith('*.') || url.startsWith('.')) {
      url = url.replace(/^\*\./, '.');
      return parsedURL.hostname.endsWith(url);
    } else {
      return url === parsedURL.origin || url === parsedURL.hostname;
    }
  });
}

// proxy-from-env
var stringEndsWith =
  String.prototype.endsWith ||
  function (s) {
    return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
  };

function shouldProxy(hostname, port, no_proxy) {
  var NO_PROXY = no_proxy.toLowerCase();
  if (!NO_PROXY) {
    return true; // Always proxy if NO_PROXY is not set.
  }
  if (NO_PROXY === '*') {
    return false; // Never proxy if wildcard is set.
  }

  return NO_PROXY.split(/[,\s]/).every(function (proxy) {
    if (!proxy) {
      return true; // Skip zero-length hosts.
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true; // Skip if ports don't match.
    }

    if (!/^[.*]/.test(parsedProxyHostname)) {
      // No wildcards, so stop proxying if there is an exact match.
      return hostname !== parsedProxyHostname;
    }

    if (parsedProxyHostname.charAt(0) === '*') {
      // Remove leading wildcard.
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    // Stop proxying if the hostname ends with the no_proxy host.
    return !stringEndsWith.call(hostname, parsedProxyHostname);
  });
}

function logNoProxyHandling(url, no_proxy) {
  // console.log('node');
  const res_node = checkNoProxy(url, no_proxy);
  // console.log('axios');
  // const res_axios = skipProxy(url, no_proxy);
  // process.env['no_proxy'] = no_proxy;
  const res_proxy_from_env = shouldProxy(url, 9999, no_proxy);

  // delete process.env['no_proxy'];

  if (res_node !== res_proxy_from_env) {
    console.log(
      `url='${url}', no_proxy='${no_proxy}', handling of no_proxy is not identical! node=${res_node}, axios=${res_proxy_from_env}`
    );
  } else {
    console.log(`url='${url}', no_proxy='${no_proxy}' -> handling of no_proxy is identical (${res_node})`);
  }
  console.log(`res_proxy_from_env = ${res_proxy_from_env}`);
  console.log();
}
// logNoProxyHandling('https://abc.example.com', 'localhost,example.com');
// logNoProxyHandling('https://abc.example.com', 'localhost,.example.com');
// logNoProxyHandling('https://abc.example.com', 'localhost,*example.com');
// logNoProxyHandling('https://abc.example.com', 'localhost,*.example.com');
// logNoProxyHandling('https://example.com', 'localhost,example.com');
// logNoProxyHandling('https://example.com', 'localhost,.example.com');
// logNoProxyHandling('https://example.com', 'localhost,*example.com');
// logNoProxyHandling('https://example.com', 'localhost,*.example.com');
// logNoProxyHandling('https://example.com', 'localhost');
