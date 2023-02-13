import * as fs from 'fs';
import * as path from 'path';

export function search(files) {
  files.forEach((file) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        console.error(err)
        return
      }
      if (stats.isFile()) {
        console.log(file)
      }
    })
  });
}


search([
  'D:/Go/src/math/rand'
])
