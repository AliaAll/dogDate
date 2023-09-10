const sqlite3 = require("sqlite3");
const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
const http = require("http");

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const uploadForm = multer();
const HTTP_PORT = 8000;
server.listen(HTTP_PORT, () => {
  console.log("Server is listening on port " + HTTP_PORT);
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("locationUpdate", (location) => {
    io.emit("locationUpdate", location);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

function getAllPromise(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        // case error
        reject(err);
      }

      // "return" the result when the action finish
      resolve(rows);
    });
  });
}

const saltPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comaprePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const db = new sqlite3.Database("C:/sqlite/dogdate.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the dogdate database.");
});

app.post("/register", async (req, res) => {
  const reqBody = req.body;
  const hashedPassword = await saltPassword(reqBody.password);
  const userId = crypto.randomUUID();

  db.run(
    "INSERT INTO owner(id, firstName, lastName, email, password) VALUES (?,?,?,?,?)",
    [
      userId,
      reqBody.firstName,
      reqBody.lastName,
      reqBody.email,
      hashedPassword,
    ],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({ uuid: userId });
    }
  );
});
app.post("/dogProfile", upload.single("image"), async (req, res) => {
  const reqBody = req.body;
  const dogProfileId = crypto.randomUUID();
  const traits = req.body.traits.split(",");
  db.serialize(() => {
    db.get(
      "INSERT INTO dogProfile(id, name, breed, gender, age, avatar,owner_id, image_url)VALUES (?,?,?,?,?,?,?,?)",
      [
        dogProfileId,
        reqBody.name,
        reqBody.breed,
        reqBody.gender,
        reqBody.age,
        reqBody.avatar,
        reqBody.owner_id,
        req.file.filename,
      ],
      (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        } else {
          traits.forEach((trait) => {
            db.get(
              "INSERT INTO profileTraitRelation (dogProfile_id, trait) VALUES (?,?)",
              [dogProfileId, trait],
              () => {
                if (err) {
                  res.status(400).json({ error: err.message });
                  return;
                }
              }
            );
            db.run(
              "INSERT INTO ownerProfileRelation (owner_id, dogProfile_id) VALUES (?,?)",
              [reqBody.owner_id, dogProfileId],
              (err, result) => {
                if (err) {
                  res.status(400).json({ error: err.message });
                  return;
                }
                res.status(201).json({});
              }
            );
          });
          res.status(201).json({});
        }
      }
    );
  });
});

