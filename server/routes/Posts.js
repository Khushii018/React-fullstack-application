const express =require('express')
const router= express.Router()

const {Posts,Likes} = require('../models');
const {validateToken}= require('../middlewares/AuthMiddleware');
const { where } = require('sequelize');

router.get("/", validateToken, async (req, res) => {
    try {
        const listOfPosts = await Posts.findAll({
            include: [Likes]
        });

        const likedPosts = await Likes.findAll({
            where: {
                UserId: req.user.id
            }
        });

        res.json({
            listOfPosts,
            likedPosts
        });

    } catch (error) {
        console.log("GET POSTS BACKEND ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

router.post("/", validateToken, async (req, res) => {
    try {
        const post = {
            title: req.body.title,
            postText: req.body.postText,
            username: req.user.username,
            UserId: req.user.id
        };

        const createdPost = await Posts.create(post);

        res.json(createdPost);

    } catch (error) {
        console.log("CREATE POST ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


router.get("/byId/:id",async(req,res)=>{
  const id=req.params.id;
  const post=await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const posts = await Posts.findAll({
            where: {
                UserId: userId
            },
            include: [Likes]
        });

        res.json(posts);

    } catch (error) {
        console.log("PROFILE POSTS ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

router.delete("/:postId", validateToken, async (req, res) => {
    try {
        const postId = req.params.postId;

        console.log("POST ID RECEIVED:", postId);

        const deleted = await Posts.destroy({
            where: {
                id: postId,
            },
        });

        console.log("ROWS DELETED:", deleted);

        if (deleted === 0) {
            return res.status(404).json({
                error: "Post not found",
            });
        }

        return res.json({
            message: "Post deleted successfully",
        });

    } catch (error) {
        console.log("DELETE ERROR:", error);

        return res.status(500).json({
            error: error.message,
        });
    }
});

router.put("/postText", validateToken, async (req, res) => {
    try {
        const {newText,id}= req.body;

        await Posts.update({postText:newText},{where:{id:id}});

        res.json(newText);


    } catch (error) {
        console.log("CREATE POST ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

router.put("/title", validateToken, async (req, res) => {
    try {
        const {newTitle,id}= req.body;

        await Posts.update({title:newTitle},{where:{id:id}});

        res.json(newTitle);

    } catch (error) {
        console.log("CREATE POST ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


module.exports= router