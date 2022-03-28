const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE NEW POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({
      success: true,
      post: savedPost,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});
//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json({
          success: true,
          message: "Post updated successfully",
        });
      } else {
        res.status(403).json({
          success: false,
          message: "You can update only your post",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
    });
  }
});
//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json({
          success: true,
          message: "Post deleted successfully",
        });
      } else {
        res.status(403).json({
          success: false,
          message: "You can delete only your post",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
    });
  }
});
//LIKE POST
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({
        success: true,
        message: "Post liked successfully",
      });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({
        success: true,
        message: "Post unliked successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json({
        success: true,
        post,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//GET TIMELINE POSTS
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    res.status(200).json({
      success: true,
      posts: userPosts.concat(...friendPosts),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//GET USER'S POSTS
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
