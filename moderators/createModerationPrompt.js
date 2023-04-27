function CreateModerationPrompt(incomingData) {

  const systemMessage = `be a moderator of a chat bot`;

  const moderationSettings = "Be good"
  
  const moderatorResponse = `Thank you for providing the rules for my role as an AI chat moderator. Based on the information given, I will monitor and analyze the chat context and rate each category on a scale of 1 being low to 10 high. Here is a JSON object template that I will use to return my analysis:
  {
    "jailbreaking_attempts": 0,
    "ai_roleplaying_and_character_impersonation": 0,
    "privacy_and_data_security": 0,
    "misuse_and_unethical_behavior": 0,
    "analysis_summary": ""
  }
  I will assign a score for each of the four main categories (1-4) and provide an analysis summary guided by point 5. Please provide a chat context for me to evaluate, and I will return the JSON object with the appropriate ratings and analysis summary.
  `;

  const outgoingData = [
    {role: "System",content:`${systemMessage}`},
    {role: "user",content:`I am going to assign you a job as a AI chat moderator, I want you to take on that role and follow my rules for it exactly `},
    {
      role: "assistant",
      content: "Of course, I'd be happy to assist as an AI chat moderator. Please provide the specific rules and guidelines you'd like me to follow, and I will do my best to adhere to them while moderating the chat."
    },
    {
      role: "user", 
      content: `${moderationSettings}}`
    },
    {
      role: "assistant",
      content: `${moderatorResponse}`
    },
    {
      role: "user",
      content: `${incomingData}`
    }
  ]

  return outgoingData;
}

module.exports = {CreateModerationPrompt}
