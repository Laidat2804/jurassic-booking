// import fs from 'fs';
// import https from 'https';

// const url = 'https://upload.wikimedia.org/wikipedia/commons/e/e0/ISS-45_StoryOfWater%2C_Kauai%2C_Hawaii.jpg';
// const dest = 'src/assets/nublar-map.png'; // Saving as png just to match user's filename request, though source is jpg

// const download = (url, dest) => {
//   return new Promise((resolve, reject) => {
//     const file = fs.createWriteStream(dest);
//     const request = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
//       if (response.statusCode === 301 || response.statusCode === 302) {
//         download(response.headers.location, dest).then(resolve).catch(reject);
//         return;
//       }
//       if (response.statusCode !== 200) {
//         reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
//         return;
//       }
//       response.pipe(file);
//       file.on('finish', () => {
//         file.close(resolve);
//       });
//     }).on('error', (err) => {
//       fs.unlink(dest, () => {});
//       reject(err);
//     });
//   });
// };

// download(url, dest)
//   .then(() => console.log('Download complete'))
//   .catch(err => console.error('Download failed', err));
