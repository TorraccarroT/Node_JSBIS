var express = require('express')
var cors = require('cors')
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'node_js'
});

var app = express()
app.use(cors())
app.use(express.json())

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})


app.get('/product', function (req, res, next) {
    connection.query('SELECT * FROM `node_pd`', function(err, results, fields) {
      if (err) {
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'ไม่พบข้อมูล' });
      }
      res.json(results);
    });
  });
  
  
  app.get('/product/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
      'SELECT * FROM `node_pd` WHERE `product_id` = ?',
      [id],
      function(err, results) {
        if (err) {
          return next(err); 
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'ไม่พบข้อมูลสินค้า' });
        }
        res.json(results);
      }
    );
  });


  app.post('/product', function (req, res, next) {
    connection.query(
      'INSERT INTO `node_pd`(`product_name`, `product_price`, `product_cat`) VALUES (?, ?, ?, ?)',
      [req.body.fname, req.body.lname, req.body.username, req.body.password, req.body.avatar],
      function(err, results) {
        res.json(results);
      }
    );
  })
  app.put('/product/edit', function (req, res, next) {
    const {  product_name, product_price, product_cat, product_id } = req.body;
  
    connection.query(
        `UPDATE node_pd set product_name = ?, product_price = ?, product_cat = ? where product_id = ?`,
        [product_name, product_price, product_cat, product_id ],
      function(err, results) {
        if (err) {
          return next(err); 
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'แก้ไขไม่สำเร็จ' });
        }
        res.json({ message: 'แก้ไขสำเร็จ', results });
      }
    );
  });
  
  app.delete('/product/delete', function (req, res, next) {
    const { id } = req.body;
  
    connection.query(
      'DELETE FROM `node_pd` WHERE product_id = ?',
      [id],
      function(err, results) {
        if (err) {
          return next(err); 
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'ไม่พบข้อมูลสินค้า' });
        }
        res.json({ message: 'ลบข้อมูลสำเร็จ', results });
      }
    );
  });
  