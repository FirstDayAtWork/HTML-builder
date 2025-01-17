import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

function getInfoAboutFilesInFolder(folder) {
  fs.readdir(folder, { withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      for (const file of files) {
        const filePath = `${file.path}\\\\${file.name}`;
        fs.stat(filePath, (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            const ext = path.extname(file.name);
            const name = path.basename(file.name, ext);
            const noDot = ext.replace(/^\./, "");
            const sizeToKb = stats.size / 1000;
            console.log(`${name} - ${noDot} - ${sizeToKb}kb`)
          }
        });
      }
    }
  );
}

;(() => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const secretFolder = path.join(__dirname, "secret-folder");
  getInfoAboutFilesInFolder(secretFolder);
})();

