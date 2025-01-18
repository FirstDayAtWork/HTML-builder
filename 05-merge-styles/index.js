import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

function createFile(bundler) {
    const file = fs.createWriteStream(bundler);
    console.log("You successfully create a bundler file!!!");
    return file;
}

function getInfoAboutFilesInFolder(folder, mergedFile) {
    const bundle = createFile(mergedFile);
    fs.readdir(folder, { withFileTypes: true },
        (err, files) => {
            if (err) throw err;
            for (const file of files) {
                const ext = path.extname(file.name).replace(/^\./, "");
                if (file.isFile() && ext === "css") {
                    const filePath = path.join(file.path, file.name);
                    const input = fs.createReadStream(filePath, {
                        encoding: "utf-8"
                    });
                    input.on("data", (chunk) => {
                        bundle.write(chunk);
                        console.log("chunk is added!")
                    });
                }
            }
        }
    );
}

;(() => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderToCheck = path.join(__dirname, "styles");
    const dirForMergedCss = path.join(__dirname, "project-dist", "bundle.css");
    getInfoAboutFilesInFolder(folderToCheck, dirForMergedCss);
})();