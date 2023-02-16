const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const dbo = require("../db/conn.js");
const auth = require("../middleware/auth.js");
var ObjectId = require("mongodb").ObjectID;

page = 1;
limit = 10;

//Create new scam route via a post
router.post("/scams/create", auth, async (req, res) => {
  if (req.body) {
    dbo
      .snapUsersMongo()
      .findOne({ _id: ObjectId(req.user._id) }, async (err, result) => {
        if (err) throw error;
        else if (!result.username || !result.snapchat_username)
          return res.send("Please complete your profile to POST something.");
        else if (req.user.snapchat_username == req.body.snapchat_username)
          return res.send("you cannot submit repoprt againts yourself.");
        else {
          dbo
            .snapMainMongo()
            .insertOne(
              { ...req.body, ip: req.ip, reportedBy: req.user._id },
              (error, results) => {
                if (error) throw error;
                res.send(results);
              }
            );
        }
      });
  } else {
    res.send({
      message:
        "There is a missing value that is required in order to create this job.",
    });
  }
});

//Route to get list of scams craeted using the username, or id to find the scams.
router.get("/scams/get",
  // auth,
  (req, res) => {
    statusPayload = "active";
    if (req.query.status) {
      statusPayload = req.query.status;
    }
    if (req.query.username) {
      payload = { username: req.query.username, status: statusPayload };
    }
    if (req.query.scammerUsername) {
      payload = {
        scammerUsername: req.query.scammerUsername,
        status: statusPayload,
      };
    }
    if (req.query.id) {
      payload = { _id: ObjectId(req.query.id), status: statusPayload };
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    if (req.query.page) {
      page = req.query.page;
    }

    if (req.query.username || req.query.id || req.query.scammerUsername) {
      dbo
        .snapMainMongo()
        .find(payload)
        .limit(limit)
        .skip((page - 1) * limit)
        .toArray(function (err, result) {
          if (err) {
            throw err;
          } else {
            res.send(result);
          }
        });
    } else {
      res.send("Invalid parameters");
    }
  });

//Delete a scam using the id of the scam
router.post("/scams/delete", auth, (req, res) => {
  if (req.body.id) {
    payload = { _id: ObjectId(req.body.id) };
    dbo.snapMainMongo().deleteOne(payload, function (err, result) {
      if (err) {
        throw err;
      } else {
        res.send(result);
      }
    });
  } else {
    res.send("Invalid parameters");
  }
});

router.get("/user/edit/:id",
  //  auth,
  (req, res) => {
    if (req.params.id) {
      dbo
        .snapUsersMongo()
        .findOne({ _id: ObjectId(req.params.id) }, async (err, result) => {
          if (err) throw err;
          res.send(result);
        });
    } else {
      throw Error("Invalid parameters");
    }
  });

router.get("/user/search",
  // auth, 
  async (req, res) => {
    try {
      const a = await dbo
        .snapMainMongo()
        .aggregate([
          { $match: { snapchat_username: new RegExp(req.query.search, "i") } },
          { $group: { _id: { $toLower: "$snapchat_username" } } },
        ])
        .toArray();
      res.send(a || []);
    } catch (error) {
      throw Error(error);
    }
  });

router.get("/scam/search",
  // auth,
  async (req, res) => {
    if (req.query) {
      const data = await dbo
        .snapMainMongo()
        .find({ snapchat_username: new RegExp(req.query.search, "i") })
        .toArray();

      // scamId
      const comments = await dbo
        .snapCommentsMongo()
        .aggregate([
          { $match: { scamId: { $in: data.map((v) => v._id.toString()) } } },
          {
            $lookup: {
              from: "comments",
              localField: "scamId",
              foreignField: "_id",
              as: "main",
            },
          },
        ])
        .toArray();
      const votes = await dbo
        .snapUpvotesMongo()
        .aggregate([
          { $match: { scamId: { $in: data.map((v) => v._id.toString()) } } },
          {
            $lookup: {
              from: "upvotes",
              localField: "scamId",
              foreignField: "_id",
              as: "main",
            },
          },
        ])
        .toArray();
      res.send({
        data: data || [],
        comments: comments.map((v) => v.scamId),
        votes: votes.map((v) => {
          return { scamId: v.scamId, vote: v.vote };
        }),
      });
    } else {
      throw Error("Invalid parameters.");
    }
  });

// no need to remove auth (calling in edit profile screen)
router.get("/user/reported_by", auth, async (req, res) => {
  if (req.query) {
    dbo
      .snapMainMongo()
      .countDocuments(
        { snapchat_username: req.user.snapchat_username },
        function (error, reported_by) {
          if (error) throw error;
          dbo.snapMainMongo().countDocuments(
            {
              reportedBy: ObjectId(req.user._id),
            },
            (err, scam_revealed) => {
              if (err) throw err;
              dbo.snapCommentsMongo().countDocuments(
                {
                  createdBy: new RegExp(req.user._id),
                },
                (errs, comments) => {
                  if (errs) throw errs;
                  // console.log('coments', errs, comments);
                  res.send({
                    reported_by: String(reported_by),
                    scam_revealed: String(scam_revealed),
                    comments: String(comments),
                  });
                }
              );
              // res.send({
              //   reported_by: String(reported_by),
              //   scam_revealed: String(scam_revealed),
              // });
            }
          );
        }
      );
  } else {
    throw Error("Invalid parameters.");
  }
});

router.patch("/update_profile/:id", auth, (req, res) => {
  if (req.params.id) {
    const {
      email,
      last_name,
      snapchat_username,
      name,
      profile_image,
      username,
      signup_newsletter,
    } = req.body;
    dbo.snapUsersMongo().findOne({ snapchat_username }, (error, result) => {
      if (error) throw error;
      console.log('cxcxcx--->', req.params.id, result, snapchat_username);
      if (result !== null
      ) {
        return res.send({ success: false, msg: "Snapchat username already exist" });
        // throw Error("Snapchat username already exist");
      }
      else {
        dbo.snapUsersMongo().findOneAndUpdate(
          { _id: ObjectId(req.params.id.toString()) },
          {
            $set: {
              name,
              email,
              last_name,
              snapchat_username,
              profile_image,
              username,
              signup_newsletter,
            },
          },
          { new: true },
          function (err, result) {
            if (err) throw err;
            console.log('err---------->', err, error);
            res.send({ result, success: true });
          }
        );
      }
    });
  } else {
    throw Error("Invalid parameters");
  }
});

//Show the most recent scams created in mongodb
router.get("/scams/get/latest",
  //auth, 
  (req, res) => {
    if (req.query.limit) {
      if (req.query.limit) {
        limit = +req.query.limit;
      }
      if (req.query.page) {
        page = +req.query.page;
      }
      payload = { status: "active" };
      if (req.query.status) {
        payload = { status: req.query.status };
      }
      dbo
        .snapMainMongo()
        .find({ snapchat_username: req.query.snapchat_username })
        .sort({ _id: -1 })
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .toArray(function (err, result) {
          if (err) throw err;
          res.send(result);
        });
    }
  });

//Update the status of a scam (will be used by admin system)
router.post("/scams/update/status", auth, (req, res) => {
  if (req.body.status && req.body.id) {
    dbo.snapMainMongo.findOneAndUpdate(
      { _id: ObjectId(req.body._id) },
      { $set: { status: req.body.status } },
      function (err, result) {
        if (err) {
          throw err;
        } else {
          res.send(result);
        }
      }
    );
  } else {
    res.send({
      message: "The jobID or the status is missing from the request.",
    });
  }
});

//Route to create comments
router.post("/comments/create", auth, (req, res) => {
  dbo.snapCommentsMongo().insertOne({ ...req.body }, (err, result) => {
    if (err) throw err;
    res.send(req.body);
  });
});

router.post("/vote", auth, async (req, res) => {
  const { vote = "", createdBy } = req.body;
  dbo.snapUpvotesMongo().findOne({ createdBy }, (err, result) => {
    if (err) throw err;
    if (result === null) {
      dbo.snapUpvotesMongo().insertOne({ ...req.body }, (err, _) => {
        if (err) throw err;
        return res.send(req.body);
      });
    } else if (vote.trim().length) {
      dbo
        .snapUpvotesMongo()
        .findOneAndUpdate({ createdBy }, { $set: { vote } }, (error, _) => {
          if (error) throw error;
          return res.send(req.body);
        });
    } else {
      dbo.snapUpvotesMongo().deleteOne({ createdBy }, (error, _) => {
        if (error) throw error;
        return res.send(req.body);
      });
    }
  });
});

router.get("/votes/:scamId",
  // auth,
  async (req, res) => {
    try {
      // console.log("req.params.scamId", req.params.scamId);
      const data = await dbo
        .snapUpvotesMongo()
        .find({ scamId: new RegExp(req.params.scamId, "i") })
        .toArray();
      res.send(data || []);
    } catch (error) {
      throw error;
    }
  });

//Route to cfiull scam report
router.get("/scam_report/:scamId",
  //  auth,
  (req, res) => {
    dbo
      .snapMainMongo()
      .findOne({ _id: ObjectId(req.params.scamId) }, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
  });

router.get("/comments/:scamId",
  //  auth,
  async (req, res) => {
    try {
      const data = await dbo
        .snapCommentsMongo()
        .find({ scamId: new RegExp(req.params.scamId, "i") })
        .toArray();
      res.send(data || []);
    } catch (error) {
      throw error;
    }
  });

//Create user to reprt scams
router.post("/users/create", async (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ _id: email.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });
  console.log("req.body", req.body);
  dbo.snapUsersMongo().findOne({ email }, async (err, result) => {
    if (err) throw err;
    if (result === null) {
      const insert = await dbo
        .snapUsersMongo()
        .insertOne({ ...req.body, token });
      const user = await dbo
        .snapUsersMongo()
        .findOne({ _id: insert.insertedId });
      res.send(user);
    } else if (result) res.send("exist");
  });
});

// login user to reprt scams
router.post("/users/login", (req, res) => {
  const { email = "", password = "" } = req.body;
  const token = jwt.sign({ _id: email?.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });
  dbo.snapUsersMongo().findOne({ email }, async (err, result) => {
    if (err) throw err;
    else if (result === null) res.send("User Not Exist");
    else if (result.password != password) res.send("Password Incorrect");
    else {
      dbo
        .snapUsersMongo()
        .findOneAndUpdate({ email }, { $set: { token } }, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
    }
  });
});

module.exports = router;
