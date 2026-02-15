# BaleKit usage examples

This document describes the example file and common usage patterns.

## Running the example

```bash
# Build the library
npm run build

# Set your bot token (get it from @botfather in Bale)
export BALE_TOKEN=your_bot_token

# Run the example
node example.js
```

Then open your bot in Bale and try:

- `/start` – welcome message  
- `/menu` – inline buttons (Option A / B / C)  
- `/keys` – reply keyboard; "Hide keyboard" removes it  
- Any other text – echo reply  

---

## Code snippets

### 1. Create a bot and handle messages

```javascript
const { Bot } = require('balekit'); // or require('./dist/index.js')

const bot = new Bot(process.env.BALE_TOKEN);

bot.onMessage(async (message) => {
  await message.reply('Hello!');
});

bot.startPolling();
```

### 2. Send a message with inline keyboard

```javascript
const { Bot, inlineKeyboard } = require('balekit');

const bot = new Bot(process.env.BALE_TOKEN);
const chatId = 123456789;

const kb = inlineKeyboard()
  .addRow([{ text: 'Yes', callback_data: 'yes' }, { text: 'No', callback_data: 'no' }]);

await bot.api.sendMessage(chatId, 'Continue?', { reply_markup: kb });
```

### 3. Handle inline button presses (callback queries)

Always call `answerCallbackQuery()` first so the button stops loading.

```javascript
bot.onCallbackQuery(async (query) => {
  try {
    await query.answerCallbackQuery();
  } catch (e) {
    if (e.message?.includes('query is too old')) return;
    throw e;
  }

  if (query.data === 'yes') {
    await bot.api.sendMessage(query.chatId, 'You said yes.');
  }
});
```

### 4. Reply keyboard (persistent buttons under the input)

```javascript
const { keyboard, removeKeyboard } = require('balekit');

const replyKb = keyboard().addRow(['Option 1', 'Option 2']);
await bot.api.sendMessage(chatId, 'Choose:', { reply_markup: replyKb });

// Remove keyboard
await bot.api.sendMessage(chatId, 'Done.', { reply_markup: removeKeyboard() });
```

### 5. Get bot info and use the API directly

```javascript
const me = await bot.getMe();
console.log(me.username, me.firstName);

// Low-level API (same as Client)
await bot.api.sendMessage(chatId, 'Hi');
await bot.api.sendPhoto(chatId, photoFileId, { caption: 'Photo' });
await bot.api.getFile(fileId);
```

### 6. Optional: show alert on callback

```javascript
await query.answerCallbackQuery({
  text: 'Something went wrong',
  show_alert: true,
});
```

### 7. Request review (Bale-specific)

```javascript
// After a successful action
await query.askReview(5); // show review form after 5 seconds
```

---

## File overview

| File        | Purpose                                      |
|------------|-----------------------------------------------|
| `example.js` | Runnable demo: messages, inline keys, reply keys, callbacks |
| `EXAMPLES.md` | This file: how to run the example and copy-paste snippets   |

For full API (sendPhoto, getChat, payments, etc.) see `lib/api/Client.ts`.
