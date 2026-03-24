import express from "express";
import pool from "./db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, "127.0.0.1", function() {
  console.log("Server is running! Access it at http://127.0.0.1:3000");
});

app.post("/api/users", async function(req, res) {
  try {
    const [result] = await pool.query("INSERT INTO users SET ?", [req.body]);
    const [newUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(newUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all users
app.get("/api/users", async function(req, res) {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single user by ID
app.get("/api/users/:id", async function(req, res) {
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a user by ID
app.put("/api/users/:id", async function(req, res) {
  try {
    const [result] = await pool.query("UPDATE users SET ? WHERE id = ?", [
      req.body,
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    const [updatedUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a user by ID (This will automatically delete their posts due to ON DELETE CASCADE)
app.delete("/api/users/:id", async function(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "User and their posts deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a post (req.body now only needs 'body')
app.post("/api/posts", async function(req, res) {
  try {
    const [result] = await pool.query("INSERT INTO posts SET ?", [req.body]);
    const [newPost] = await pool.query("SELECT * FROM posts WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(newPost[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all posts
app.get("/api/posts", async function(req, res) {
  try {
    const [posts] = await pool.query("SELECT * FROM posts");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single post by ID
app.get("/api/posts/:id", async function(req, res) {
  try {
    const [posts] = await pool.query("SELECT * FROM posts WHERE id = ?", [
      req.params.id,
    ]);

    if (posts.length === 0)
      return res.status(404).json({ message: "Post not found" });

    res.status(200).json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a post by ID
app.put("/api/posts/:id", async function(req, res) {
  try {
    const [result] = await pool.query("UPDATE posts SET ? WHERE id = ?", [
      req.body,
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Post not found" });

    const [updatedPost] = await pool.query("SELECT * FROM posts WHERE id = ?", [
      req.params.id,
    ]);
    res.status(200).json(updatedPost[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a post by ID
app.delete("/api/posts/:id", async function(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/", function(req, res) {
  res.send("API is running!");
});
