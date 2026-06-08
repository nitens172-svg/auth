import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/',(req,res)=>{
    res.send('hello from app');
})
app.listen(process.env.PORT || 3000, ()=>{
     console.log(`Server is running on port ${process.env.PORT || 3000}`);
})