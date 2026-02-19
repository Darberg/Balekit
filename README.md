# BaleKit

یک کتابخانه برای ساخت ربات‌های پیام‌رسان بله (Bale Bot API) با TypeScript و Node.js.

## نصب

```bash
npm install balekit
```

یا با yarn:

```bash
yarn add balekit
```

## شروع سریع

اول باید یک توکن ربات از @botfather در بله بگیرید. بعد می‌تونید این کد رو اجرا کنید:

```typescript
import { Bot } from 'balekit';

const bot = new Bot('YOUR_BOT_TOKEN');

bot.onMessage(async (message) => {
  await message.reply('سلام!');
});

bot.startPolling();
```

این کد ربات رو راه‌اندازی می‌کنه و به همه پیام‌ها جواب می‌ده.

## ویژگی‌ها

- ✅ پشتیبانی کامل از API بله
- ✅ TypeScript با تایپ‌های کامل
- ✅ Long polling و webhook
- ✅ کیبوردهای inline و reply
- ✅ ارسال فایل (تصویر، ویدیو، صوت، سند و...)
- ✅ مدیریت callback query
- ✅ پشتیبانی از مینی‌اپ (Web App)
- ✅ مدیریت خطاها

## مثال‌های بیشتر

### ارسال پیام با کیبورد inline

```typescript
import { Bot, inlineKeyboard } from 'balekit';

const bot = new Bot(process.env.BALE_TOKEN!);

const kb = inlineKeyboard()
  .addRow([
    { text: 'بله', callback_data: 'yes' },
    { text: 'خیر', callback_data: 'no' }
  ]);

await bot.api.sendMessage(chatId, 'ادامه بدیم؟', {
  reply_markup: kb
});
```

### مدیریت کلیک روی دکمه‌های inline

```typescript
bot.onCallbackQuery(async (query) => {
  // اول باید answerCallbackQuery رو صدا بزنید
  await query.answerCallbackQuery();
  
  if (query.data === 'yes') {
    await bot.api.sendMessage(query.chatId!, 'گفتید بله!');
  }
});
```

### کیبورد reply (دکمه‌های پایین صفحه)

```typescript
import { keyboard, removeKeyboard } from 'balekit';

const replyKb = keyboard()
  .addRow(['گزینه ۱', 'گزینه ۲'])
  .addRow(['گزینه ۳']);

await bot.api.sendMessage(chatId, 'یک گزینه انتخاب کنید:', {
  reply_markup: replyKb
});

// حذف کیبورد
await bot.api.sendMessage(chatId, 'تمام!', {
  reply_markup: removeKeyboard()
});
```

### ارسال تصویر

```typescript
// با file_id (فایل قبلاً روی سرور بله هست)
await bot.api.sendPhoto(chatId, fromChatId, 'file_id_here', {
  caption: 'این یک تصویر است'
});

// با URL
await bot.api.sendPhoto(chatId, fromChatId, 'https://example.com/image.jpg');

// با فایل (multipart/form-data)
await bot.api.sendPhoto(chatId, fromChatId, fs.readFileSync('image.jpg'));
```

### ارسال فایل صوتی

```typescript
await bot.api.sendAudio(chatId, audioFileId, {
  caption: 'این یک فایل صوتی است'
});
```

### دریافت اطلاعات ربات

```typescript
const me = await bot.getMe();
console.log(`نام ربات: ${me.firstName}`);
console.log(`یوزرنیم: @${me.username}`);
```

## تنظیمات Polling

می‌تونید timeout و interval رو تنظیم کنید:

```typescript
bot.startPolling({
  timeout: 30,    // ثانیه - مدت انتظار برای دریافت آپدیت
  interval: 1000  // میلی‌ثانیه - فاصله بین درخواست‌ها
});
```

## Webhook Mode

اگر می‌خواید از webhook استفاده کنید (مثلاً روی سرور):

```typescript
import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  await bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// تنظیم webhook
await bot.api.setWebhook('https://yourdomain.com/webhook');
```

## محدودیت‌های ارسال فایل

کتابخانه شامل تنظیمات و محدودیت‌های ارسال فایل هست:

