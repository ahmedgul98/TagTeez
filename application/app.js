var express=require("express");
var mongoose =require("mongoose");
var passport =require("passport");
var bodyParser =require("body-parser");
var User =require("./models/user");
var Cart = require('./models/cart');
var Order = require('./models/order');
var Wallet = require('./models/wallet');
var Account =require("./models/account");
var review=require("./models/review");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var path=require("path");
var crypto=require("crypto");
var multer=require("multer");
var GridFsStorage=require("multer-gridfs-storage");
var Grid=require("gridfs-stream");
var methodOverride=require("method-override");
mongoose.connect("mongodb://localhost/projectdbv2");
var mongoURI="mongodb://localhost/projectdbv2"
var conn =mongoose.createConnection(mongoURI);
var app=express();
var MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(require("express-session")({
//     secret: "Ahmed tahir ammar",
//     resave: false,
//     saveUninitialized: false
// }));
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
app.use(session({
  secret:'mysupersecret',
  resave:false,
  saveUninitialized:false,
  store:new MongoStore({mongooseConnection:mongoose.connection}),
  cookie:{maxAge:180*60*1000}
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy
(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req ,res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session=req.session;
  next();
});
let gfs;
conn.once('open',function(){
    gfs=Grid(conn.db,mongoose.mongo);
    gfs.collection("uploads");
})
//generate name(long strings)
 var storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          metadata: person
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
//============
// ROUTES
//============
                                     
app.get("/",function(req,res){
    res.render("landingpage.ejs");
})

app.get("/cart",function(req,res){
    res.render("cart.ejs");
    
})
app.get("/add-to-cart/:id",function(req,res){
  //  var filename=req.params.filename;
    var pid=req.params.id;
    console.log(pid);
    var cart=new Cart(req.session.cart? req.session.cart : {});
  //  gfs.files
    // gfs.fileInfo.findOne({_id:pid})
    // .populate("metadata")
    // .exec(function(err,found){
    //     if(err){
    //         console.log("error");
    //     }
    //     console.log(found.metadata);
    // });
    // MongoClient.connect(mongoURI,function(err,db){
    //     if(err){console.log(err)}
    //     var dbo=db.db("projectdbv2");
    //     // dbo.collection("uploads.files").find({pid},function(err,result){
    //     //     if(err){console.log(err)}
    //     //     console.log(result);
    //     // })
    //     var collection=dbo.collection("uploads.files");
    //     collection.findById(pid).populate.exec(function(err,result){
    //         if(err){console.log(err)}
    //         console.log(result.metadata);
    //     })
    // })
    
    //console.log(gfs.metadata);
    cart.add(pid);
    req.session.cart = cart;
    console.log(req.session.cart);
   res.redirect('/buyer');
    
});
app.get('/timeline',function(req, res, next){
   User.findOne({username: req.user.username}, function(err, foundUser){
        if(err){
            console.log("ammarr");
        } else {
            Order.find({user:foundUser},function(err,x){
                if(err){
                console.log("ammarr");}
                res.render('timeline',{x:x});
                })
            }
     
        });
                 
            

});
app.get('/reduce/:id',function(req, res, next){
  var pid=req.params.id;
  var cart=new Cart(req.session.cart? req.session.cart : {});
  cart.reduceByOne(pid);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
  
});
app.post('/x',function(req, res, next){
  var pid=req.body.username;
  var y=req.body.status;
   User.findOne({username: pid}, function(err, foundUser){
        if(err){
            console.log("ammarr");
        } else {
            Order.findOne({user:foundUser},function(err,x){
                if(err){
                console.log("ammarr");}
                x.status=y;
                console.log(x.status);
                x.save();
                res.redirect('/admin');
                 })
            }
     
        
 // res.redirect('/admin');
});
})



app.get('/remove/:id',function(req, res, next){
  var pid=req.params.id;
  var cart=new Cart(req.session.cart? req.session.cart : {});
  cart.removeItem(pid);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});
app.get('/shopping-cart',function(req, res, next){
  if(!req.session.cart){
    return res.render('shopping-cart',{products:null});
  }
    gfs.files.find().toArray( (err,files)=>{
         if(!files || files.length === 0){
            res.render("sales",{files:false});
         }
         else{
             files.map(file =>{
                 if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
                     file.isImage=true;
                 }
                 else{
                     file.isImage=false;
                 }
             })
            // res.render("sales",{files:files});
         
 // return res.json(files);
           
  var cart= new Cart(req.session.cart);
  res.render('shopping-cart',{products:cart.generateArray(), totalPrice:cart.totalPrice,files:files});
    }});
});


app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});
app.get("/sales",function(req, res) {
    res.render("sales.ejs");
})
app.get("/admin",function(req, res) {
    res.render("admin.ejs");
});
/*app.get("/success",function(req, res) {
    res.render("success.ejs");*/
app.get("/signup",function(req,res){
    res.render("signup.ejs");
})
app.get("/login",function(req, res) {
    res.render("login1.ejs");
})
app.get("/success",isLoggedIn, function(req, res){
   res.render("success.ejs"); 
});
app.get("/about",function(req, res) {
    res.render("about.ejs");
})

app.get("/contact",function(req, res) {
    res.render("contact.ejs");
})
app.get("/editor",function(req, res) {
    res.render("editor");
})
app.get("/error",function(req, res) {
    res.render("error.ejs");
})
var person;
app.post("/login", passport.authenticate("local", {
    //successRedirect: "/success",
    failureRedirect: "/login"
}) ,function(req, res){
    User.findOne({username: req.user.username}, function(err, foundUser){
        if(err){
            console.log("ammarr");
        } else {
            person=foundUser;
            Account.findOne({a_user: foundUser}, function(err, foundUser1){
                 if(err){
            console.log("ammarr");}
           
         else if(foundUser1.typ==="Buy"){
                return res.redirect('buyer');
            }
            else if(foundUser1.typ==="Des"){
               //  console.log(foundUser1);
                return res.redirect('editor');
            }
            else if(foundUser1.typ==="Admin"){
                return res.redirect("admin");
            }
            })
        }
    });
});
app.post('/checkout',isLoggedIn,function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
   }
    var cart= new Cart(req.session.cart);
    Order.create({
        user:req.user,
    cart:cart,
    address:req.body.address,
    name:req.body.name,
    status:1
    });
    return res.redirect('/shopping-cart');
});
//handling user sign up
app.post("/review",function(req, res) {
    review.create({
        text:req.body.text
    },function(err,acc){
        if(err){
            console.log("error");
        }
        //User.findOne({username: req.user.username}, function(err, foundUser){
        acc.r_acc.push(person);
        acc.save(function(err, data){
                if(err){
                    console.log(err);
                } else {
                    console.log(data);
                }
    })
    // res.render("sales",{text:text,foundPerson:person});
    // review.find(text).toArray(function(err,text){
    // if(err){
    //     console.log(err);
    // }
    // console.log(text);
    //res.render("sales",{text:text});
//})
})
res.redirect("/buyer");
})
app.get('/checkout', isLoggedIn,function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
   }
   var cart= new Cart(req.session.cart);
   res.render('checkout',{total:cart.totalPrice});
});
    
