// Build script that temporarily excludes API routes from static export
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiRoutesDir = path.join(__dirname, '..', 'app', 'api');
const tempApiRoutesDir = path.join(__dirname, '..', 'app', '_api_temp');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}


try {
  // Check if API routes exist
  if (fs.existsSync(apiRoutesDir)) {
    
    // Copy API routes to temp directory
    if (fs.existsSync(tempApiRoutesDir)) {
      fs.rmSync(tempApiRoutesDir, { recursive: true, force: true });
    }
    copyDir(apiRoutesDir, tempApiRoutesDir);
    
    // Remove API routes from app directory
    fs.rmSync(apiRoutesDir, { recursive: true, force: true });
  }

  // Run sitemap generation before build
  console.log("🗺️  Generating sitemap...");
  try {
    execSync('node scripts/generate-sitemap.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } catch (e) {
    console.warn("⚠️  Sitemap generation failed, continuing build...");
  }

  // Run Next.js build
  execSync('next build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  // Copy .htaccess into out/ — required for Apache static hosting
  const htaccessSrc = path.join(__dirname, '..', '.htaccess');
  const htaccessDest = path.join(__dirname, '..', 'out', '.htaccess');
  if (fs.existsSync(htaccessSrc) && fs.existsSync(path.join(__dirname, '..', 'out'))) {
    fs.copyFileSync(htaccessSrc, htaccessDest);
    console.log('✅ Copied .htaccess to out/');
  }


} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore API routes
  if (fs.existsSync(tempApiRoutesDir)) {
    if (fs.existsSync(apiRoutesDir)) {
      fs.rmSync(apiRoutesDir, { recursive: true, force: true });
    }
    copyDir(tempApiRoutesDir, apiRoutesDir);
    fs.rmSync(tempApiRoutesDir, { recursive: true, force: true });
  }
}

