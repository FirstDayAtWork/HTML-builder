import fs from "fs"
import fsPromises from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

async function createFolder(dirname, folderName) {
    try {
      const folder = path.join(dirname, folderName);
      fsPromises.mkdir(folder, { recursive: true });
      console.log("You successfully create folder!!!");
      return folder;
    } catch (err) {
      console.error(err)
    }
}
function createFile(dirname, fileName) {
    const filePath = path.join(dirname, fileName);
    const file = fs.createWriteStream(filePath);
    console.log("You successfully create file!!!");
    return file;
}
async function readFile(dirname, folderName = "", fileName = "") {
    let str = "";
    const filePath = path.join(dirname, folderName, fileName);
    const input = fs.createReadStream(filePath, {
        encoding: "utf-8"
    });
    for await (const chunk of input) {
        str += chunk;
    }
    return str;
}
async function replaceMatches(dirname, folderName, str) {
    const matchesWithTemplates = str.match(/{{.+?}}/g);
    const matches = str.match(/(?<={{).+?(?=}})/g);
    for (let i = 0; i < matches.length; i += 1) {
        const fileName = `${matches[i]}.html`;
        const currentFile = await readFile(dirname, folderName, fileName);
        str = str.replace(matchesWithTemplates[i], currentFile);
    }
    return str;
}
function getInfoAboutFilesInFolder(folder, dirname, mergedFile) {
    const bundle = createFile(dirname, mergedFile);
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
async function copyDir(folderToCopy, newFile, dest) {
  try {
    const files = await fsPromises.readdir(folderToCopy, 
        { withFileTypes: true, recursive: true });
    for (const file of files) {
        const last = file.path.split("\\");
        if (file.isDirectory()) {
            const fPath = path.join(dest, newFile);
            await createFolder(fPath, file.name);
        }
        if (file.isFile()) {
            const prevFilePath = path.join(file.path, file.name);
            const newFilePath = path.join(dest, newFile, last[last.length - 1], file.name);
            await fsPromises.copyFile(prevFilePath, newFilePath);
        }
    }
  } catch (err) {
    console.error(err)
  }
}
async function deleteFiles(dirname, folderName) {
  try {
    const folder = path.join(dirname, folderName);
    await fsPromises.rm(folder, { recursive: true, force: true });
  } catch (err) {
    console.error(err)
  }
}
;(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const styles = path.join(__dirname, "styles");
    const folder = await createFolder(__dirname, "project-dist");
    const folderToCopy = path.join(__dirname, "assets");
    const indexFile = createFile(folder, "index.html");
    const data = await readFile(__dirname, "", "template.html");
    const editedData = await replaceMatches(__dirname, "components", data);
    indexFile.write(editedData);
    getInfoAboutFilesInFolder(styles, folder, "style.css");
    await deleteFiles(folder, "assets");
    await createFolder(folder, "assets");
    await copyDir(folderToCopy, "assets", folder);
})();