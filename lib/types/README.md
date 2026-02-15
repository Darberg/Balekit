# Type files: what is allowed and what is not

Use this as the standard for all files under `lib/types/`.

---

## 1. Naming

| Where                 | Allowed                                            | Not allowed                                  |
| --------------------- | -------------------------------------------------- | -------------------------------------------- |
| **Payload interface** | `snake_case` (matches Bale API)                    | `camelCase`                                  |
| **Payload name**      | `XPayload` (e.g. `UserPayload`, `DocumentPayload`) | Any other suffix                             |
| **Class name**        | PascalCase, singular (e.g. `User`, `Document`)     | Plural or different style                    |
| **Class properties**  | `camelCase` only                                   | `snake_case` (e.g. `small_file_id` on class) |

**Examples**

- Payload: `file_id`, `first_name`, `small_file_id`, `mime_type`.
- Class: `fileId`, `firstName`, `smallFileId`, `mimeType`.

---

## 2. Structure of each type file

**Allowed pattern:**

1. **Payload interface** – raw API shape, `snake_case` fields.
2. **Class** – takes payload in constructor, exposes **camelCase** properties and optional getters.

**Not allowed:**

- Class properties in `snake_case`.
- Skipping the payload interface and using a raw object type for the constructor.
- Exporting only a class without a corresponding `XPayload` interface (when the type comes from the API).

---

## 3. Payload interface rules

| Rule                    | Allowed                               | Not allowed                      |
| ----------------------- | ------------------------------------- | -------------------------------- |
| **Optional API fields** | `field_name?: Type`                   | Required when API says optional  |
| **Required API fields** | `field_name: Type` (no `?`)           | `?` on required fields           |
| **Field names**         | Exactly as in Bale API (`snake_case`) | Renaming to camelCase in payload |
| **Comments**            | JSDoc in English or Farsi for clarity | —                                |

---

## 4. Class rules

| Rule                     | Allowed                                                                                                    | Not allowed                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Constructor argument** | `payload: XPayload`                                                                                        | Different type or no payload type                               |
| **Default for payload**  | `payload: XPayload = {} as XPayload` for top-level types (e.g. Update, Message)                            | Required payload when API can send partial object               |
| **Optional → class**     | `propertyName: T \| null` and `payload.field ?? null`                                                      | `undefined` as class property type for optional API fields      |
| **Required → class**     | `propertyName: T` (no `\| null`)                                                                           | Making required API fields `\| null` without reason             |
| **Nested API object**    | Class property type = **another class** (e.g. `PhotoSize`), assign with `new PhotoSize(payload.thumbnail)` | Class property type = payload (e.g. `PhotoSizePayload \| null`) |
| **Nested API array**     | `Array<OtherClass>`, build with `.map(x => new OtherClass(x))`                                             | Storing raw payloads in class                                   |

**Examples**

- Allowed: `thumbnail: PhotoSize | null` and `this.thumbnail = payload.thumbnail ? new PhotoSize(payload.thumbnail) : null`.
- Not allowed: `thumbnail: PhotoSizePayload | null` on the class, or keeping raw payload in the class.

---

## 5. Getters, setters, and helper methods

**Allowed:**

- **Getters** – for derived or convenient values (e.g. `get name()`, `get chatId()`, `get isPrivate()`).
- **Setters** – when you need controlled assignment or validation (rare in these model classes).
- **Helper methods** – instance methods that do something useful with the type’s data (e.g. `message.reply(...)`).

**Guidelines:**

| Kind       | Use for                                     | Example                                                  |
| ---------- | ------------------------------------------- | -------------------------------------------------------- |
| **Getter** | Derived value from existing properties      | `get name(): string` from `firstName` + `lastName`       |
| **Getter** | Convenience shortcut                        | `get chatId()` instead of `this.chat?.id`                |
| **Getter** | Boolean flags from `type` or other fields   | `get isPrivate()`, `get isGroup()`                       |
| **Setter** | Validated or transformed assignment         | Only when the type really needs mutable, validated state |
| **Helper** | Action that uses the instance + bot/service | `message.reply(botOrText, text?, options?)`              |

**Examples from the codebase:**

- `User`: `get name()` – combines `firstName` and `lastName`.
- `Chat`: `get isPrivate()`, `get isGroup()`, `get isChannel()` – from `type`.
- `Message`: `get chatId()` – shortcut for `this.chat?.id`; `reply(...)` – helper that uses the message and optional bot to send a reply.
- `CallbackQuery`: `get chatId()` – shortcut for `this.message?.chat?.id`.

**Not allowed:**

- Getters/setters that change the **meaning** of API fields (e.g. a getter that returns something different from what the API sends).
- Helpers that depend on heavy or global state (prefer passing dependencies, e.g. `bot`, as arguments).

---

## 6. Exports

**Allowed:**

- Export the class and its payload: `export class Document { ... }` and `export interface DocumentPayload { ... }`.
- Export union types when needed: `export type ChatType = 'private' | 'group' | 'channel';`.
- Re-export from `lib/types/index.ts`: both the class and the payload/type, e.g. `export { Document, type DocumentPayload } from './Document';`.

**Not allowed:**

- Exporting only the class without the payload type when the type is used elsewhere (e.g. in `MessagePayload`).

---

## 7. Imports inside type files

**Allowed:**

- Importing other **payload** types for nested structures: `import { PhotoSizePayload } from './PhotoSize';`
- Importing other **classes** only when you need to instantiate them in the constructor (e.g. `new PhotoSize(payload.thumbnail)`).

**Not allowed:**

- Circular imports (A → B → A). Use payload-only imports or small shared interfaces if needed.
- Importing from outside `lib/types/` except for rare cases (e.g. `BotLike` in `Message.ts`).

---

## 8. Quick checklist for a new type file

- [ ] Payload interface: all fields `snake_case`, optional/required match API.
- [ ] Class: all properties `camelCase`.
- [ ] Constructor: maps every payload field to a class property with `?? null` for optional.
- [ ] Nested objects: class holds **class** instances (e.g. `PhotoSize`), not payloads.
- [ ] No `snake_case` on the class.
- [ ] Getters/helpers only for derived values or convenience (see §5).
- [ ] Exported from `lib/types/index.ts` if it is part of the public API.
