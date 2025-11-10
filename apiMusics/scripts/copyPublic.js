import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "../public");
const destDir = path.resolve(__dirname, "../dist/public");

function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) {
    const srcPath = path.join(from, file);
    const destPath = path.join(to, file);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(srcDir)) {
  copyFolderSync(srcDir, destDir);
  console.log("✅ Pasta 'public' copiada para dist/public com sucesso!");
} else {
  console.warn("⚠️  Nenhuma pasta 'public' encontrada para copiar.");
}
