if(process.env.NODE_ENV === 'production'){
    module.exports={
        mongoURI : 'mongodb+srv://PavanKumar:Pavan@123@blogposts-prod.uvl3c.mongodb.net/<dbname>?retryWrites=true&w=majority'
    }
} else {
    module.exports ={mongoURI : 'mongodb://localhost/blogs'}
}