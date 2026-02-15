# API layer: where to declare methods like getMe, sendMessage, forwardMessage

## Best practice

| Layer                                       | File                                      | Role                                                                                                                                                              |
| ------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Implementation (single source of truth)** | `lib/api/Client.ts` – **ApiClient** class | Declare and implement every Bale API method here. One method per API endpoint (e.g. `getMe`, `sendMessage`, `forwardMessage`, `sendPhoto`, `editMessageText`, …). |
| **Public surface (optional convenience)**   | `lib/Bot.ts` – **Bot** class              | For the most common methods, add thin wrappers that delegate to `this.api.*`. Users can then call either `bot.sendMessage(...)` or `bot.api.sendMessage(...)`.    |

## Rule of thumb

- **New API method** → add it to **ApiClient** first. That is the only place that should call `this.request('methodName', body)`.
- **Convenience** → if the method is commonly used, add a one-liner on **Bot** that delegates to `this.api.methodName(...)`.

So: **declare and implement in `lib/api/Client.ts`**; optionally expose on **Bot** for a nicer API.

## Examples

- `getMe`, `sendMessage`, `forwardMessage` → implemented in **ApiClient**, and (for convenience) also exposed on **Bot**.
- Niche methods (e.g. `setChatAdministratorCustomTitle`) → can live only on **ApiClient**; users call `bot.api.setChatAdministratorCustomTitle(...)`.

This keeps the HTTP/request logic in one place and avoids duplicating implementation.
