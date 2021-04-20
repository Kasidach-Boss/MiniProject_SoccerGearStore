
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
let books = {
    list:[
        {id:1,bookname:"C++",author:"Bob",publish:"12/04/2561",number_of_book:10 }
    ]
}

let soccers = {
    list:[
        {id:1,brand:"nike",model:"hypervenom",type:"shoes",price:4700,remark:"In stock" }
    ]
}
router.route('/soccers')
.get((req,res)=>{
    res.send(soccers);
})
.post((req,res)=>{
    let id = (soccers.list.length)?soccers.list[soccers.list.length-1].id+1:1;
    let barnd = req.body.brand;
    let model = req.body.model;
    let type = req.body.type;
    let price = req.body.price;
    let remark = req.body.remark;
    soccers.list = [...soccers.list,{id,brand,model,type,price,remark}];
    res.json(soccers)
})

router.route('/soccers/:soccer_id')
.get((req,res)=>{
    let id = soccers.list.findIndex((item)=>(item.id === +req.params.soccer_id));
    res.json(soccers.list[id]);
})
.put((req,res)=>{
    let id = soccers.list.findIndex((item)=>(item.id === +req.params.book_id));
    soccers.list[id].brand = req.body.brand;
    soccers.list[id].model = req.body.model;
    soccers.list[id].type = req.body.type;
    soccers.list[id].price = req.body.price;
    soccers.list[id].remark = req.body.remark;
    res.json(soccers);
})
.delete((req,res)=>{
    soccers.list = soccers.list.filter((item)=> item.id !== +req.params.soccer_id);
    res.json(soccers);
})

let income = 0
router.route('/income')
     .get((req, res) => res.json(income))





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