```typescript
import {
  FILE_SEND_CONFIG,
  MAX_IMAGE_SIZE_BY_URL_BYTES,
  getFileSource
} from 'balekit';

// تشخیص نوع فایل
const source = getFileSource(fileInput); // 'file_id' | 'url' | 'upload'

// محدودیت‌ها
console.log(FILE_SEND_CONFIG.limits.byUrl.image); // 5MB برای تصویر با URL
console.log(FILE_SEND_CONFIG.limits.byMultipart.other); // 50MB برای سایر فایل‌ها با multipart
```

سه روش ارسال فایل:
1. **file_id** - فایل قبلاً روی سرور بله هست (بدون محدودیت حجم)
2. **URL** - بله خودش دانلود می‌کنه (تصاویر تا 5MB، سایر تا 20MB)
3. **multipart/form-data** - آپلود مستقیم (تصاویر تا 10MB، سایر تا 50MB)

## مدیریت خطا

```typescript
import { BaleError, BaleApiError } from 'balekit';

try {
  await bot.api.sendMessage(chatId, 'test');
} catch (error) {
  if (error instanceof BaleApiError) {
    console.error('خطای API:', error.message);
    console.error('کد خطا:', error.code);
  } else {
    console.error('خطای دیگر:', error);
  }
}
```

## API Methods

تمام متدهای API بله پشتیبانی می‌شن. چند تا از مهم‌ترین‌ها:

- `sendMessage` - ارسال پیام متنی
- `sendPhoto` - ارسال تصویر
- `sendVideo` - ارسال ویدیو
- `sendAudio` - ارسال فایل صوتی
- `sendVoice` - ارسال پیام صوتی
- `sendDocument` - ارسال سند
- `sendAnimation` - ارسال انیمیشن
- `forwardMessage` - فوروارد پیام
- `getChat` - دریافت اطلاعات چت
- `getMe` - دریافت اطلاعات ربات
- `answerCallbackQuery` - پاسخ به callback query
- و خیلی بیشتر...

برای لیست کامل به `lib/api/Client.ts` مراجعه کنید.

## TypeScript

کتابخانه کاملاً با TypeScript نوشته شده و تایپ‌های کامل داره:

```typescript
import type { Message, User, Chat } from 'balekit';

bot.onMessage(async (message: Message) => {
  const user: User = message.from!;
  const chat: Chat = message.chat;
  console.log(`${user.firstName} در ${chat.type} پیام داد`);
});
```

## ساخت (Build)

اگر می‌خواید از source استفاده کنید:

```bash
git clone https://github.com/Darberg/Balekit
cd Balekit
npm install
npm run build
```

## مثال کامل

یک ربات ساده که به پیام‌ها جواب می‌ده و دکمه‌های inline داره:

```typescript
import { Bot, inlineKeyboard } from 'balekit';

const bot = new Bot(process.env.BALE_TOKEN!);

bot.onMessage(async (message) => {
  if (message.text === '/start') {
    const kb = inlineKeyboard()
      .addRow([
        { text: 'دکمه ۱', callback_data: 'btn1' },
        { text: 'دکمه ۲', callback_data: 'btn2' }
      ]);
    
    await bot.api.sendMessage(message.chatId!, 'سلام! یک دکمه انتخاب کنید:', {
      reply_markup: kb
    });
  } else {
    await message.reply(`شما گفتید: ${message.text}`);
  }
});

bot.onCallbackQuery(async (query) => {
  await query.answerCallbackQuery();
  
  if (query.data === 'btn1') {
    await bot.api.sendMessage(query.chatId!, 'دکمه ۱ رو زدید!');
  } else if (query.data === 'btn2') {
    await bot.api.sendMessage(query.chatId!, 'دکمه ۲ رو زدید!');
  }
});

bot.startPolling();
console.log('ربات راه‌اندازی شد!');
```

## لایسنس

GPL-3.0-only

## لینک‌ها

- [مستندات API بله](https://dev.bale.ai/)
- [گیت‌هاب](https://github.com/Darberg/Balekit)

## نکات

- برای دریافت توکن ربات باید به @botfather در بله پیام بدید
- بهتره توکن رو در environment variable نگه دارید (مثلاً `BALE_TOKEN`)
- برای production از webhook استفاده کنید نه polling
- حتماً خطاها رو handle کنید

اگر سوالی دارید یا مشکلی پیش اومد، می‌تونید issue بذارید در گیت‌هاب.
