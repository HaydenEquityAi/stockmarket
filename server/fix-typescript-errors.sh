#!/bin/bash
# Fix all TypeScript errors on VPS
# Run from /var/www/brokerai/server

echo "🔧 Fixing TypeScript errors..."

# Fix 1: JWT_SECRET type assertion in authController.ts (both locations)
if [ -f "controllers/authController.ts" ]; then
  echo "Fixing controllers/authController.ts..."
  sed -i 's/return jwt\.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });/return jwt.sign({ id: userId }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN as string });/' controllers/authController.ts
fi

if [ -f "src/controllers/authController.ts" ]; then
  echo "Fixing src/controllers/authController.ts..."
  sed -i 's/return jwt\.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });/return jwt.sign({ id: userId }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN as string });/' src/controllers/authController.ts
fi

# Fix 2: src/routes/api.ts - req.user optional chaining
if [ -f "src/routes/api.ts" ]; then
  echo "Fixing src/routes/api.ts..."
  
  # Fix req.user.id -> req.user?.id with check (line 118)
  sed -i '118s/const userId = req\.user\.id;/const userId = req.user?.id;\n    if (!userId) {\n      return res.status(401).json({ error: "Unauthorized" });\n    }/' src/routes/api.ts
  
  # Fix quotesMap typing (around line 134)
  sed -i 's/const quotesMap = {}/const quotesMap: Record<string, any> = {}/g' src/routes/api.ts
  
  # Fix line 163
  sed -i '163s/const userId = req\.user\.id;/const userId = req.user?.id;\n    if (!userId) {\n      return res.status(401).json({ error: "Unauthorized" });\n    }/' src/routes/api.ts
  
  # Fix line 190
  sed -i '190s/req\.user\.id/req.user?.id/g' src/routes/api.ts
  sed -i '/await Position\.deleteOne({ userId: req\.user\?\.id/{
    i\
    if (!req.user?.id) {\
      return res.status(401).json({ error: "Unauthorized" });\
    }
  }' src/routes/api.ts
fi

# Fix 3: src/services/marketDataProvider.ts - Add 'as any' to JSON responses
if [ -f "src/services/marketDataProvider.ts" ]; then
  echo "Fixing src/services/marketDataProvider.ts..."
  sed -i 's/const data = await res\.json();/const data = await res.json() as any;/g' src/services/marketDataProvider.ts
fi

# Fix 4: src/services/newsService.ts - Add 'as any' to JSON responses
if [ -f "src/services/newsService.ts" ]; then
  echo "Fixing src/services/newsService.ts..."
  sed -i 's/const data = await response\.json();/const data = await response.json() as any;/g' src/services/newsService.ts
fi

# Fix 5: src/server.ts - client.symbol undefined
if [ -f "src/server.ts" ]; then
  echo "Fixing src/server.ts..."
  sed -i '57,60s/if (data\.type === '"'"'subscribe'"'"' && data\.symbol) {/if (data.type === '\''subscribe'\'' \&\& data.symbol) {\n        const symbol = String(data.symbol).toUpperCase();/' src/server.ts
  sed -i 's/subscriptions\.set(client, client\.symbol);/subscriptions.set(client, symbol);/' src/server.ts
  sed -i 's/client\.symbol = data\.symbol\.toUpperCase();/client.symbol = symbol;/' src/server.ts
fi

echo "✅ All fixes applied!"
echo "Run: npm run build"

