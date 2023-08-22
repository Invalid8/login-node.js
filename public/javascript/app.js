let messages;
let chatBuddies;
const cBuddyId = {
  id: 0,
  setId: function (data) {
    this.id = data;
  },
};

let userProf = JSON.parse(document.querySelector("#house").dataset.info);
console.log(userProf);
const showBuddiesBtn = document.querySelector("#showBuddiesBtn");
const scroller = document.querySelector(".scroller");
const scrollDownBtn = document.querySelector("#scrollDown");
const archivedChatBtn = document.querySelector("#archivedChatBtn");
const archivedContainer = document.querySelector("#archivedContainer");
const searchContainer = document.querySelector("#searchContainer");

const section1 = document.querySelector("#section1");
const section2 = document.querySelector("#section2");
const buddiesContainer = section1.querySelector("#buddiesContainer");
const messagesContainer = section2.querySelector("#chatMessages");
const buddyInfoContainer = section2.querySelector("#buddyProfile");

window.addEventListener("DOMContentLoaded", () => {
  getChatBuddies("/chatBuddies");
  seeChat();
});

function addBuddies(array) {
  // bud element

  array.map((buddy) => {
    const element = document.createElement("div");
    element.classList.add(
      "chatPreviewModal",
      "u-flex",
      "ali-items-cent",
      "make-btn"
    );
    element.id = buddy.id;
    element.innerHTML = budCard(buddy);

    element.addEventListener("click", () => {
      section1.classList.toggle("showBuddies");
      if (element.id && cBuddyId.id !== element.id) {
        buddiesContainer
          .querySelectorAll(".chatPreviewModal")
          .forEach((buddy) => {
            buddy.classList.remove("seletedBuddy");
          });
        element.classList.add("seletedBuddy");
        reset();
        postData("/getBuddyId", { id: element.id });
        cBuddyId.setId(element.id);
        new window.EventSource(`/chatBuddies/${element.id}/sse`).onmessage =
          function (event) {
            const pData = JSON.parse(event.data);
            postData(`/chatMessages/${element.id}`, pData);
            const elementi = document.createElement("div");
            elementi.classList.add(
              "message",
              `${
                parseInt(pData.sender.id) === parseInt(userProf.id)
                  ? "end"
                  : "start"
              }`
            );
            elementi.innerHTML = msgModal(pData);
            messagesContainer.appendChild(elementi);
            scrollDown();
          };
        getChatMessages(`/chatMessages/${element.id}`);
      }
    });
    return buddiesContainer.appendChild(element);
  });
}

function seeChat() {
  showBuddiesBtn.addEventListener("click", () => {
    section1.classList.toggle("showBuddies");
  });

  archivedChatBtn.addEventListener("click", () => {
    archivedContainer.classList.remove("hideSideModal");
    archivedContainer.querySelector("#back").addEventListener("click", () => {
      archivedContainer.classList.add("hideSideModal");
    });
  });

  section1.querySelector("#searchThrough").addEventListener("input", () => {
    section1.querySelector("#searchThrough").value
      ? searchContainer.classList.remove("hideSideModal")
      : searchContainer.classList.add("hideSideModal");
  });
}

function injectmessages(Messages) {
  const chatForm = document.getElementById("cForm");
  const input = document.getElementById("inputMsg");

  // buddyInfoContainer.innerHTML = buddyProfileModal(Buddy)

  Messages[0].map((value) => {
    const element = document.createElement("div");
    element.classList.add(
      "message",
      `${parseInt(value.sender.id) === parseInt(userProf.id) ? "end" : "start"}`
    );
    element.innerHTML = msgModal(value);
    messagesContainer.appendChild(element);
    return scrollDown();
  });

  messagesContainer.addEventListener("scroll", () => {
    messagesContainer.scrollTop + window.innerHeight <=
    messagesContainer.scrollHeight
      ? scrollDownBtn.classList.remove("hidden")
      : scrollDownBtn.classList.add("hidden");
  });

  scrollDownBtn.addEventListener("click", () => {
    scrollDown();
  });

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
        time: `${hours_c}:${min_c}${meridian}`,
        sender: {
          id: parseInt(userProf.id),
        },
      };
      window.fetch(
        `/chatBuddies/${cBuddyId.id}/chatReply?message=${JSON.stringify(data)}`
      );

      scrollDown();
      input.value = "";
    }
  });
}

function reset() {
  messagesContainer.innerHTML = "";
}

function getChatBuddies(url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw Error("could not fetch chat history from resourse");
      }
      return res.json();
    })
    .then((data) => {
      addBuddies(data);
      return data;
    })
    .catch((error) => {
      return console.error(error);
    });
}

function getChatMessages(url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw Error("could not fetch chat history from resourse");
      }
      return res.json();
    })
    .then((data) => {
      injectmessages(data);
      return data;
    })
    .catch((error) => {
      return console.error(error);
    });
}

function postData(url, sData) {
  fetch(url, {
    method: "POST",
    body: JSON.stringify(sData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}

function scrollDown() {
  scroller.scrollTo({
    top: scroller.scrollHeight + 50,
    left: 0,
  });
}

function returnThis(word, list) {
  if (list.username === userProf.username) {
    return word;
  } else {
    return "";
  }
}

function buddyProfileModal(value) {
  return `
            <div class="div1 prev-img-box">
                <img src="${value.profilePic}" alt="..." />
            </div>
            <div class="div2">
                <h4 class="username">${value.username}</h4>
                <h5 class="${
                  value.active.isTrue ? "active" : "not-active"
                } thin-w400">${
    value.active.isTrue ? "Active" : value.active.lastActive
  }</h5>
            </div>
        `;
}

function msgModal(value) {
  return `
            <div class="msgBox ${
              parseInt(value.sender.id) === parseInt(userProf.id)
                ? "userMsg"
                : "buddyMsg"
            }">
                <p class="msg">
                    ${value.msg}
                </p>
                <div class="timeBox">
                    <h5 class="time">${value.time}</h5>
                </div>
            </div>
        `;
}

function budCard(value) {
  return `
            <div class="div1 prev-img-box">
                <img src=${value.profilePic} alt="..." />
            </div>
            <div class="div2">
                <div
                    class="header spread u-flex space-bet ali-items-cent"
                >
                    <h4 class="username">${value.username}</h4>
                    <div class="time">${
                      value.newMessage ? value.newMessage.time : ""
                    }</div>
                </div>
                <div class="presentMsg">
                    <p>${
                      value.newMessage
                        ? value.newMessage.msg.substring(0, 20)
                        : "Send a message"
                    }. . .</p>
                </div>
            </div>
        `;
}

function inputModal() {}
