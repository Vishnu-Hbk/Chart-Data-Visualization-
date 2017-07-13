const pg = require('pg');

const configurationString = 'postgres:\/\/postgres:vishnu@localhost/Data';


module.exports = {
  saveToDB : function(data){
    pg.connect(configurationString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      done();
      client.query('insert into data(data) values($1)',[data], function (err, result) {

        if (err) {
          return console.error('error happened during query', err);
        }
      });
    });
  },
  fetchfromDB : function(next){
    pg.connect(configurationString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
        done(err);
      }
      client.query('SELECT data from data', function (err, result) {
        //done(result.rows);
        if (err) {
          return console.error('error happened during query', err);
          done(err);
        }
        next(result.rows.reverse().slice(0,11));
        done(result.rows);
      });
  });
  }
};
