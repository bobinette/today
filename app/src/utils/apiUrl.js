// URLs
let u = 'https://today.bobi.space';
if (
  window.location.hostname.indexOf('127.0.0.1') !== -1 ||
  process.env.NODE_ENV !== 'production'
) {
  u = 'http://127.0.0.1:9091';
}

const url = u;
export default url;
