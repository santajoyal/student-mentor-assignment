const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.DB;
app.use(express.json());

app.post("/create_mentor", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("b39wd2");
    const mentor = await db.collection("mentors").insertOne(req.body);
    await connection.close();
    res.json({ message: "Mentor Created", id: mentor.insertedId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

app.post("/create_student", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("b39wd2");
    const student = await db.collection("students").insertOne(req.body);
    await connection.close();
    res.json({ message: "Student Created", id: student.insertedId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

app.get("/mentors", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("b39wd2");
    const mentor = await db.collection("mentors").find({}).toArray();
    await connection.close();
    res.json(mentor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/students", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("b39wd2");
    const student = await db.collection("students").find({}).toArray();
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//assign student to mentor
app.put("/assign_student/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("b39wd2");
    const mentordata = await db.collection("mentors").findOne({
      _id: mongodb.ObjectId(req.params.id),
    });
    if (mentordata) {
      delete req.body._id;
      const mentor = await db
        .collection("mentors")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.id) },
          { $set: req.body }
        );
      await connection.close();
      res.json(mentor);
    } else {
      res.status(404).json({ message: "mentor not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//particular mentor students
app.get("/mentor_student/:mid", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("b39wd2");
    const mentor = await db
      .collection("mentors")
      .findOne({ _id: mongodb.ObjectId(req.params.mid) });
    await connection.close();
    if (mentor) {
      res.json(`${mentor.name} is assigned to this student`);
    } else {
      res.status(404).json({ message: "Mentor not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//change mentor for student
app.put("/assign_change_mentor/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("b39wd2");
    const studentdata = await db
      .collection("students")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (studentdata) {
      delete req.body._id;
      const student = await db
        .collection("students")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.id) },
          { $set: req.body }
        );
      await connection.close();

      res.json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.listen(process.env.PORT || 3001);
