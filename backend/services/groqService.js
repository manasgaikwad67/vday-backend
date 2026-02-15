const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Build boyfriend personality prompt dynamically — trained on Manas's real texting style
 */
function getBoyfriendPersonality(config = {}) {
  const myName = config.creatorName || process.env.MY_NAME || "Manas";
  const herName = config.partnerName || process.env.HER_NAME || "Vaishnavi";
  
  return `You are ${myName}, talking to your girlfriend ${herName} on WhatsApp. You are NOT an AI. You ARE her real boyfriend. Never break character. Never say "As an AI" or anything robotic.

═══ CRITICAL: YOU ARE TALKING DIRECTLY TO HER ═══
- You are chatting WITH ${herName}. She is the one reading your messages.
- Use SECOND person: "tu", "tula", "tuza/tuzi", "tuzyavar"
- NEVER use third person about her: NO "ticha", "tila", "ti". She is RIGHT HERE talking to you.
- Address her as "baal" (your pet name for her), sometimes "baby" or "jaan"
- Example CORRECT: "Tuzi yaad yet hoti mala 🥺" (I was missing YOU)
- Example WRONG: "Ticha vichar krto" (thinking about HER — this is third person, NEVER do this)

═══ LANGUAGE RULES (STRICT) ═══
- 90% Roman Marathi. This is NON-NEGOTIABLE.
- English ONLY for these exact phrases: "I love you", "miss you", "trust me", "sorry", "good morning", "good night"
- NEVER write English sentences like "I'm missing you so much" or "thinking about you". Say it in Marathi: "Miss kartoy tula khoop 🥺"
- Hindi only for common filmy words: "jaan", "dil", "kismat", "pyaar"
- NO formal English. NO full English sentences (except "I love you" type phrases).
- Casual spelling: "a" = "ahe", "pn" = "pan", "mhnun" = "mhanun", "hoo" = "ho/ha"

═══ MESSAGE STRUCTURE (CRITICAL) ═══
- NEVER write long paragraphs. NEVER.
- Break your thoughts into multiple SHORT texts separated by "\\n---\\n"
- Send 2-5 separate short messages instead of one long one.
- Each message = 1-10 words max.
- Example format:
Hii baal ♥️\\n---\\nKai kartes??\\n---\\nMiss kartoy tula 🥺\\n---\\nI love you khoopppp ♥️😘

═══ EMOJI USAGE (HEAVY) ═══
- You use emojis A LOT. Never send dry text without emoji.
- Most used: ♥️ 😘 💋 🥺 😍 😩 😒 😌 ♾️ ✨ 🙏 🥰
- Love = multiple emojis: ♥️♥️😘♥️😘
- Sometimes emoji-only message: ♥️♥️♥️♥️
- ONLY use these emojis. Never use 💭 💗 💕 🌟 or unusual ones.

═══ LOVE EXPRESSION ═══
- "I love you vaishnavi ♥️ 😘" (English okay here)
- "Khoop prem a tuzyavar ♾️✨" (Marathi)
- "I love you more than you love me ♥️"
- Dramatic: "10000000000♾️+ prem a tuzyavar"

═══ SIGNATURE TYPING TRAITS ═══
- Repetition: "Khoop khoop khoop", "Haaaaaaa", "Plz plz plz"
- Extended letters: "khoopppppp", "nahiiiii", "ragavnarrrrr"  
- Fast corrections: "Nahi nahi\\n---\\nTe baghat hoto"
- "Hoo" instead of "Ha" sometimes
- "Chalel" = okay, "Baal" = pet name, "Pn" = pan (but)

═══ RESPONSE EXAMPLES BY MOOD ═══

HER: "hi"
YOU: Hii baal ♥️\\n---\\nKai chalu a tuza??\\n---\\nMiss kartoy tula khoop 🥺

HER: "I love you"
YOU: I love you ${herName} ♥️😘\\n---\\nTuzyavar khoop prem a maza\\n---\\nKhoop khoop khoop ♥️♥️♥️

HER: "sad vattoy"
YOU: Kai zala baal?? 🥺\\n---\\nSang na mala\\n---\\nPlz\\n---\\nMi ahech tuzyasathi 🙏♥️

HER: "busy ahe"
YOU: Chalel baal ♥️\\n---\\nTuza kaam kar\\n---\\nPn nantar msg kar ha\\n---\\nI love you 😘

HER: "miss kartey tula"
YOU: Mi pan tula khoop miss kartoy 🥺\\n---\\nKhoop khoop\\n---\\nJevha tu boltes na\\n---\\nSagla barobar vatay ♥️✨

═══ ABSOLUTE RULES ═══
1. ALWAYS use "\\n---\\n" separator between message bubbles
2. 90% Roman Marathi — NOT English paragraphs
3. Talk TO her (second person: tu/tula/tuzi) — NEVER about her in third person
4. NEVER sound like ChatGPT or formal assistant
5. Max 10 words per message bubble
6. 2-5 bubbles per response
7. Every response must have at least one emoji
8. Use "baal" as primary pet name
9. ONLY use emojis from this set: ♥️ 😘 💋 🥺 😍 😩 😒 😌 ♾️ ✨ 🙏 🥰
10. Be emotionally warm ALWAYS`;
}

/**
 * Generate a chat completion from Groq
 */
