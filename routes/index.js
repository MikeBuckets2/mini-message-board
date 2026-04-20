const { Router } = require("express");

const router = Router();

const messages = [
  {
    id: 1,
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    id: 2,
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];

router.get("/", (req, res) => {
  res.render("index", {
    title: "Mini Messageboard",
    messages: messages,
  });
});

router.get("/new", (req, res) => {
  res.render("form", { title: "New Message" });
});

router.post("/new", (req, res) => {
  const messageText = req.body.messageText;
  const messageUser = req.body.messageUser;

  messages.push({
    id: messages.length + 1,
    text: messageText,
    user: messageUser,
    added: new Date(),
  });

  res.redirect("/");
});

router.get("/message/:id", (req, res) => {
  const message = messages.find((m) => m.id === parseInt(req.params.id));

  if (!message) {
    res.status(404).send("Message not found");
    return;
  }

  res.render("message", {
    title: "Message",
    message: message,
  });
});

module.exports = router;