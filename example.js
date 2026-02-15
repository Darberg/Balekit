/**
 * BaleKit usage examples
 *
 * Prerequisites:
 *   1. npm run build
 *   2. Set BALE_TOKEN in environment (your bot token from @botfather in Bale)
 *
 * Run: node example.js
 */

const {
  Bot,
  inlineKeyboard,
  keyboard,
  removeKeyboard,
} = require('./dist/index.js');

const token = process.env.BALE_TOKEN;
if (!token) {
  console.error('Set BALE_TOKEN in the environment (e.g. export BALE_TOKEN=your_token)');
  process.exit(1);
}

const bot = new Bot(token);

// ---------------------------------------------------------------------------
// 1. Reply to any text message
// ---------------------------------------------------------------------------
bot.onMessage(async (message) => {
  const text = message.text || '';
  const chatId = message.chat?.id;
  if (!chatId) return;

  // Simple reply (uses message.reply when _bot is attached)
  if (text === '/start') {
    await message.reply('Welcome! Send /menu for options or /keys for keyboards.');
    return;
  }

  if (text === '/menu') {
    const kb = inlineKeyboard()
      .addRow([{ text: 'Option A', callback_data: 'opt_a' }, { text: 'Option B', callback_data: 'opt_b' }])
      .addRow([{ text: 'Option C', callback_data: 'opt_c' }]);
    await bot.api.sendMessage(chatId, 'Choose an option:', { reply_markup: kb });
    return;
  }

  if (text === '/keys') {
    const replyKb = keyboard()
      .addRow(['Button 1', 'Button 2'])
      .addRow(['Hide keyboard']);
    await bot.api.sendMessage(chatId, 'Reply keyboard:', { reply_markup: replyKb });
    return;
  }

  if (text === 'Hide keyboard') {
    await bot.api.sendMessage(chatId, 'Keyboard removed.', { reply_markup: removeKeyboard() });
    return;
  }

  // Echo other messages
  await message.reply(`You said: ${text}`);
});

// ---------------------------------------------------------------------------
// 2. Handle inline button callbacks – answer first, then act
// ---------------------------------------------------------------------------
bot.onCallbackQuery(async (query) => {
  // Answer immediately so the button leaves "loading" state (required by Bale)
  try {
    await query.answerCallbackQuery();
  } catch (err) {
    if (err.message && (err.message.includes('query is too old') || err.message.includes('query ID is invalid'))) {
      return; // already answered or expired
    }
    throw err;
  }

  const chatId = query.chatId;
  const data = query.data || '';
  if (!chatId) return;

  if (data === 'opt_a') {
    await bot.api.sendMessage(chatId, 'You chose Option A.');
  } else if (data === 'opt_b') {
    await bot.api.sendMessage(chatId, 'You chose Option B.');
  } else if (data === 'opt_c') {
    await bot.api.sendMessage(chatId, 'You chose Option C.');
  } else {
    await bot.api.sendMessage(chatId, `Callback data: ${data}`);
  }
});

// ---------------------------------------------------------------------------
// 3. Optional: show alert for a specific callback
// ---------------------------------------------------------------------------
// bot.onCallbackQuery(async (query) => {
//   if (query.data === 'danger') {
//     await query.answerCallbackQuery({ text: 'Action confirmed', show_alert: true });
//     // ... do something
//   }
// });

// ---------------------------------------------------------------------------
// Start polling
// ---------------------------------------------------------------------------
async function main() {
  const me = await bot.getMe();
  console.log('Bot started as:', me.username || me.firstName);

  await bot.startPolling();
  console.log('Polling… (Ctrl+C to stop)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
