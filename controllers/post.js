const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

//working correctly and refined.
exports.getPosts = (req,res,next) => {
    Post
        .find()
        .populate({
            path: 'user', // 1st level subdoc(gets users)
            populate: { // 2nd level subdoc(gets profile in user)
                path: 'profile',
                select: 'imageUrl' // selected fields only.
            }
        })
        .exec()
        .then( posts => {
            console.log(posts);
            if(req.session.user){
                res.render('posts/index',{
                    isLoggedIn: req.session.isLoggedIn,
                    userId: req.session.user._id.toString(),
                    posts: posts
                });
            } else {
                res.render('posts/index',{
                    isLoggedIn: req.session.isLoggedIn,
                    userId: '',
                    posts: posts
                });
            }
        })
        .catch(err => console.log(err));
};

//working correctly and refined.
exports.postAddPost = (req,res,next) => {
    const description = req.body.description;
    const userId = req.body.userId;
    User.findById(userId)
        .then(user => {
            if(user){
                const post = new Post({
                    user: userId,
                    description: description
                });
                post.save()
                    .then( () => {
                        res.redirect('/posts');
                    })
            } else {
                //TODO: Raise an error.
            }
        })
        .catch(err => console.log(err));
};

//working correctly and refined.
exports.getPost = (req,res,next) => {
    const postId = req.params.postId;
    Post
        .findById(postId)
        .populate({
            path: 'user',
            populate: {
                path: 'profile',
                select: 'imageUrl'
            }
        })
        .then( post => {
            if(post){
                Comment
                    .find({ post: post._id})
                    .populate({
                        path: 'user',
                        select: 'name profile',
                        populate: {
                            path: 'profile',
                            select: 'imageUrl'
                        }
                    })
                    .then( comments => {
                        if(req.session.user){
                            res.render('posts/post',{
                                isLoggedIn: req.session.isLoggedIn,
                                post: post,
                                userId: req.session.user._id,
                                comments: comments
                            });
                        } else {
                            res.render('posts/post',{
                                isLoggedIn: req.session.isLoggedIn,
                                post: post,
                                userId: '',
                                comments: comments
                            }); 
                        }
                    })
                    .catch(err => console.log(err));
            } else {
                //TODO: Raise a no post error.
            }
        })
        .catch(err => console.log(err));
}

//working correctly and refined.
exports.postDeletePost = (req,res,next) => {
    const postId = req.body.postId;
    Post
        .findById(postId)
        .then( post => {
            if(post){
                if(post.user == req.session.user._id.toString()){
                    Comment.deleteMany({ post: postId})
                        .then( () => {
                            Post.deleteOne({_id: postId})
                            .then( () => {
                                res.redirect('/posts');
                            })
                        })
                } else {
                    //TODO: Raise not authorized error.
                }
            } else {
                //TODO: Raise no post found error.
            }
        })
        .catch(err => console.log(err));
};

//working correctly and refined.
exports.postAddComment = (req,res,next) => {
    const userId = req.body.userId;
    const postId = req.body.postId;
    const description = req.body.description;
    User
        .findById(userId)
        .then( user => {
            if(user){
                const comment = new Comment({
                    user: userId,
                    post: postId,
                    description: description
                });
                comment.save()
                    .then( () => {
                        res.redirect(`/posts/${postId}`);
                    });
            } else {
                console.log("No User With this id Found");
                res.redirect(`/posts/${postId}`);
            }
        })
        .catch(err => console.log(err));
}

//working correctly and refined.
exports.postLike = (req,res,next) => {
    const postId = req.body.postId;
    const userId = req.body.userId;
    Post
        .findById(postId)
        .then( post => {
            if(post){
                if(!post.likedBy.includes(userId)){
                    if(post.dislikedBy.includes(userId)){
                        post.dislikes--;
                        post.dislikedBy.pop(userId);
                    }
                    post.likes++;
                    post.likedBy.push(userId);
                    post.save()
                        .then( result => {
                            console.log(result);
                            res.redirect('/posts');
                        })
                        .catch(err => console.log(err));
                } else {
                    console.log("You Have Already Liked This post.");
                    res.redirect('/posts');
                }
            } else {
                console.log("No Post With This Id Found.")
                res.redirect('/posts');
            }
        })
        .catch(err => console.log(err));
}

//working correctly and refined.
exports.postDislike = (req,res,next) => {
    const postId = req.body.postId;
    const userId = req.body.userId;
    Post
        .findById(postId)
        .then( post => {
            if(post){
                if(!post.dislikedBy.includes(userId)){
                    if(post.likedBy.includes(userId)){
                        post.likes--;
                        post.likedBy.pop(userId);
                    }
                    post.dislikes++;
                    post.dislikedBy.push(userId);
                    post.save()
                        .then( result => {
                            console.log(result);
                            res.redirect('/posts');
                        })
                        .catch(err => console.log(err));
                } else {
                    console.log("You Have Already Disliked This post.");
                    res.redirect('/posts');
                }
            }
        })
};