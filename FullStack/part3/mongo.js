const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url = `mongodb+srv://chhimi101_db_user:${password}@fullstack.mwrxavt.mongodb.net/?appName=FullStack`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })


const phoneSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Entry = mongoose.model('PhoneNumber', phoneSchema)
if (process.argv.length == 3){
 Entry.find({}).then(result =>{
    console.log(result)
    mongoose.connection.close()
 })
 
}

if (process.argv.length == 5 )
{

const entry = new Entry({
    name: name,
    phone: phone
})

entry.save().then(
    result => {
    console.log(`added ${name} number ${phone} to phonebook`)
    mongoose.connection.close()
    }
)
}
