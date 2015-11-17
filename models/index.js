var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

// var Page = require("./Page.js");
// var User = require("./User.js");

var pageSchema = new Schema({
    title:  { type: String, required: true },
    urlTitle: { type: String, required: true },
    content:   { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'] },
    date: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: "User" }
  });

pageSchema.virtual("route").get(function() {
  return "/wiki/" + this.urlTitle;
});

var userSchema = new Schema({
    name:  { type: String, required: true },
    email: { type: String, required: true, unique: true }
  });

var Page = mongoose.model("Page", pageSchema);
var User = mongoose.model('User', userSchema);

pageSchema.pre("validate", function(next) {
    this.urlTitle = urlCreator(this.title);
    next();
  });

module.exports = {
  User: User,
  Page: Page
};

function urlCreator(title) {
  if (title === "") return Math.random().toString(36).substring(2, 7);
  var reSpaces = /\s/g;
  var reNonAlphaNumeric = /\W/g;
  var urlTitle = title.replace(reSpaces, "_").replace(reNonAlphaNumeric, "");
  return urlTitle;
}