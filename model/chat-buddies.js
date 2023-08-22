const fs = require("fs")

const chatBuddy = {
    buddies: JSON.parse(fs.readFileSync("./model/chat-buddy.json", "utf-8")),
    setBuddies: function (data) {
        try {
            fs.writeFileSync("./model/chat-buddy.json", JSON.stringify(data, null, 2), 'utf-8');
            console.log("Data successfully");
        } catch (err) {
            console.log("An errror ouccured", err);
        }
    },
};


module.exports = chatBuddy
