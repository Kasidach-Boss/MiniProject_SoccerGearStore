const express = require('express'),
    app = express(),
    passport = require('passport'),
    port = process.env.PORT || 80,
    cors = require('cors'),
    cookie = require('cookie')

const bcrypt = require('bcrypt')

const db = require('./database.js')
let users = db.users


require('./passport.js')

const router = require('express').Router(),
    jwt = require('jsonwebtoken')

app.use('/api', router)
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
router.use(express.json())
router.use(express.urlencoded({ extended: false }))


router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('Login: ', req.body, user, err, info)
        if (err) return next(err)
        if (user) {
            console.log("Body:",req.body);
            if (req.body.remember == true) {
              exp = "7d";
            } else exp = "1d";
            const token = jwt.sign(user, db.SECRET, {
                expiresIn: exp,
              });
            var decoded = jwt.decode(token);
            let time = new Date(decoded.exp * 1000);
            console.log(new Date(decoded.exp * 1000));
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 60 * 60,
                    sameSite: "strict",
                    path: "/",
                })
            );
            res.statusCode = 200
            return res.json({ user, token })
        } else
            return res.status(422).json(info)
    })(req, res, next)

    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send(req.user)
    }
})

router.get('/logout', (req, res) => { 
    
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: -1,
            sameSite: "strict",
            path: "/",
        })
    );
    res.statusCode = 200
    
    return res.json({ message: 'Logout successful' })
})

/* GET user profile. */
router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send(req.user)
    });

router.post('/register',
    async (req, res) => {
        try {
            const SALT_ROUND = 10
            const { username, email, password } = req.body 
            if (!username || !email || !password)
                return res.json( {message: "Cannot register with empty string"})
            if (db.checkExistingUser(username) !== db.NOT_FOUND)
                return res.json({ message: "Duplicated user" })

            let id = (users.users.length) ? users.users[users.users.length - 1].id + 1 : 1
            hash = await bcrypt.hash(password, SALT_ROUND)
            users.users.push({ id, username, password: hash, email })
            res.status(200).json({ message: "Register success" })
        } catch {
            res.status(422).json({ message: "Cannot register" })
        }
    })

router.get('/alluser', (req,res) => res.json(db.users.users))

router.get('/', (req, res, next) => {
    res.send('Respond without authentication');
});

router.get('/foo',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send('foo')
});    


let soccers = {
    list:[
        {id:1,image:"https://cdn.arifootballstore.com/catalog/product/cache/image/beff4985b56e3afdbeabfc89641a4582/n/i/nike_vapor_14_pro_fg_-_black_cyber-off_noir_-_cu5693-090_02.jpg?w=400",brand:"Nike",model:"Nike MERCURIAL VAPOR 14 PRO",type:"shoes",price:4700,numberofproduct:20,remark:"In stock" },
        {id:2,image:"https://cdn.arifootballstore.com/catalog/product/cache/image/beff4985b56e3afdbeabfc89641a4582/p/r/predator_freak_fg_fw7617__02.jpg?w=400",brand:"Adidas",model:"ADIDAS PREDATOR FREAK+ FG - CORE BLACK/SHOCK PINK",type:"shoes",price:10500,numberofproduct:10,remark:"In stock"},
        {id:3,image:"https://cdn.arifootballstore.com/catalog/product/cache/image/beff4985b56e3afdbeabfc89641a4582/p/u/puma_ultra_1.2_fg_ag_-_black_white_yellow_10629902__02.jpg?w=400",brand:"Puma",model:"PUMA ULTRA 1.2 FG/AG - BLACK/YELLOW",type:"shoes",price:7999,numberofproduct:10,remark:"In stock"},
        {id:4,image:"https://d1a2ggqmhsoom.cloudfront.net/ON-V5_I4cKzXLtbbvSxEGsZJpt4=/fit-in/346x500/filters:quality(90):fill(ffffff)/http://static-catalog.supersports.co.th/p/puma-2647-18827-1.jpg",brand:"Puma",model:"PUMA MANCHESTER CITY 2020/2021 HOME PLAYER JERSEY - TEAM LIGHT BLUE",type:"kit",price:2799,numberofproduct:100,remark:"In stock"},
        {id:5,image:"https://cdn.arifootballstore.com/catalog/product/cache/image/beff4985b56e3afdbeabfc89641a4582/a/d/adidas_finale_pro_-_white_ironmt_silvmt_gk3477__01.jpg?w=400",brand:"Adidas",model:"ADIDAS FINALE 21 20TH ANNIVERSARY UCL PRO BALL - WHITE/IRON METALLIC",type:"Ball",price:4200,numberofproduct:50,remark:"In stock"},
        {id:6,image:"https://cdn.arifootballstore.com/catalog/product/cache/image/beff4985b56e3afdbeabfc89641a4582/j/_/j_guard_shin_guard_black_sp0040-009_lr_01.jpg?w=400",brand:"Nike",model:"NIKE J GUARD - BLACK/WHITEC",type:"accessory",price:350,numberofproduct:1,remark:"In stock"},
    ]
}
router.route('/soccers')
.get((req,res)=>{
    res.send(soccers);
})
.post((req,res)=>{
    let id = (soccers.list.length)?soccers.list[soccers.list.length-1].id+1:1;
    let image = req.body.image;
    let brand = req.body.brand;
    let model = req.body.model;
    let type = req.body.type;
    let price = req.body.price;
    let numberofproduct = req.body.numberofproduct;
    let remark = req.body.remark;
    soccers.list = [...soccers.list,{id,image,brand,model,type,price,numberofproduct,remark}];
    res.json(soccers)
})

router.route('/soccers/:soccer_id')
.get((req,res)=>{
    let id = soccers.list.findIndex((item)=>(item.id === +req.params.soccer_id));
    res.json(soccers.list[id]);
})
.put((req,res)=>{
    let id = soccers.list.findIndex((item)=>(item.id === +req.params.soccer_id));
    soccers.list[id].image = req.body.image;
    soccers.list[id].brand = req.body.brand;
    soccers.list[id].model = req.body.model;
    soccers.list[id].type = req.body.type;
    soccers.list[id].price = req.body.price;
    soccers.list[id].numberofproduct = req.body.numberofproduct;
    soccers.list[id].remark = req.body.remark;
    res.json(soccers);
})
.delete((req,res)=>{
    soccers.list = soccers.list.filter((item)=> item.id !== +req.params.soccer_id);
    res.json(soccers);
})

router.route('/soccers/buy/:soccer_id')
.put((req,res)=>{
    let id = soccers.list.findIndex((item)=>(item.id === +req.params.soccer_id));
    soccers.list[id].numberofproduct =soccers.list[id].numberofproduct - 1 ;
    if(soccers.list[id].numberofproduct === 0 ){
        soccers.list[id].remark = "out of stock";
    }
    if(soccers.list[id].numberofproduct < 0){
        soccers.list[id].numberofproduct = 0;
        soccers.list[id].remark = "out of stock";
    }
    res.json(soccers);
})





// Error Handler
app.use((err, req, res, next) => {
    let statusCode = err.status || 500
    res.status(statusCode);
    res.json({
        error: {
            status: statusCode,
            message: err.message,
        }
    });
});


// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`))

