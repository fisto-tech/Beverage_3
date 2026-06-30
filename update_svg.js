const fs = require('fs');
const path = require('path');

const svgFiles = [
  'Applebg.svg',
  'Berrybg.svg',
  'Citrusbg.svg',
  'Kiwibg.svg',
  'Litchbg.svg',
  'Orangebg.svg',
  'Pearbg.svg'
];

const assetsDir = path.join('d:', 'Tin Juice Can', 'src', 'assets');

const style = `
<style>
  [fill^="url(#pattern"] {
    animation: float 6s ease-in-out infinite;
    transform-origin: center;
  }
  [fill^="url(#pattern"]:nth-child(even) {
    animation-duration: 8s;
  }
  [fill^="url(#pattern"]:nth-child(3n) {
    animation-duration: 7s;
    animation-delay: -2s;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
</style>`;

svgFiles.forEach(fileName => {
  const svgPath = path.join(assetsDir, fileName);
  try {
    if (fs.existsSync(svgPath)) {
      let content = fs.readFileSync(svgPath, 'utf8');
      
      if (!content.includes('<style>')) {
        // Use regex to match the opening <svg> tag no matter how it's formatted
        const newContent = content.replace(/(<svg[^>]*>)/, '$1\n' + style);
        
        if (newContent !== content) {
          try {
            fs.chmodSync(svgPath, 0o666);
          } catch(e) {}
          fs.writeFileSync(svgPath, newContent);
          console.log(`Successfully updated ${fileName}`);
        } else {
          console.log(`Failed to inject into ${fileName} - regex did not match.`);
        }
      } else {
        console.log(`Style already exists in ${fileName}`);
      }
    } else {
      console.log(`File not found: ${fileName}`);
    }
  } catch (e) {
    console.error(`Error updating ${fileName}:`, e.message);
  }
});
