#!/usr/bin/env node
/**
 * Fix all TypeScript compilation errors on VPS
 * Run: node fix-typescript-errors.js
 */

const fs = require('fs');
const path = require('path');

const fixes = [];

// Fix 1: authController.ts - JWT_SECRET type assertion
function fixAuthController(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix JWT sign call
  content = content.replace(
    /return jwt\.sign\(\{ id: userId \}, JWT_SECRET, \{ expiresIn: JWT_EXPIRES_IN \}\)/g,
    'return jwt.sign({ id: userId }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN as string })'
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixes.push(`✅ Fixed ${filePath}`);
  }
}

// Fix 2: routes/api.ts - req.user and quotesMap
function fixRoutesApi(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix req.user.id -> req.user?.id with check
  content = content.replace(
    /const userId = req\.user\.id;/g,
    `const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }`
  );
  
  // Fix quotesMap typing
  content = content.replace(
    /const quotesMap = \{\}/g,
    'const quotesMap: Record<string, any> = {}'
  );
  
  // Fix req.user.id in delete handler
  content = content.replace(
    /await Position\.deleteOne\(\{ userId: req\.user\.id,/g,
    (match) => {
      return `const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await Position.deleteOne({ userId,`
    }
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixes.push(`✅ Fixed ${filePath}`);
  }
}

// Fix 3: marketDataProvider.ts - Add 'as any' to JSON responses
function fixMarketDataProvider(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Add 'as any' to all res.json() calls
  content = content.replace(
    /const data = await res\.json\(\);/g,
    'const data = await res.json() as any;'
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixes.push(`✅ Fixed ${filePath}`);
  }
}

// Fix 4: newsService.ts - Add 'as any' to JSON responses
function fixNewsService(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Add 'as any' to all response.json() calls
  content = content.replace(
    /const data = await response\.json\(\);/g,
    'const data = await response.json() as any;'
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixes.push(`✅ Fixed ${filePath}`);
  }
}

// Fix 5: server.ts - client.symbol undefined
function fixServer(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix client.symbol assignment
  content = content.replace(
    /if \(data\.type === 'subscribe' && data\.symbol\) \{\s+client\.symbol = data\.symbol\.toUpperCase\(\);\s+subscriptions\.set\(client, client\.symbol\);/g,
    `if (data.type === 'subscribe' && data.symbol) {
        const symbol = String(data.symbol).toUpperCase();
        client.symbol = symbol;
        subscriptions.set(client, symbol);`
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixes.push(`✅ Fixed ${filePath}`);
  }
}

console.log('🔧 Fixing TypeScript errors...\n');

// Fix files in root directory
fixAuthController('controllers/authController.ts');

// Fix files in src/ directory
fixAuthController('src/controllers/authController.ts');
fixRoutesApi('src/routes/api.ts');
fixMarketDataProvider('src/services/marketDataProvider.ts');
fixNewsService('src/services/newsService.ts');
fixServer('src/server.ts');

if (fixes.length > 0) {
  console.log('\n✅ Fixed files:');
  fixes.forEach(fix => console.log(`  ${fix}`));
  console.log('\n🎉 All fixes applied!');
  console.log('Run: npm run build');
} else {
  console.log('ℹ️  No files needed fixing (or files not found)');
}

