import { useContext, useEffect } from "react";
import { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { apiUrl } from "../../shared";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import "./post.css";
import { AuthContext } from "../../context/AuthContext";

const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post.likes, currentUser._id]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${apiUrl}users?userId=${post.userId}`);
      setUser(res.data.user);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = async () => {
    try {
      axios.put(`${apiUrl}posts/${post._id}/like`, { userId: currentUser._id });
    } catch (error) {}
    setLike((preState) => (isLiked ? preState - 1 : preState + 1));
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={user?.profilePicture ? user?.profilePicture : publicFolder + "/person/noAvatar.png"}
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user?.username}</span>
            <span className="postDate">{format(post?.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img src={publicFolder + post.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img src="/assets/like.png" alt="" className="likeIcon" onClick={likeHandler} />
            <img src="/assets/heart.png" alt="" className="likeIcon" onClick={likeHandler} />
            <span className="likeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
