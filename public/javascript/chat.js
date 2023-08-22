const messages = document.getElementById("messages");
const msgBox = document.querySelector(".msg-box");
const chatForm = document.getElementById("cForm");
const input = document.getElementById("inputMsg");
const scroller = document.querySelector(".scroller")

let userProf = JSON.parse(document.querySelector(".hidden").dataset.info);

window.addEventListener("DOMContentLoaded", () => {
	getChatHistory("/chat-history");
});

new window.EventSource("/sse").onmessage = function (event) {
	let msgTag;
	if (msgTag) {
		return;
	}

	const pData = JSON.parse(event.data);

	msgTag = document.createElement("div");
	msgTag.classList.add("msg");

	const mAttr = document.createAttribute("data-user");
	mAttr.value = pData.username;

	if (pData.sender.id === userProf.id) {
		msgTag.classList.add("user-msg");
	}

	msgTag.setAttributeNode(mAttr);
	msgTag.innerHTML = `
        <h5>${pData.username}</h5>
        <div class="m-s">
            <span>
                ${pData.msg}
            </span>
            <h6 id="time">${pData.time}</h6>
        </div>
    `;

	messages.appendChild(msgTag);
	scrollDown();
};

chatForm.addEventListener("submit", function (evt) {
	evt.preventDefault();
	if (input.value) {
		const date = new Date();

		const hours = date.getHours();
		const min = date.getMinutes();

		const min_c = min < 9 ? `0${min}` : min;
		const meridian = hours > 12 ? "PM" : "AM";
		const hours_c = hours > 12 ? hours - 12 : hours;

		const data = {
			id: Date.now().toString(),
			msg: input.value,
			username: userProf.username,
			time: `${hours_c}:${min_c}${meridian}`,
			sender: {
				id: userProf.id,
			},
		};

		window.fetch(`/chatReply?message=${JSON.stringify(data)}`);

		scrollDown();
		input.value = "";
	}
});

let errorType;

function getChatHistory(url) {
	fetch(url)
		.then((res) => {
			if (!res.ok) {
				throw Error("could not fetch chat history from resourse");
			}
			return res.json();
		})
		.then((data) => {
			return data.map((chat) => {
				const nMsg = `<div class="msg ${returnThis(
					"user-msg",
					chat
				)}" data-user="${chat.username}">
                            <h5>${chat.username}</h5>
                            <div class="m-s">
                                <span>
                                    ${chat.msg}
                                </span>
                                <h6 id="time">${chat.time}</h6>
                            </div>
                        </div>`;
				messages.innerHTML += nMsg;
				scrollDown();
			});
		})
		.catch((error) => {
			return console.error(error);
		});
}

function returnThis(word, list) {
	if (list.username === userProf.username) {
		return word;
	} else {
		return "";
	}
}

function scrollDown() {
	scroller.scrollTo({
		top: messages.scrollHeight + 50,
		left: 0,
	});
}

// let fname = "Pola";

// fname.toLowerCase()
