const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const tokenKey = "modelschool"

app.use(express.json());


mongoose.connect('mongodb+srv://Geeksdoor:Geeksdoor@cluster0.8f2it.mongodb.net/BalanceSheet?retryWrites=true&w=majority')
    .then(() =>
    {
        console.log("database connection success")
    }).catch((err) =>
    {
        console.log(err)
    })

app.use(cors())

// user signup schema

const User = require('./schema/UserSchema')

//  sheet data schema

const Rowdata = require('./schema/SheetDataSchema')

// handling api requests here

app.get('/', async (req, res) =>
{
    let user = null
    const token = req.query.token
    console.log(token, 'token avilable or not')

    try
    {
        var uniqueID = jwt.verify(token, tokenKey)
        console.log(uniqueID.id, 'user verified ID')
        uniqueID = await User.findOne({ uniqueID: uniqueID.id })
        console.log(uniqueID, 'user is')
        const row = await Rowdata.find({ uniqueID: uniqueID.id })
        console.log(row)
        res.send(row)
    } catch (err)
    {
        res.send(err)
        console.log('token verification failed')
        console.log(err)
    }
})

// handling user signup here

app.post('/signup', async (req, res) =>
{
    const { firstName, lastName, email, password, uniqueID } = req.body
    const user = await new User({ firstName, lastName, email, password, uniqueID })
    await user.save()
    res.send({ firstName, lastName, email, password, uniqueID })
})


// handling user login here

app.post('/login', async function (req, res)
{
    const { email, password } = req.body
    let user = null
    try
    {
        user = await User.findOne({ email, password })
        console.log(user, "login time")
    } catch (err)
    {
        res.send('login failed')
        console.log('login failed')
    }

    if (user != null)
    {
        console.log({ uniqueID: user.uniqueID }, 'user ID he ye')
        var token = jwt.sign({ id: user.uniqueID }, tokenKey);

        res.send({ status: "OK", msg: "Login Successfully", token })
        console.log('user login success')
    } else
    {
        res.send({ status: "ERR", msg: "Invalid mobile or password" })
        console.log('user login failed');
    }
})


// handling save data in table 

app.post('/saveSheetData', async (req, res) =>
{
    let { description, type, amount, token } = req.body
    try
    {
        var uniqueID = jwt.verify(token, tokenKey)
        const rowdata = await new Rowdata({ description, type, amount, uniqueID: uniqueID.id })
        console.log(uniqueID.id)

        await rowdata.save()
        const row = await Rowdata.find({ uniqueID: uniqueID.id })
        console.log('token find success')
        res.send(row)
    } catch (err)
    {
        console.log('token verifing failed on saving table data ', err)
    }


})


// handling delete data in table 

app.post('/delete', async (req, res) =>
{
    const { id } = req.body
    console.log(id);
    await Rowdata.deleteOne({ _id: id })
    const row = await Rowdata.find()
    res.send(row)
})

const port = 8080
app.listen(port, () =>
{
    console.log(`server is running on port no. ${ port }`)
})