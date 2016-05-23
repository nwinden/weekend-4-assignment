var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/task_lists';

//GET ajax function to get the info from the DB for the DOM
router.get('/', function(req, res) {

  pg.connect(connectionString, function(err, client, done) {

    if (err) {
      res.sendStatus(500);
    }

    client.query(
      'SELECT * FROM tasks ORDER BY completed ASC',
      function(err, result) {
        done();

        if (err) {
          res.sendStatus(500);
        }

        res.send(result.rows);

      }
    );
  });
});

//POST function to post from the DOM to the DB
router.post('/', function(req, res) {

  var task = req.body;

  pg.connect(connectionString, function(err, client, done) {

    if (err) {
      res.sendStatus(500);
    }

    client.query( 'INSERT INTO tasks (task, completed)' +
                  'values($1, $2)', [task.task, task.completed],
                  function(err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                    }

                    res.sendStatus(201);
                  });
  });
});

//PUT function to change the completed status in the DB
router.put('/', function (req, res) {

  var task = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE tasks ' +
                  'SET completed = $1 ' +
                  'WHERE id = $2',
                   [task.completed, task.id],
                   function (err, result) {
                   done();

                   if (err) {
                     res.sendStatus(500);
                   }

                   res.sendStatus(200);
                 });
  });
});

//DELETE function that deletes rows from the DB
router.delete('/', function (req, res) {

  var task = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM tasks ' +
                  'WHERE id = $1',
                   [task.id],
                   function (err, result) {
                   done();

                   if (err) {
                     res.sendStatus(500);
                   }

                   res.sendStatus(200);
                 });
  });
});


module.exports = router;
