import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";// This module lets us use HTTP methods like PUT and DELETE in places where we usually can't.

const app = express();
const port = 3000;

app.set("view engine", "ejs"); //This tells our app to use EJS as the templating language to generate HTML.. EJS is a simple templating language that lets you generate HTML with plain JavaScript.

app.use(express.static("public")); //This middleware serves static files (like CSS, JavaScript, and images) from the "public" directory.

app.use(bodyParser.urlencoded({ extended: true })); //This middleware parses URL-encoded data (from form submissions) and makes it available in req.body. The extended: true option allows for rich objects and arrays to be encoded into the URL-encoded format.

app.use(methodOverride("_method")); //This middleware allows you to use HTTP verbs such as PUT and DELETE in places where the client doesn't support it. By using _method as a query parameter or in the form body, you can override the method.

let posts = []; //This array will store the blog posts. Each post is an object with id, title, and content.

// Routes
app.get("/", (req, res) => {
  res.render("index", { posts });
});
//This route renders the home page (index.ejs), passing the posts array to the view.: When someone visits the homepage, we render the index.ejs template and pass the posts array to it.

app.get("/posts/new", (req, res) => {
  res.render("create");
});
//This route renders a form (create.ejs) to create a new post.: When someone visits /posts/new, we show them a form to create a new post using the create.ejs template.

app.post("/posts", (req, res) => {
  const { title, content } = req.body;//We get the title and content from the form data.
  const id = posts.length ? posts[posts.length - 1].id + 1 : 1;//We create a new id for the post.

  posts.push({ id, title, content });//We add the new post to the `posts
  res.redirect("/");
  
});
//This route handles form submission for creating a new post. It extracts title and content from the request body, assigns an id, adds the post to the posts array, and redirects to the home page.

app.get("/posts/:id", (req, res) => {
  const post = posts.find((post) => post.id == req.params.id);
  res.render("post", { post });
});
//This route renders a single post (post.ejs), found by id.

app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find((post) => post.id == req.params.id);
  res.render("edit", { post });
});
//This route renders a form (edit.ejs) to edit an existing post.

app.put("/posts/:id", (req, res) => {
  const { title, content } = req.body;
  const post = posts.find((post) => post.id == req.params.id);
  post.title = title;
  post.content = content;
  res.redirect(`/posts/${post.id}`);
  //res.send(post.title, post.content );
});
//This route handles form submission for updating a post. It finds the post by id, updates the title and content, and redirects to the updated post's page.

app.delete("/posts/:id", (req, res) => {
  posts = posts.filter((post) => post.id != req.params.id);
  res.redirect("/");
});
//This route deletes a post by id and redirects to the home page.

app.listen(port, () => {
  console.log(`Blog app listening at http://localhost:${port}`);
});
