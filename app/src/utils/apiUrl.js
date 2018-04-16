// URLs
let u = 'https://today.bobi.space';
if (process.env.NODE_ENV !== 'production') {
  u = 'http://127.0.0.1:9091';
}

const url = u;
export default url;
