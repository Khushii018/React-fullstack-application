module.exports= (sequelize,DataTypes)=>{

    const Posts =sequelize.define("Posts",{
        title :{
            type:DataTypes.STRING,
            allowNull:false,
        },
        postText :{
            type:DataTypes.STRING,
            allowNull:false,
        },
        username :{
            type:DataTypes.STRING,
            allowNull:false,
        },
         UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
        Posts.associate=(models)=>{
            Posts.hasMany(models.Comments, {
            onDelete: "CASCADE",
        });

        Posts.hasMany(models.Likes, {
            onDelete: "CASCADE",
        });

    };
        
    return Posts;
}