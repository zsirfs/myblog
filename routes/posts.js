let express = require('express');
let router = express.Router();
// 导入文章模型
let PostModel = require('../models/posts');
// 导入留言模型
let CommentModel = require('../models/comments');

let checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function(req, res, next) {
    let author = req.query.author;

    PostModel.getPosts(author)
        .then(function(posts) {
            res.render('posts', {
                title: '文章列表',
                posts: posts
            })
        })
        .catch(next)
});
// 发表一篇文章
router.post('/', checkLogin, function(req, res, next) {
    let author = req.session.user._id;
    let title = req.fields.title;
    let content = req.fields.content;

    // 校验参数
    try{
        if(!title.length) {
            throw new Error('请填写标题')
        }
        if(!content.length) {
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back')
    }
    let post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };
    PostModel.create(post)
        .then(function(result) {
            // 此post是插入mongodb后的值，包含_id
            post = result.ops[0];
            req.flash('success', '发表成功');
            // 发表成功后跳转到该文章页
            res.redirect(`/posts/${post._id}`)
        })
        .catch(next)
});
// 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
    res.render('create', {
        title: '新建文章'
    })
});
// 单独一篇的文章页
router.get('/:postId', function(req, res, next) {
    let postId = req.params.postId;
    Promise.all([
        PostModel.getPostById(postId), // 获取文章信息
        CommentModel.getComments(postId),
        PostModel.incPv(postId) // pv 增加 1
    ]).then(function(result) {
        let post = result[0];
        let comments = result[1];
        if(!post) {
            throw new Error('该文章不存在')
        }
        res.render('post', {
            title: post.title,
            post: post,
            comments: comments
        }).catch(next)
    })
});
// 更新一篇文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    let postId = req.params.postId;
    let author = req.session.user._id;

    PostModel
        .getRawPostById(postId)
        .then(function(post) {
            if(!post) {
                throw new Error('该文章不存在')
            }
            if(author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足')
            }
            res.render('edit', {
                post: post
            }).catch(next)
        })
});
// 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    let postId = req.params.postId;
    let author = req.session.user._id;
    let title = req.fields.title;
    let content = req.fields.content;

    PostModel
        .updatePostById(postId, author, {
            title: title,
            content: content
        })
        .then(function() {
            req.flash('success', '编辑文章成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/posts/${postId}`)
        })
        .catch(next)
});
// 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    let postId = req.params.postId;
    let author = req.session.user._id;

    PostModel
        .delPostById(postId, author)
        .then(function() {
            req.flash('success', '删除文章成功');
            // 删除成功后跳转到主页
            res.redirect('/posts')
        })
        .catch(next)

});
// 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
    let author = req.session.user._id;
    let postId = req.params.postId;
    let content = req.fields.content;
    let comment = {
        author: author,
        postId: postId,
        content: content
    };

    CommentModel
        .create(comment)
        .then(function() {
            req.flash('success', '留言成功');
            res.redirect('back')
        })
        .catch(next)
});
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
    let commentId = req.params.comments;
    let author = req.session.user._id;

    CommentModel
        .delCommentById(commentId, author)
        .then(function() {
            req.flash('success', '删除留言成功');
            res.redirect('back')
        })
        .catch(next)
});
module.exports = router;




