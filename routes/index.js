const { Router } = require("express");
const {
  getAllMessages,
  getMessageById,
  createMessage,
} = require("../db/queries");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.render("index", {
      title: "Mini Messageboard",
      messages: messages,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send("Something went wrong loading messages.");
  }
});

router.get("/new", (req, res) => {
  res.render("form", {
    title: "New Message",
    errors: [],
    formData: {},
  });
});

router.post("/new", async (req, res) => {
  const messageText = req.body.messageText ? req.body.messageText.trim() : "";
  const messageUser = req.body.messageUser ? req.body.messageUser.trim() : "";

  const errors = [];

  if (!messageUser) {
    errors.push("Name is required.");
  } else if (messageUser.length > 100) {
    errors.push("Name must be 100 characters or less.");
  }

  if (!messageText) {
    errors.push("Message is required.");
  } else if (messageText.length > 1000) {
    errors.push("Message must be 1000 characters or less.");
  }

  if (errors.length > 0) {
    return res.status(400).render("form", {
      title: "New Message",
      errors: errors,
      formData: { messageUser, messageText },
    });
  }

  try {
    await createMessage(messageText, messageUser);
    res.redirect("/");
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).send("Something went wrong posting your message.");
  }
});

router.get("/message/:id", async (req, res) => {
  try {
    const message = await getMessageById(req.params.id);

    if (!message) {
      return res.status(404).send("Message not found.");
    }

    res.render("message", {
      title: "Message",
      message: message,
    });
  } catch (err) {
    console.error("Error fetching message:", err);
    res.status(500).send("Something went wrong loading that message.");
  }
});

module.exports = router;