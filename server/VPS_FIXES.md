# TypeScript Error Fixes for VPS

Apply these fixes to files in `/var/www/brokerai/server/src/` directory.

## Fix 1: src/controllers/authController.ts

**Line 9:** Change:
```typescript
return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
```

**To:**
```typescript
return jwt.sign({ id: userId }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN as string });
```

## Fix 2: src/routes/api.ts

**Line 118:** Change:
```typescript
const userId = req.user.id;
```

**To:**
```typescript
const userId = req.user?.id;
if (!userId) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

**Line ~134:** Ensure quotesMap is typed:
```typescript
const quotesMap: Record<string, any> = {};
```

**Line 163:** Same fix as line 118:
```typescript
const userId = req.user?.id;
if (!userId) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

**Line 190:** Change:
```typescript
await Position.deleteOne({ userId: req.user.id, symbol: req.params.symbol.toUpperCase() });
```

**To:**
```typescript
const userId = req.user?.id;
if (!userId) {
  return res.status(401).json({ error: 'Unauthorized' });
}
await Position.deleteOne({ userId, symbol: req.params.symbol.toUpperCase() });
```

## Fix 3: src/services/marketDataProvider.ts

**All instances of `await res.json()`** - Add `as any`:
```typescript
const data = await res.json() as any;
```

## Fix 4: src/services/newsService.ts

**All instances of `await response.json()`** - Add `as any`:
```typescript
const data = await response.json() as any;
```

## Fix 5: src/server.ts

**Line 57-59:** Change:
```typescript
if (data.type === 'subscribe' && data.symbol) {
  client.symbol = data.symbol.toUpperCase();
  subscriptions.set(client, client.symbol);
```

**To:**
```typescript
if (data.type === 'subscribe' && data.symbol) {
  const symbol = String(data.symbol).toUpperCase();
  client.symbol = symbol;
  subscriptions.set(client, symbol);
```

## Quick Fix Commands (Run on VPS)

```bash
cd /var/www/brokerai/server

# Fix JWT in both locations
sed -i "s/jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })/jwt.sign({ id: userId }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN as string })/" src/controllers/authController.ts
sed -i "s/jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })/jwt.sign({ id: userId }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN as string })/" controllers/authController.ts

# Fix service files - add 'as any'
sed -i 's/await res.json()/await res.json() as any/g' src/services/marketDataProvider.ts
sed -i 's/await response.json()/await response.json() as any/g' src/services/newsService.ts

# Fix quotesMap
sed -i 's/const quotesMap = {}/const quotesMap: Record<string, any> = {}/g' src/routes/api.ts

# Fix req.user.id
sed -i 's/const userId = req\.user\.id;/const userId = req.user?.id;\n    if (!userId) return res.status(401).json({ error: "Unauthorized" });/g' src/routes/api.ts
```

**Note:** For src/routes/api.ts req.user fixes, manual editing may be required as sed can't handle multi-line replacements well.

