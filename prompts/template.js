const systemMessage = "";
const favoriteColor = "";
const characterProfile = "";

const preContext = [
  {
    role: "System", 
    content: `${systemMessage}`
  },
  {
    role: "user", 
    content: ""
  },
  {
    role: "assistant",
    content: ""
  },
  {
    role: "user",
    content: ""
  },
  {
    role: "assistant",
    content: ""
  },
  {
    role: "user",
    content: ""
  },
  {
    role: "assistant",
    content: ""
  },
  {
    role: "user",
    content: "from now one I want the one person who is reading this to be Nueman"
  }

]

module.exports = preContext;