app.post("/signup", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('signup');
        }                                                                                                                                                                           
        passport.authenticate("local")(req, res, function(){
           
           res.redirect("login");
            console.log("user added"); 
        });
          Account.create({
               email:req.body.email,
               typ:req.body.type
           },function(err,acc){
               if(err){console.log(err);}
               acc.a_user.push(user);
               acc.save(function(err, data){
                if(err){
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
             Wallet.create({
               amount:1000,
           },function(err,w){
               if(err){console.log(err);}
               w.w_acc.push(acc);
               w.save(function(err, data){
                if(err){
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
           })
           })
    });
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.get("/images",function(req,res){
    gfs.files.find().toArray( (err,files)=>{
         if(!files || files.length === 0){
            res.render("collection",{files:false});
         }
         else{
             files.map(file =>{
                 if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
                     file.isImage=true;
                 }
                 else{
                     file.isImage=false;
                 }
             })
             res.render("collection",{files:files});
         }
 // return res.json(files);
            });
});
app.get("/buyer",function(req,res){
    var cart=new Cart(req.session.cart? req.session.cart : {});
    gfs.files.find().toArray( (err,files)=>{
         if(!files || files.length === 0){
            res.render("sales",{files:false});
         }
         else{
             files.map(file =>{
                 if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
                     file.isImage=true;
                 }
                 else{
                     file.isImage=false;
                 }
             })
             res.render("sales",{files:files});
         }
 // return res.json(files);
            });

});

app.post("/upload", upload.single('file'), function(req, res) {
    res.redirect("/images");
});
   
app.delete("/files/:id",function(req,res){
    gfs.remove({_id:req.params.id ,root:"uploads"},function(err,gridStore){
        if(err){
            res.send("Cant Delete");
        }
        res.redirect("images");
    });
})
app.get("/files",function(req, res) {
    gfs.files.find().toArray( (err,files)=>{
         if(!files || files.length === 0){
            res.send(err);
         }
  return res.json(files);
            });
});
app.get("/files/:filename",function(req, res) {
    gfs.files.findOne({filename:req.params.filename},(err,file)=>{
         if(!file || file.length === 0){
            res.send(err);
         }
         return res.json(file);
    });
}); 
app.get("/image/:filename",function(req, res) {
       gfs.files.findOne({filename:req.params.filename},(err,file)=>{
         if(!file || file.length === 0){
            res.send(err);
         }
         if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
             const readstream=gfs.createReadStream(file.filename);
             readstream.pipe(res);
         }else{
             res.send("Not an image");
         }
  })
})

//  var application=express();
//       var server=require('http').createServer(application);
//       var io=require('socket.io').listen(server);
//         //server.listen(3000,function(){
//       //server.listen(process.env.PORT , process.env.IP,function(){
//     //    console.log("listening on 3000");
//     //});
 
//      application.get("/chat",function(req,res){
//      res.send('index.html');
// })




app.listen(process.env.PORT ,process.env.IP,function(){
  console.log("your server is started"); 
});