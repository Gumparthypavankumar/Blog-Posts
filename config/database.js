if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://PavanKumar:oqZ36k2428uDpitr@blogposts-prod.650gh.mongodb.net/blogposts?retryWrites=true&w=majority",
  };
} else {
  module.exports = {
    mongoURI:
      "mongodb+srv://PavanKumar:oqZ36k2428uDpitr@blogposts-prod.650gh.mongodb.net/blogposts?retryWrites=true&w=majority",
  };
}
