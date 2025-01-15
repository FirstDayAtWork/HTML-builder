import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const txt = path.join(__dirname, "text.txt");
const file = fs.createWriteStream(txt);
console.log("You successfully create txt file!!!");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt("Fbfny(n)?"); //rot13
rl.prompt();
rl.on("line", (answer) => {
    if(answer === "exit") {
        console.log("It's over ;(")
        rl.close();
        return;
    }
    file.write(answer);
    console.log(answer);
})
rl.on("SIGINT", () => {
    console.log("You press 'Ctrl + C' - me exit program ):<");
    rl.close();
})