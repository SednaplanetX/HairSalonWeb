const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./models/db');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'salon-tu-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use('/', authRoutes);
app.use('/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/hair-styles', (req, res) => {
  res.render('hair-styles');
});

app.get('/book-appointment', (req, res) => {
  res.render('book-appointment');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await db.init();
    app.listen(PORT, () => {
      console.log(`Salon Tu app listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  }
})();
