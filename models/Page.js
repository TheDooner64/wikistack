var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pageSchema = new Schema({
  title:  String,
  urlTitle: String,
  content:   String,
  date: { type: Date, default: Date.now },
  status: Boolean,
  author: String,
  }
});

var Page = mongoose.model("Page",pageSchema);


module.exports = Page;