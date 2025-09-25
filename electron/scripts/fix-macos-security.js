#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔒 Fixing macOS Security Warning for FileMap...');
console.log('==============================================');

// Find the Electron app
const appPath = path.join(__dirname, '..', 'dist', 'mac', 'FileMap.app');

if (!fs.existsSync(appPath)) {
  console.log('❌ FileMap.app not found. Please build the app first with: npm run build');
  process.exit(1);
}

try {
  console.log('📱 Removing quarantine attribute...');
  execSync(`xattr -d com.apple.quarantine "${appPath}"`, { stdio: 'inherit' });
  console.log('✅ Quarantine attribute removed');

  console.log('🔐 Adding to accessibility permissions...');
  execSync(`sudo spctl --master-disable`, { stdio: 'inherit' });
  console.log('✅ Gatekeeper temporarily disabled');

  console.log('🎯 Adding to approved applications...');
  execSync(`sudo spctl --add "${appPath}"`, { stdio: 'inherit' });
  console.log('✅ Added to approved applications');

  console.log('🔄 Re-enabling Gatekeeper...');
  execSync(`sudo spctl --master-enable`, { stdio: 'inherit' });
  console.log('✅ Gatekeeper re-enabled');

  console.log('');
  console.log('🎉 Security warning should now be bypassed!');
  console.log('💡 You can now run FileMap without security warnings.');
  console.log('');
  console.log('📝 Note: You may need to enter your password for some operations.');
  console.log('   This is normal and required for system-level changes.');

} catch (error) {
  console.log('❌ Error fixing security warning:', error.message);
  console.log('');
  console.log('🔧 Manual fix instructions:');
  console.log('1. Right-click on FileMap.app');
  console.log('2. Select "Open" from the context menu');
  console.log('3. Click "Open" in the security dialog');
  console.log('4. FileMap will be added to your approved applications');
  process.exit(1);
}
