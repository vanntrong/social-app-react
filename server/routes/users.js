const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//UPDATE USER
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json({
          success: false,
          error,
        });
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        success: true,
        message: "User updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    res.status(403).json({
      success: false,
      message: "You can update only your account",
    });
  }
});
//DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Account has been deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  } else {
    res.status(403).json({
      success: false,
      message: "You can delete only your account",
    });
  }
});
//GET USER
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user) {
      const { password, ...other } = user._doc;
      res.status(200).json({
        success: true,
        user: { ...other },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

//GET FRIENDS
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend._doc;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//FOLLOW USER
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json({
          success: false,
          message: "You already follow this user",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  } else {
    res.status(403).json({
      success: false,
      message: "You can't follow yourself",
    });
  }
});
//UNFOLLOW USER
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json({
          success: false,
          message: "You don't follow this user",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  } else {
    res.status(403).json({
      success: false,
      message: "You can't unfollow yourself",
    });
  }
});
module.exports = router;
