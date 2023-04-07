
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

/////////////Requests Targetting all Article////////////////

app.route("/articles")

.get(function(req,res){
    Article.find({})
    .then(function(foundArticle){
        res.send(foundArticle);
    })
    .catch(function(err){
        res.send(err);
    });
})

.post(function(req,res){
   
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save().then(function(err){
        if(!err){
            res.send("Successfully added a new article.");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({}).
    then(function(err){
        if(!err){
            res.send("Successfully deleted all the articles.")
        }
        else{
            res.send(err);
        }
    });
});

/////////////Requests Targetting A Specific Article////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle})
    .then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No matching article found.")
        }
    });
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title , content: req.body.content},
        {upsert: true}
        )
        .then(function(err){
            if(!err){
                res.send("Successfully updated article.")
            }
        });
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    )
    .then(function(err){
        if(!err){
            res.send("Successfully Updated Article")
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle}
    )
    .then(function(err){
        if(!err){
            res.send("Successfully Deleted")
        }
        else{
            res.send(err);
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});