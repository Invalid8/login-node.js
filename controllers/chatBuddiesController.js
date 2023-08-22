const { userId } = require("../config/isAuthenticated.js");
const chatBuddy = require("../model/chat-buddies.js");
const chatBudId = require("../model/chatbudId.js");
const fs = require("fs");

const Profile = {
  userProfile: {},
  setProfile: function (data) {
    this.userProfile = data;
  },
};

const BuddyP = {
  BuddyProfile: {},
  setBuddyP: function (data) {
    this.BuddyProfile = data;
  },
};

const getAllChatBuddies = (req, res) => {
  Profile.userProfile = chatBuddy.buddies.find(
    (value) => value.id === userId.id
  );
  const Buddies = [];
  Profile.userProfile.buddies.map((buddy) => {
    const fProfile = chatBuddy.buddies.find((friend) => friend.id === buddy.id);
    const oProfile = {
      id: buddy.id,
      username: fProfile.username,
      email: fProfile.email,
      profilePic: fProfile.profilePic,
      active: fProfile.active,
      notification: buddy.notification,
      blocked: buddy.blocked,
      newMessage: buddy.messages
        ? buddy.messages[buddy.messages.length - 1]
        : { msg: "Send A message", time: new Date().toUTCString() },
    };

    Buddies.push(oProfile);
  });
  res.json(Buddies);
};

const AddNewchatBuddy = (req, res) => {
  const { id } = req.body;

  const newBuddy = {
    id,
    notification: true,
    blocked: false,
    messages: [],
  };

  Profile.setProfile.buddies([...Profile.userProfile.buddies, newBuddy]);
  res.status(201).json(newBuddy);
};

const updatechatBuddy = (req, res) => {
  const Buddy = chatBuddy.buddies.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!Buddy) {
    return res
      .status(400)
      .json({ message: `Buddy ID ${req.body.id} not found` });
  }
  if (req.body.msg) Buddy.msg = req.body.msg;

  const filteredArray = chatBuddy.buddies.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  const unsortedArray = [...filteredArray, Buddy];
  chatBuddy.setBuddies(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  res.json(chatBuddy.buddies);
};

const deletechatBuddy = (req, res) => {
  const Buddy = chatBuddy.buddies.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!Buddy) {
    return res
      .status(400)
      .json({ message: `Chat ID ${req.body.id} not found` });
  }
  const filteredArray = chatBuddy.buddies.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  chatBuddy.setBuddies([...filteredArray]);
  res.json(chatBuddy.buddies);
};

const getchatBuddy = (req, res) => {
  BuddyP.setBuddyP(chatBuddy.buddies.find((bud) => bud.id === chatBudId.id));

  const Buddy = Profile.userProfile.buddies.find(
    (emp) => emp.id === chatBudId.id
  );

  if (!Buddy) {
    return res
      .status(400)
      .json({ message: `Chat ID ${chatBudId.id} not found` });
  }

  const fProfile = chatBuddy.buddies.find(
    (friend) => friend.id === chatBudId.id
  );

  const oProfile = {
    id: Buddy.id,
    username: fProfile.username,
    email: fProfile.email,
    profilePic: fProfile.profilePic,
    active: fProfile.active,
    notification: Buddy.notification,
    blocked: Buddy.blocked,
    messages: Buddy.messages,
  };

  res.json(oProfile);
};

const updatechatBuddyMessge = (req, res) => {
  const { id, msg, time, sender } = req.body;

  BuddyP.setBuddyP(chatBuddy.buddies.find((bud) => bud.id === chatBudId.id));

  const Buddy = BuddyP.BuddyProfile.buddies.find((emp) => emp.id === userId.id);

  if (!Buddy) {
    return res
      .status(400)
      .json({ message: `Chat ID ${chatBudId.id} not found` });
  }

  Buddy.messages.push({
    id,
    msg,
    time,
    sender,
  });
};

module.exports = {
  getAllChatBuddies,
  AddNewchatBuddy,
  updatechatBuddy,
  deletechatBuddy,
  getchatBuddy,
  updatechatBuddyMessge,
  Profile,
  BuddyP,
};