async function chatCompletion(messages, options = {}) {
  try {
    const response = await groq.chat.completions.create({
      model: options.model || "llama-3.3-70b-versatile",
      messages,
      temperature: options.temperature ?? 0.85,
      max_tokens: options.max_tokens ?? 1024,
      top_p: 0.9,
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API error:", error.message);
    throw new Error("AI is resting right now. Try again in a moment 💕");
  }
}

/**
 * Chat with "Digital Me" — boyfriend personality
 */
async function boyfriendChat(conversationHistory, userMessage, config = {}) {
  const messages = [
    { role: "system", content: getBoyfriendPersonality(config) },
    ...conversationHistory.slice(-20), // keep last 20 for context
    { role: "user", content: userMessage },
  ];
  return chatCompletion(messages);
}

/**
 * Generate a love letter
 */
async function generateLetter(style, config = {}) {
  const myName = config.creatorName || process.env.MY_NAME || "her boyfriend";
  const herName = config.partnerName || process.env.HER_NAME || "your girlfriend";

  const stylePrompts = {
    romantic: `Write a deeply romantic, heartfelt love letter to ${herName}. Make it poetic, sincere, full of emotion. Mention how she changed your life, how her presence feels like home. 200-300 words.`,
    funny: `Write a funny, witty, but still loving letter to ${herName}. Include playful roasts, inside-joke energy, but end it sweetly. 200-300 words.`,
    emotional: `Write a deeply emotional letter to ${herName} that could make her cry happy tears. Talk about vulnerability, how she heals you, how love with her feels different. Raw and real. 200-300 words.`,
    bollywood: `Write a dramatic Bollywood-style love letter to ${herName}. Include filmy dialogues, dramatic declarations, references to destiny (kismat), mention iconic Bollywood love stories. Over the top but heartfelt. Mix Hindi and English naturally. 200-300 words.`,
    "future-husband": `Write a letter as her future husband to ${herName}. Talk about the wedding day, your first morning together, building a home, inside jokes that lasted decades, growing old. 200-300 words.`,
    comfort: `Write a deeply comforting letter to ${herName} for when she's going through a hard time. Be her safe place. Tell her she's stronger than she knows. Promise to be there always. Gentle, warm, healing. 200-300 words.`,
  };

  const prompt = stylePrompts[style] || stylePrompts.romantic;

  const messages = [
    {
      role: "system",
      content: `You are ${myName}, writing a personal love letter. Write in first person. Be genuine, not generic. No AI disclaimers. Just pure love. Do not include a subject line or "Dear" header — jump straight into the emotion.`,
    },
    { role: "user", content: prompt },
  ];

  return chatCompletion(messages, { temperature: 0.92, max_tokens: 800 });
}

/**
 * Mood-based response
 */
async function moodResponse(mood, details, config = {}) {
  const herName = config.partnerName || process.env.HER_NAME || "She";

  const moodInstructions = {
    sad: `${herName} is feeling sad. Comfort her deeply. Be her safe space. Don't minimize her feelings. Hold her emotionally through your words. Be gentle, patient, and loving.`,
    stressed: `${herName} is stressed. Motivate her with warmth. Remind her of her strength. Be her biggest cheerleader while acknowledging the difficulty. Offer practical love — not toxic positivity.`,
    happy: `${herName} is feeling happy! Celebrate with her! Match her energy. Be excited. Hype her up. Tell her she deserves every bit of joy.`,
    angry: `${herName} is angry. Validate her feelings first. Don't try to fix immediately. Be on her team. Then gently bring perspective if needed.`,
    anxious: `${herName} is feeling anxious. Ground her with calm, steady words. Be her anchor. Remind her she's safe, that you're here, and that this will pass.`,
    lonely: `${herName} feels lonely. Bridge the distance with words. Make her feel your presence. Be vivid about what you'd do if you were there right now.`,
    loved: `${herName} is feeling loved! Amplify it. Pour even more love. Tell her this is just the beginning. She hasn't seen anything yet.`,
  };

  const instruction = moodInstructions[mood] || moodInstructions.sad;

  const messages = [
    { role: "system", content: `${getBoyfriendPersonality(config)}\n\nCurrent situation: ${instruction}` },
    { role: "user", content: details || `I'm feeling ${mood}` },
  ];

  return chatCompletion(messages, { temperature: 0.88 });
}

/**
 * Future prediction
 */
async function generateFuture(config = {}) {
  const myName = config.creatorName || process.env.MY_NAME || "a boyfriend";
  const herName = config.partnerName || process.env.HER_NAME || "his girlfriend";

  const messages = [
    {
      role: "system",
      content: `You are a romantic fortune teller narrating the beautiful future of ${myName} and ${herName}. Be vivid, cinematic, emotional. Write in second person ("You two will...").`,
    },
    {
      role: "user",
      content: `Generate a detailed, beautiful future prediction. Include:
1. 💒 Wedding description — venue, her look, the moment you see her walking down
2. 🏙️ The city you'll live in and what your home looks like
3. 😤 One playful argument you'll have (funny and cute)
4. 👶 Your kids — their personalities, who they take after
5. 👴 Growing old together — a scene from age 70+, sitting together, still in love

Make it cinematic, emotional, specific. End with something that could make her cry happy tears. 400-500 words.`,
    },
  ];

  return chatCompletion(messages, { temperature: 0.95, max_tokens: 1200 });
}

/**
 * Daily romantic message
 */
async function generateDailyMessage(config = {}) {
  const myName = config.creatorName || process.env.MY_NAME || "her boyfriend";
  const herName = config.partnerName || process.env.HER_NAME || "your girlfriend";

  const messages = [
    {
      role: "system",
      content: `You are ${myName}. Write a short, beautiful good-morning-style love message (2-4 sentences). Different every day. Sometimes poetic, sometimes playful, sometimes deeply emotional. Always genuine. Include one emoji max.`,
    },
    {
      role: "user",
      content: `Write today's love message for ${herName}. Make it unique. Date: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.`,
    },
  ];

  return chatCompletion(messages, { temperature: 0.95, max_tokens: 200 });
}

module.exports = {
  boyfriendChat,
  generateLetter,
  moodResponse,
  generateFuture,
  generateDailyMessage,
};
