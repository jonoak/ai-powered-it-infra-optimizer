const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { ensureAuthenticated } = require('./middleware/auth');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User roles
const roles = ['IT Manager', 'AI Engineer', 'System Administrator', 'Business Analyst'];

// Session management
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy((username, password, done) => {
  // Mock user authentication
  if (username === 'admin' && password === 'admin') {
    return done(null, { username: 'admin', role: 'IT Manager' });
  } else {
    return done(null, false, { message: 'Incorrect username or password' });
  }
}));
passport.serializeUser((user, done) => {
  done(null, user.username);
});
passport.deserializeUser((username, done) => {
  done(null, { username: 'admin', role: 'IT Manager' });
});

// Routes
app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`<h1>Dashboard</h1><p>Welcome ${req.user.username}</p>`);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
