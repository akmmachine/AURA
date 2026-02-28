const express = require('express');
const cors = require('cors');
const { read, write } = require('./store');
const { PRODUCTS, MOCK_ORDERS, ADMIN_CREDENTIALS } = require('./seedData');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory admin tokens (token -> expiryMs). In production use JWT or sessions.
const adminTokens = new Map();
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  if (Date.now() > adminTokens.get(token)) {
    adminTokens.delete(token);
    return res.status(401).json({ error: 'Admin session expired' });
  }
  next();
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// ----- Seed if empty -----
function seedIfNeeded() {
  if (read('products').length === 0) {
    write('products', PRODUCTS);
    console.log('Seeded products');
  }
  if (read('orders').length === 0) {
    write('orders', MOCK_ORDERS);
    console.log('Seeded orders');
  }
  if (read('users').length === 0) write('users', []);
  if (read('blog').length === 0) write('blog', []);
}
seedIfNeeded();

// ----- Health -----
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ----- Products (public read, admin write) -----
app.get('/api/products', (req, res) => {
  res.json(read('products'));
});

app.get('/api/products/:id', (req, res) => {
  const products = read('products');
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

app.put('/api/products', requireAdmin, (req, res) => {
  const body = req.body;
  const list = Array.isArray(body) ? body : (body.products || []);
  write('products', list);
  res.json(list);
});

app.patch('/api/products/:id', requireAdmin, (req, res) => {
  const products = read('products');
  const i = products.findIndex(p => p.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Product not found' });
  products[i] = { ...products[i], ...req.body, id: products[i].id };
  write('products', products);
  res.json(products[i]);
});

// ----- Orders (public create, admin read/update) -----
app.get('/api/orders', (req, res) => {
  const orders = read('orders');
  const email = req.query.email;
  if (email) {
    return res.json(orders.filter(o => o.customerEmail === email));
  }
  // Full list requires admin
  const auth = req.headers.authorization;
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ error: 'Admin required to list all orders' });
  }
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const order = req.body;
  if (!order.id || order.amount == null) {
    return res.status(400).json({ error: 'Order id and amount required' });
  }
  const orders = read('orders');
  orders.unshift(order);
  write('orders', orders);
  res.status(201).json(order);
});

app.put('/api/orders', requireAdmin, (req, res) => {
  const list = Array.isArray(req.body) ? req.body : (req.body.orders || []);
  write('orders', list);
  res.json(list);
});

// ----- Users (admin list; auth: register / login) -----
app.get('/api/users', requireAdmin, (req, res) => {
  const users = read('users');
  res.json(users.map(({ password, ...u }) => u));
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }
  const users = read('users');
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    joinedDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
  };
  users.push(newUser);
  write('users', users);
  const { password: _, ...safe } = newUser;
  res.status(201).json({ user: safe });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const users = read('users');
  const u = users.find(x => x.email === email && x.password === password);
  if (!u) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const { password: _, ...safe } = u;
  res.json({ user: safe });
});

// ----- Admin login (returns token) -----
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  adminTokens.set(token, Date.now() + TOKEN_TTL_MS);
  res.json({ token });
});

// ----- Blog (public read, admin write) -----
app.get('/api/blog', (req, res) => {
  res.json(read('blog'));
});

app.get('/api/blog/:id', (req, res) => {
  const posts = read('blog');
  const p = posts.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Post not found' });
  res.json(p);
});

app.put('/api/blog', requireAdmin, (req, res) => {
  const list = Array.isArray(req.body) ? req.body : (req.body.posts || []);
  write('blog', list);
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`AURA API running at http://localhost:${PORT}`);
});
