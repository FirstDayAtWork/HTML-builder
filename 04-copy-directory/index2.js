import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { constants } from "buffer";

// second var (but first implemented)
function copyDir(folderToCopy, oldFile, newFile, dirname) {
    fs.readdir(folderToCopy, { withFileTypes: true },
        (err, files) => {
          if (err) throw err;
          for (const file of files) {
            const prevFilePath = path.join(dirname, oldFile, file.name);
            const newFilePath = path.join(dirname, newFile, file.name);
            fs.copyFile(prevFilePath, newFilePath, (err) => {
                if (err) throw err;
                console.log(`${file.name} successfully copied!`)
            })
          }
        }
    );
    compareDirs(path.join(dirname, oldFile), path.join(dirname, newFile));
}
function createFolder(dirname) {
    const folder = path.join(dirname, "files-copy")
    fs.mkdir(folder, { recursive: true}, (err) => {
        if (err) throw err;
        console.log("New folder is created!");
    })
}
function deleteFile(file) {
    fs.unlink(file, (err) => {
        if (err) throw err;
        console.log("File deleted!");
    });
}
function checkIfFileExist(fileOld, fileNew) {
    fs.access(fileOld, constants.F_OK, (err) => {
        if (err) {
            deleteFile(fileNew);
        }
    })
}
function compareDirs(dirOld, dirNew) {
    fs.readdir(dirNew, { withFileTypes: true},
        (err, files) => {
            if (err) throw err;
            for (const file of files) {
                const filePathOld = path.join(dirOld, file.name);
                const filePathNew = path.join(dirNew, file.name);
                checkIfFileExist(filePathOld, filePathNew);
            }
        }
    )
}

;(() => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderToCopy = path.join(__dirname, "files");
    createFolder(__dirname);
    copyDir(folderToCopy, "files", "files-copy", __dirname);
  })();