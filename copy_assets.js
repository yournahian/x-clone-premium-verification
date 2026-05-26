import fs from 'fs';
import path from 'path';

const srcDir = "C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\665f812f-312e-4746-a982-86eb49c1f1a3";
const destDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const assets = [
  { src: "web3_jenga_1779739793694.png", dest: "web3_jenga.png" },
  { src: "media__1779740541423.png", dest: "media_allaire.png" },
  { src: "media__1779740547866.png", dest: "media_nahin.png" },
  { src: "media__1779740555739.png", dest: "media_sukanto.png" },
  { src: "media__1779740567583.png", dest: "media_rollins.png" },
  { src: "media__1779740571978.png", dest: "media_koushik.png" },
  { src: "media__1779742383456.jpg", dest: "avatar_koushik.jpg" },
  { src: "media__1779742383467.jpg", dest: "avatar_rollins.jpg" },
  { src: "media__1779742383480.jpg", dest: "avatar_sukanto.jpg" },
  { src: "media__1779742383494.jpg", dest: "avatar_hossain.jpg" },
  { src: "media__1779742383510.jpg", dest: "avatar_allaire.jpg" }
];

assets.forEach(asset => {
  const srcPath = path.join(srcDir, asset.src);
  const destPath = path.join(destDir, asset.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${asset.src} to public/${asset.dest}`);
  } else {
    console.warn(`Source file not found: ${srcPath}`);
  }
});
