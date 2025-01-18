import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

async function copyDir(folderToCopy, oldFile, newFile, dirname) {
  try {
    const files = await fs.readdir(folderToCopy, { withFileTypes: true });
    for (const file of files) {
      const prevFilePath = path.join(dirname, oldFile, file.name);
      const newFilePath = path.join(dirname, newFile, file.name);
      await fs.copyFile(prevFilePath, newFilePath);
    }
  } catch (error) {
    console.error(err)
  }
}
async function createFolder(dirname) {
  try {
    const folder = path.join(dirname, "files-copy")
    await fs.mkdir(folder, { recursive: true });
  } catch (error) {
    console.error(err)
  }
}
async function deleteFiles(dirname, folderName) {
  try {
    const folder = path.join(dirname, folderName);
    await fs.rm(folder, { recursive: true, force: true });
  } catch (err) {
    console.error(err)
  }
}

;(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderToCopy = path.join(__dirname, "files");
    await deleteFiles(__dirname, "files-copy");
    await createFolder(__dirname);
    await copyDir(folderToCopy, "files", "files-copy", __dirname);
})();