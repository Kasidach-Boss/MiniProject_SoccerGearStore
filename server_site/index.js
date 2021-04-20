const express = require('express');
const passport = require('passport');
const app = express();
const cors = require('cors');
const router = express.Router();
const port = process.env.PORT||80;
// let users = db.user;

app.use('/api',router);
router.use(cors({origin:'http://localhost:3000', credentials: true }));
router.use(express.json());
router.use(express.urlencoded({extended:false}));

let books = {
    list:[
        {id:1,bookname:"C++",author:"Bob",publish:"12/04/2561",number_of_book:10 }
    ]
}
router.route('/books')
.get((req,res)=>{
    res.send(books);
})
.post((req,res)=>{
    let id = (books.list.length)?books.list[books.list.length-1].id+1:1;
    let bookname = req.body.bookname;
    let author = req.body.author;
    let publish = req.body.publish;
    let number_of_book = req.body.number_of_book;
    books.list = [...books.list,{id,bookname,author,publish,number_of_book}];
    res.json(books)
})
app.listen(port, () => console.log(`Server is running on port ${port}`))