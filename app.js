const createError = require("http-errors")
const session = require("express-session")
const flash = require("express-flash")
const express = require("express")
const logger = require("morgan")
const path = require("path")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const db = require("./database")
const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(logger("dev"))
app.use(express.json())
app.use(cookieParser())
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000, // Around 10MB
    },
    abortOnLimit: true,
  })
)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "/public")))
app.use("/public", express.static("public"))
// app.use("/upload", express.static("upload"))
app.use(
  session({
    secret: "123@123abc",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
)

app.use(flash())

app.get("/", function (req, res, next) {
  res.render("index", { title: "User Form" })
})

app.get("/people", function (req, res, next) {
  res.render("profiles", { title: "Profiles" })
})

app.get("/people/:name", (request, response) => {
  const sql = `SELECT * FROM people WHERE people.name = "${request.params.name}"`
  let person = {}
  try {
    db.query(sql, (error, results) => {
      if (error) throw error
      person = {
        name: results[0].name,
        status: results[0].status,
        image: results[0].image,
      }
      response.status(200)
      response.render("profile", { person })
    })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/people", (request, response) => {
  const sql = "SELECT * FROM people"
  try {
    db.query(sql, (error, results) => {
      if (error) throw error
      console.log(results)
      response.status(200).send(results)
    })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/people/:name", (request, response) => {
  const sql = `SELECT * FROM people WHERE people.name = "${request.params.name}"`
  try {
    db.query(sql, (error, results) => {
      if (error) throw error
      console.log(results)
      response.status(200).send(results)
    })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/names", (request, response) => {
  const sql = "SELECT name FROM people"
  try {
    db.query(sql, (error, results) => {
      if (error) throw error
      console.log(results)
      response.status(200).send(results)
    })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/status", (request, response) => {
  const sql = "SELECT status FROM people"
  try {
    db.query(sql, (error, results) => {
      if (error) throw error
      console.log(results)
      response.status(200).send(results)
    })
  } catch {
    console.log(error)
  }
})

app.get("/api/images", (request, response) => {
  const sql = "SELECT image FROM people"
  try {
    db.query(sql, (error, results) => {
      if (error) throw error
      console.log(results)
      response.status(200).send(results)
    })
  } catch (error) {
    console.log(error)
  }
})

app.post("/create", (req, res) => {
  console.log(req.files)
  if (req.files !== undefined) {
    if (/^image/.test(image)) return res.sendStatus(400)
    var { image } = req.files
    var path = "/public/images/upload/" + image.name
    image.mv(__dirname + path)
  }

  const person = {
    name: req.body.name,
    status: req.body.status,
    image: path,
  }

  let sql = "INSERT INTO people SET ?"
  try {
    db.query(sql, person, (error) => {
      if (error) throw error
      console.log("1 record inserted")
    })
  } catch (error) {
    console.log(error)
  }
  res.writeHead(301, { Location: `/people/${person.name}` })
  return res.end()
})

app.post("/update_image", (req, res) => {
  if (req.files !== null) {
    if (/^image/.test(image)) return res.sendStatus(400)
    var { image } = req.files
    var path = "/public/images/upload/" + image.name
    image.mv(__dirname + path)
  }

  const person = {
    name: req.body.name,
    image: path,
  }

  let sql = `UPDATE people SET image = "${person.image}" WHERE name = "${person.name}"`
  try {
    db.query(sql, (error) => {
      if (error) throw error
      console.log("1 record updated")
    })
  } catch {
    console.log(error)
  }
  res.writeHead(301, { Location: `/people/${person.name}` })
  return res.end()
})

app.post("/update_status", (req, res) => {
  const person = {
    name: req.body.name,
    status: req.body.status,
  }

  let sql = `UPDATE people SET status = "${person.status}" WHERE name = "${person.name}"`
  try {
    db.query(sql, (error) => {
      if (error) throw error
      console.log("1 record updated")
    })
  } catch {
    console.log(error)
  }
  res.writeHead(301, { Location: `/people/${person.name}` })
  return res.end()
})

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}
  res.status(err.status || 500)
  res.render("error")
})

app.listen(5555, function () {
  console.log("Node server is running on port : 5555")
})

module.exports = app
