const express =require('express')
const router= express.Router()
const bcrypt =require("bcrypt");

const {sign}=require("jsonwebtoken");

const {Users} = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');


router.post("/",async (req,res)=>{
   const {username,password}=req.body;
   const hash= await bcrypt.hash(password,10);
  await Users.create({
    username:username,
    password:hash,

 })
  return res.json("success");



});

router.post('/login',async (req,res)=>{
    const {username,password}=req.body;

    const user=await Users.findOne({where:{username:username}});

    if(!user){ return res.json({error:"user doesn't exist"})};
    const match=await bcrypt.compare(password,user.password);

        if(!match) {return res.json({error:"wrong username and password compbination"})};

        const accessToken=sign({username:user.username,id:user.id},"importantsecret");

         return res.json({token:accessToken,username:username,id:user.id});
    
});

router.get('/auth', validateToken,(req,res)=>{
  res.json(req.user);


});

 router.get('/basicinfo/:id',async (req,res)=>{
    const id= req.params.id;
    const basicInfo= await Users.findByPk(id,{attributes:{exclude:['password']}})
   res.json(basicInfo);
 });

router.put('/changepassword', validateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        console.log("OLD PASSWORD RECEIVED:", oldPassword);
        console.log("NEW PASSWORD RECEIVED:", newPassword);
        console.log("REQ.USER:", req.user);

        const user = await Users.findOne({
            where: {
                username: req.user.username
            }
        });

        console.log("USER FOUND:", user?.username);
        console.log("HASH FROM DB:", user?.password);

        if (!user) {
            return res.json({ error: "User not found" });
        }

        const match = await bcrypt.compare(oldPassword, user.password);

        console.log("PASSWORD MATCH:", match);

        if (!match) {
            return res.json({ error: "Wrong password entered" });
        }

        const hash = await bcrypt.hash(newPassword, 10);

        console.log("NEW HASH:", hash);

        await Users.update(
            { password: hash },
            {
                where: {
                    username: req.user.username
                }
            }
        );

        console.log("PASSWORD UPDATED");

        return res.json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log("CHANGE PASSWORD ERROR:", error);

        return res.status(500).json({
            error: error.message
        });
    }
});



module.exports= router