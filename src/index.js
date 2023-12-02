const express=require('express');
const app = express();
const bodyparser=require('body-parser')

const mongoose=require('mongoose')
const port=3000||process.env.PORT
// const router=express.Router()
app.use(bodyparser.json())
const router=require('./routes/router.js')
mongoose.connect(
  "mongodb+srv://Monalisamishra:MDYlL3MKtGxQa59a@cluster0.7zrfpkj.mongodb.net/monalisaMishra_db",
//  { useNewUrlParser:true}
).then(()=>{
    console.log('connected to database')
})
app.get('/',(req,res)=>{
res.send('hello world')
})

app.use("/", router);
app.listen(port,()=>{
    console.log(`app is listen in port ${port}`)
})

