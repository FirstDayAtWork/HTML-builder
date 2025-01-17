import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
import readline from "readline";
import { constants } from "buffer";

function createFile(txt) {
    const file = fs.createWriteStream(txt);
    console.log("You successfully create txt file!!!");
    return file;
}
function editFile(file) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt("Fbfny(n)?"); //rot13
    rl.prompt();
    rl.on("line", (answer) => {
        if(answer.trim() === "exit") {
            console.log("It's over ;(");
            rl.close();
            return;
        }
        file.write(answer + "\n");
        console.log(answer);
    })
    rl.on("SIGINT", () => {
        console.log("You press 'Ctrl + C' - me exit program ):<");
        rl.close();
    })
}
function deleteFile(txt) {
    fs.unlink(txt, (err) => {
        if (err) throw err;
    });
}
function checkIfFileExist(txt) {
    fs.access(txt, constants.F_OK, (err) => {
        if (!err) {
            deleteFile(txt);
        }
        const file = createFile(txt);
        editFile(file);
    })
}
;(() => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const txt = path.join(__dirname, "text.txt");
    checkIfFileExist(txt);
})();