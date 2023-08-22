const { userId } = require("../config/isAuthenticated.js");
const chatBuddy = require("../model/chat-buddies.js");
const chatBudId = require("../model/chatbudId.js");
const { Profile, BuddyP } = require("./chatBuddiesController.js");

const Messages = {
  list: [],
  setList: function (data) {
    this.list = data;
  },
};

const getAllChatMessages = (req, res) => {
  const fPitMsgs = Profile.userProfile.buddies.find(
    (friend) => friend.id === chatBudId.id
  );
  if (!fPitMsgs)
    return res
      .status(400)
      .json({ message: `Msg ID ${chatBudId.id} not found` });
  Messages.setList([...Messages.list, fPitMsgs.messages]);
  console.log(Messages);

  res.json(Messages.list);
};

const AddNewChatMessage = (req, res) => {
  const { id, msg, time, sender } = req.body;

  const newMessage = {
    id,
    msg,
    time,
    sender,
  };

  if (!newMessage) {
    return res.status(400).json({ message: `Msg ID ${req.body.id} not found` });
  }

  Messages.setList([...Messages.list, newMessage]);
  res.status(201).json(newMessage);
};

const updateChatMessage = (req, res) => {
  const { id, msg, time, sender } = req.body;

  if (!Messages.list.find((emp) => emp.id === id)) {
    return res.status(400).json({ message: `Msg ID ${req.body.id} not found` });
  }

  Messages.list.find((emp) => {
    if (emp.id === id) {
      emp.msg = msg;
      emp.time = time;
      emp.sender = sender;
    }
  });

  Messages.setList([...Messages.list]);
  res.json(id);
};

const deleteChatMessage = (req, res) => {
  const Msg = Messages.list.find((emp) => emp.id === parseInt(req.body.id));
  if (!Msg) {
    return res.status(400).json({ message: `Msg ID ${req.body.id} not found` });
  }
  const filteredArray = Messages.list.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );

  Messages.setList(filteredArray);
  res.json(req.body.id);
};

const getChatMessage = (req, res) => {
  const { id } = req.body;

  const msg = Messages.list.find((emp) => emp.id === id);

  if (!msg) {
    return res.status(400).json({ message: `Msg ID ${req.body.id} not found` });
  }

  res.status(201).json(msg);
};

module.exports = {
  getAllChatMessages,
  AddNewChatMessage,
  updateChatMessage,
  deleteChatMessage,
  getChatMessage,
};
