var mongoose = require('mongoose');
var marked = require('marked');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Schema = mongoose.Schema;

var pageSchema = new Schema({
    title:  { type: String, required: true },
    urlTitle: { type: String, required: true },
    content:   { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'] },
    date: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [String]
  });

pageSchema.virtual('route').get(function() {
  return '/wiki/' + this.urlTitle;
});

pageSchema.virtual('renderedContent').get(function() {
  return marked(this.content);
});

pageSchema.pre('validate', function(next) {
  if (this.title) {
    this.urlTitle = this.title.replace(/\s/g, '_').replace(/\W/g, '');
  } else {
    this.urlTitle = Math.random().toString(36).subString(2, 7);
  }
  next();
});

pageSchema.statics.findByTag = function(tag) {
  return Page.find({
    tags: {
      $in: [tag]
    }
  }).exec();
};

pageSchema.methods.findSimilar = function() {
  return Page.find({
    tags: {
      $in: this.tags
    },
    _id: {
      $ne: this._id
    }
  }).exec();
};

var userSchema = new Schema({
    name:  { type: String, required: true },
    email: { type: String, required: true, unique: true }
  });

userSchema.statics.findOrCreate = function(userInfo){
  var self = this;

  return this.findOne({ email: userInfo.email }).exec()
    .then(function(user){
      if(user === null) return self.create(userInfo);
      else return user;
    });
};

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  Page: Page
};