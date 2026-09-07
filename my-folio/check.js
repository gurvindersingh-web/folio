import http from 'http';
http.get('http://localhost:5173', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data.length > 0 ? "HTML loaded" : "Empty"); });
}).on('error', (err) => { console.error(err); });