app.get("/dogProfile", async (req, res) => {
  const queryParam = req.query.id;
  console.log(queryParam);
  db.serialize(() => {
    db.get(
      `SELECT * FROM dogProfile WHERE id = ?`,
      [queryParam],
      (err, dogProfileRow) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        } else {
          db.all(
            "SELECT trait from profileTraitRelation WHERE dogProfile_id = ?",
            [dogProfileRow.id],
            (err, traitRows) => {
              if (err) {
                res.status(400).json({ error: err.message });
                return;
              } else {
                const traits = [];
                traitRows.forEach((traitRow) => {
                  traits.push(traitRow.trait);
                });
                db.all(
                  "SELECT id, sender_id from friendRequest where recipent_id = ? AND status = 'sent'",
                  [queryParam],
                  async (err, requestRows) => {
                    if (err) {
                      res.status(400).json({ error: err.message });
                      return;
                    } else {
                      const friendRequests = [];
                      requestRows.forEach((requestRow) => {
                        friendRequests.push(requestRow);
                      });

                      db.all(
                        "select * from dogProfile INNER JOIN friendship on dogProfile.id = friendship.friendDogProfile_id where friendship.dogProfile_id = ?",
                        queryParam,
                        (err, friendRows) => {
                          if (err) {
                            res.status(400).json({ error: err.message });
                            return;
                          } else {
                            const friends = [];
                            friendRows.forEach((friendRow) => {
                              friends.push(friendRow);
                            });
                            res.status(200).json({
                              ...dogProfileRow,
                              traits: traits,
                              friendRequests: friendRequests,
                              friends: friends,
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
});

app.post("/events", async (req, res) => {
  const reqBody = req.body;
  db.get(
    "INSERT INTO events(id, location, date, activity, description,owner_id, lat, lon)VALUES (?,?,?,?,?,?,?,?)",
    [
      crypto.randomUUID(),
      reqBody.location.name,
      reqBody.date,
      reqBody.activity,
      reqBody.description,
      reqBody.owner_id,
      reqBody.location.location[1],
      reqBody.location.location[0],
    ],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({});
    }
  );
});
app.get("/events", async (req, res) => {
  db.all("SELECT * from events", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ rows });
  });
});

app.post("/eventParticipation", async (req, res) => {
  const reqBody = req.body;
  db.get(
    `INSERT INTO  eventParticipation (event_id, dogProfile_id) VALUES (?,?)`,
    [reqBody.eventId, reqBody.dogProfileId],
    async (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
      }
      res.status(201).json({});
    }
  );
});

const go = async (rows) => {
  let events = [];
  for (const eventRow in rows) {
    await getAllPromise("SELECT * from events where id = ?", [
      rows[eventRow].event_id,
    ]).then((data) => {
      events = [...events, data[0]];
    });
  }
  return events;
};

app.get("/eventParticipation", async (req, res) => {
  const queryParam = req.query.dogProfileId;
  db.serialize(() => {
    db.all(
      "SELECT event_id from eventParticipation WHERE dogProfile_id = ?",
      [queryParam],
      async (err, rows) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        } else {
          const events = await go(rows);
          console.log(events);
          res.status(200).json({ events });
        }
        return;
      }
    );
  });
});
app.post("/login", async (req, res) => {
  const reqBody = req.body;
  db.serialize(() => {
    db.get(
      `SELECT id, password from owner WHERE email = ?`,
      reqBody.email,
      async (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
        }

        if (row !== undefined) {
          const isCorrectPassword = await comaprePassword(
            reqBody.password,
            row.password
          );
          if (isCorrectPassword) {
            //make query for dog profile id
            db.get(
              "SELECT * from ownerProfileRelation where owner_id = ?",
              [row.id],
              (err, dogRow) => {
                console.log(dogRow);
                res
                  .status(200)
                  .json({ uuid: row.id, dogProfile_id: dogRow.dogProfile_id });
              }
            );
          } else {
            res.status(400).json({ error: "Invalid password" });
          }
        } else {
          res.status(404).json({ error: "User not found" });
        }
      }
    );
  });
});


app.post("/friendRequest", async (req, res) => {
  const reqBody = req.body;
  if (reqBody.sender_id && reqBody.recipent_id) {
    const friendRequestId = crypto.randomUUID();
    db.run(
      "INSERT INTO friendRequest (id, sender_id, recipent_id, status) VALUES (?, ?, ?, ?)",
      [friendRequestId, reqBody.sender_id, reqBody.recipent_id, reqBody.status],
      async (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
        }
        res.status(201).json({});
      }
    );
  }
  if (reqBody.id) {
    db.run(
      "UPDATE friendRequest SET status = ? WHERE id = ?",
      [reqBody.status, reqBody.id],
      async (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
        }
        res.status(201).json({});
      }
    );
  }
});

app.post("/friends", async (req, res) => {
  const reqBody = req.body;
  db.serialize(() => {
    db.run(
      "INSERT into friendship (dogProfile_id, friendDogProfile_id) VALUES (?, ?)",
      [reqBody.id, reqBody.friendId],
      async (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
        }
        db.run(
          "INSERT into friendship (dogProfile_id, friendDogProfile_id) VALUES (?, ?)",
          [reqBody.friendId, reqBody.id],
          async (err, result) => {
            if (err) {
              res.status(400).json({ error: err.message });
            }
            res.status(201);
          }
        );
      }
    );
  });
});

app.get("/friendRequest", async (req, res) => {
  const sender = req.query.sender_id;
  const recipent = req.query.recipent_id;
  db.get(
    "SELECT status from friendRequest WHERE sender_id = ? AND recipent_id = ?",
    [sender, recipent],
    async (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      res.status(200).json(row);
    }
  );
});

app.get("/images", (req, res) => {
  db.all("SELECT * FROM images", (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch images from database" });
    }

    const imageUrls = rows.map((row) => ({
      id: row.id,
      url: row.filepath, // Change this URL accordingly
    }));

    return res.json({ imageUrls });
  });
});

app.post("/debug", upload.single("image"), (req, res) => {
  console.log(req.file); // Check the uploaded file details in the server console
  return res.send("Debug route: Form data received successfully");
});


app.post("/upload", upload.single("image"), (req, res) => {
  const imagePath = "uploads/" + req.file.filename;

  db.run("INSERT INTO images (filepath) VALUES (?)", [imagePath], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to store image in database" });
    }

    return res.status(201).json({ message: "Image uploaded and stored successfully" });
  });
});