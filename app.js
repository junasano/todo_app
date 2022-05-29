var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

const Item = mongoose.model("Item", { name: String });
const item = new Item({ name: "New list" });
const init = [item];

app.get("/", function (req, res) {
  Item.find({}, function (err, f) {
    if (f.length == 0) {
      Item.insertMany(init, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successly initialized");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {newListItem: f});
    }
  });
});

app.post("/add", function (req, res) {
  i = req.body.item;
  const item = new Item({
    name: i,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  Item.findByIdAndRemove(req.body.checkbox, function (err) {
    if (!err) {
      console.log("Successfully deleted");
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("connceted to port 3000");
});
