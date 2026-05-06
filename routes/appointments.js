const express = require('express');
const db = require('../models/db');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, (req, res) => {
  const { q } = req.query;
  const query = q || '';
  const searchValue = query.trim() ? `%${query.trim()}%` : null;

  let sql = 'SELECT * FROM appointments WHERE user_id = ? ORDER BY created_at DESC';
  let params = [req.session.user.id];

  if (searchValue) {
    sql = `SELECT * FROM appointments WHERE user_id = ? AND (name LIKE ? OR email LIKE ? OR style LIKE ? OR preferred_date LIKE ?) ORDER BY created_at DESC`;
    params = [req.session.user.id, searchValue, searchValue, searchValue, searchValue];
  }

  db.all(sql, params, (err, appointments) => {
    if (err) {
      return res.render('appointments', { error: 'Unable to load appointments.', appointments: [], query });
    }
    res.render('appointments', { appointments, error: null, query });
  });
});

router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('new-appointment', { error: null, appointment: null });
});

router.post('/new', ensureAuthenticated, (req, res) => {
  const { name, email, phone, style, date, time, notes } = req.body;

  if (!name || !email || !phone || !style || !date || !time) {
    return res.render('new-appointment', { error: 'Please fill in all required fields.', appointment: req.body });
  }

  db.run(
    'INSERT INTO appointments (user_id, name, email, phone, style, preferred_date, preferred_time, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.session.user.id, name, email, phone, style, date, time, notes || ''],
    function (err) {
      if (err) {
        return res.render('new-appointment', { error: 'Unable to save appointment.', appointment: req.body });
      }
      res.redirect('/appointments');
    }
  );
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  const appointmentId = req.params.id;
  db.get('SELECT * FROM appointments WHERE appointment_id = ? AND user_id = ?', [appointmentId, req.session.user.id], (err, appointment) => {
    if (err || !appointment) {
      return res.redirect('/appointments');
    }
    res.render('edit-appointment', { error: null, appointment });
  });
});

router.post('/edit/:id', ensureAuthenticated, (req, res) => {
  const appointmentId = req.params.id;
  const { name, email, phone, style, date, time, notes } = req.body;

  if (!name || !email || !phone || !style || !date || !time) {
    return res.render('edit-appointment', {
      error: 'Please fill in all required fields.',
      appointment: { appointment_id: appointmentId, ...req.body }
    });
  }

  db.run(
    'UPDATE appointments SET name = ?, email = ?, phone = ?, style = ?, preferred_date = ?, preferred_time = ?, notes = ? WHERE appointment_id = ? AND user_id = ?',
    [name, email, phone, style, date, time, notes || '', appointmentId, req.session.user.id],
    function (err) {
      if (err) {
        return res.render('edit-appointment', {
          error: 'Unable to update appointment.',
          appointment: { appointment_id: appointmentId, ...req.body }
        });
      }
      res.redirect('/appointments');
    }
  );
});

router.post('/delete/:id', ensureAuthenticated, (req, res) => {
  const appointmentId = req.params.id;
  db.run('DELETE FROM appointments WHERE appointment_id = ? AND user_id = ?', [appointmentId, req.session.user.id], (err) => {
    res.redirect('/appointments');
  });
});

module.exports = router;
