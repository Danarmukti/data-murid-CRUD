const express = require("express");
const mysql = require("mysql");
const BodyParser = require("body-parser");

const app = express();

app.use(BodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createConnection({
  host: "localhost",
  database: "data-sekolah",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;

  console.log("database connected....");

  //fungsi semua data di file index
  app.get("/", (req, res) => {
    let sql = "SELECT * FROM murid";
    db.query(sql, (err, result) => {
      const murid = JSON.parse(JSON.stringify(result));
      res.render("index", {
        murid: murid,
        title: "Selamat Datang di sekolah ABC",
      });
    });
  });

  //fungsi semua data di file murid.ejs
  app.get("/murid.ejs", (req, res) => {
    let muridSql = "SELECT * FROM murid";
    db.query(muridSql, (err, result) => {
      const murid = JSON.parse(JSON.stringify(result));
      res.render("murid", {
        murid: murid,
        title: "Data Murid ABC",
      });
    });
  });

  //fungsi menampilkan data pada file tambah-murid.ejs
  app.get("/tambah-murid.ejs", (req, res) => {
    let muridSql = "SELECT * FROM murid";
    db.query(muridSql, (err, result) => {
      const murid = JSON.parse(JSON.stringify(result));
      res.render("tambah-murid", {
        murid: murid,
        title: "Silahkan Masukan Data",
      });
    });
  });

  //fungsi tambah data
  app.post("/tambah", (req, res) => {
    let muridSql = `INSERT INTO murid (nama,kelas) VALUES ('${req.body.nama}','${req.body.kelas}');`;
    db.query(muridSql, (err, result) => {
      if (err) throw err;
      const murid = JSON.parse(JSON.stringify(result));
      res.redirect("/murid.ejs");
    });
  });

  //fungsi delete
  app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    let muridSql = `DELETE FROM murid where id=?`;
    db.query(muridSql, [id], (err, result) => {
      if (err) throw err;
      const murid = JSON.parse(JSON.stringify(result));
      res.redirect("/murid.ejs");
    });
  });
  //fungsi edit
  app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const { nama, kelas } = req.body;
    let muridSql = "UPDATE murid set nama = ?, kelas = ? where id = ?;";
    db.query(muridSql, [nama, kelas, id], (err, result) => {
      if (err) throw err;
      const murid = JSON.parse(JSON.stringify(result));
      res.redirect("/murid.ejs");
    });
  });
});

app.listen(8080, () => {
  console.log("server ready...");
});
