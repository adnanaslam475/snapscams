const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let snapMainMongo;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      let snapScams = db.db("SnapScams");
      snapMainMongo = snapScams.collection("main");

      snapCommentsMongo = snapScams.collection("comments");
      snapUsersMongo = snapScams.collection("users");
      snapUpvotesMongo = snapScams.collection("upvotes");
      return callback();
    });
  },

  snapMainMongo: function () {
    return snapMainMongo;
  },
  snapUsersMongo: function () {
    return snapUsersMongo;
  },
  snapCommentsMongo: function () {
    return snapCommentsMongo;
  },
  snapUpvotesMongo: function () {
    return snapUpvotesMongo;
  },
};
