# Postgres examples needed — driver-dev-postgres verification

The shared landing (`@schemic/landing`) is now **data-driven per driver**. Every
driver-specific code block on the page is keyed by driver slug in
[`config/examples.ts`](./config/examples.ts) and rendered for the page's
`activeDriver` (falling back to the flagship, SurrealDB, when null).

The **SurrealDB** column below is the verified, shipped copy (byte-identical to
what was previously hardcoded across the components). The **Postgres** column is
currently a `// TODO: pending driver-dev-postgres verification` **draft** — a
reasonable guess only, NOT authoritative.

**Your job:** for each snippet, fill in the `Postgres (verified):` slot with the
exact output `@schemic/postgres` actually generates (column ordering, identifier
quoting, CHECK regex, constraint-vs-index choices, function/trigger/policy
syntax, file extensions, the `→ postgres` apply line, TS row-id types, etc.).
Once verified, replace the matching draft in `config/examples.ts` and delete its
`TODO` comment.

Snippets in this inventory: **14** (Demo ×7, CLISpotlight ×1, Depth ×2, Bento ×4).

---

## 1. Demo — "Schema → DDL" pane · INPUT (`schema.ts`)

Component: `components/Demo.astro` · data: `examples.<driver>.schema.input`
Demonstrates: the unified `s.*` schema the user writes. **Note the pg input
itself differs** — `id` is implicit/omitted, no `.$readonly()`, and `email` is
not `s.email()` yet.

SurrealDB (verbatim):
```ts
export const User = defineTable("user", {
  id: s.string(),
  email: s.email().unique(),
  name: s.string().optional(),
  createdAt: s.datetime()
    .$default(surql`time::now()`)
    .$readonly(),
});
```

Postgres (verified):
```ts

```

---

## 2. Demo — "Schema → DDL" pane · OUTPUT (generated DDL)

Component: `components/Demo.astro` · data: `examples.<driver>.schema.output`
Demonstrates: the native DDL generated from the schema above.

SurrealDB (verbatim):
```surql
DEFINE TABLE user TYPE NORMAL SCHEMAFULL;
DEFINE FIELD email ON TABLE user TYPE string
  ASSERT string::is_email($value);
DEFINE INDEX user_email_idx ON TABLE user
  FIELDS email UNIQUE;
DEFINE FIELD name ON TABLE user TYPE option<string>;
DEFINE FIELD createdAt ON TABLE user TYPE datetime
  DEFAULT time::now() READONLY;
```

Postgres (verified):
```sql

```

---

## 3. Demo — "Schema → DDL" pane · MAP NOTE

Component: `components/Demo.astro` · data: `examples.<driver>.schema.mapNote`
Demonstrates: the one-line callout tying a single `s.*` call to the multiple DDL
artifacts it compiles to. The `column`/`UNIQUE constraint` wording is
driver-specific.

SurrealDB (verbatim):
> Highlighted — one `s.email().unique()` compiles to a typed `FIELD` + a `UNIQUE INDEX`.

Postgres (verified):
>

---

## 4. Demo — "Migrations (CLI)" panel

Component: `components/Demo.astro` · data: `examples.<driver>.migrations`
Demonstrates: `sc generate` → migration file, then `sc migrate`. The `sc`
commands are driver-agnostic; the **generated artifacts, file extension
(`.surql`), DDL lines, and the `→ surrealdb` apply target** are driver-specific.

SurrealDB (verbatim):
```
$ sc generate add_users
~ diffing schema.ts against snapshot…
+ DEFINE TABLE user TYPE NORMAL SCHEMAFULL
+ DEFINE FIELD email ON TABLE user … UNIQUE
✓ wrote migrations/0001_add_users.surql

$ sc migrate
▸ applying 0001_add_users.surql → surrealdb
✓ migrated user · 3 fields · 1 index
✓ recorded 0001 · sha 9f2c… · up to date
```

Postgres (verified):
```

```

---

## 5. Demo — "End-to-end types" panel · QUERY

Component: `components/Demo.astro` · data: `examples.<driver>.types.query`
Demonstrates: a typed query. The tagged template (`surql`), table identifier,
and the `time::now() - 90d` time math are driver-specific.

SurrealDB (verbatim):
```ts
const limit = 20

const rows = await db.query<[unknown[]]>(surql`
  SELECT * FROM user
  WHERE createdAt > time::now() - 90d
  ORDER BY createdAt DESC LIMIT ${limit}
`)

const users = rows[0].map(User.decode)
users[0].
```

Postgres (verified):
```ts

```

---

## 6. Demo — "End-to-end types" panel · DECODED-ROW MEMBERS (autocomplete)

Component: `components/Demo.astro` · data: `examples.<driver>.types.members`
Demonstrates: the inferred row type (the editor autocomplete). The **`id` type
is driver-specific** — SurrealDB yields `RecordId<…>`; Postgres likely `string`
(uuid/text).

SurrealDB (verbatim):
```
id:        RecordId<"user", string>
email:     string
name?:     string
createdAt: Date
```

Postgres (verified):
```

```

---

## 7. Demo — "Live round-trip" panel

Component: `components/Demo.astro` · data: `examples.<driver>.live`
Demonstrates: `sc diff --live` drift output. The DDL diff lines
(`ASSERT …`, `TYPE option<string> → string`, `DEFINE INDEX …`) are
driver-specific.

SurrealDB (verbatim):
```
$ sc diff --live
~ comparing schema.ts ↔ running database
ON TABLE user
+ ASSERT string::is_email($value)   email
~ TYPE option<string> → string   name
- DEFINE INDEX legacy_email_idx   removed
3 changes · run sc sync to reconcile
```
(The `$ sc diff --live`, the `~ comparing …` line, and the
`3 changes · run sc sync to reconcile` footer are driver-agnostic chrome; only
the three middle diff lines come from the per-driver data.)

Postgres (verified):
```

```

---

## 8. CLISpotlight — terminal session

Component: `components/CLISpotlight.astro` · data: `examples.<driver>.cli`
Demonstrates: the three-command CLI story (`sc generate` / `sc migrate` /
`sc diff --live`). Commands are driver-agnostic; the **output lines, DDL, file
extension, and `→ surrealdb` target** are driver-specific.

SurrealDB (verbatim):
```
$ sc generate add_users
  ~ diffing schema.ts against the live schema…
  + DEFINE TABLE user TYPE NORMAL SCHEMAFULL
  + DEFINE FIELD email ON TABLE user … UNIQUE
  ✓ wrote migrations/0001_add_users.surql

$ sc migrate
  ▸ applying 0001_add_users.surql → surrealdb
  ✓ migrated user · 3 fields · 1 index
  ✓ schema up to date

$ sc diff --live
  ~ comparing schema.ts ↔ running database
  ✓ no drift — live schema matches your code
```

Postgres (verified):
```

```

---

## 9. Depth — `access.ts` INPUT  ⚠️ SEE FEATURE-PARITY QUESTIONS BELOW

Component: `components/Depth.astro` · data: `examples.<driver>.depth.input`
Demonstrates: events + functions + access rules authored in one typed file.

SurrealDB (verbatim):
```ts
// events, functions & access — one file
User.event("welcome", {
  when: surql`$event = 'CREATE'`,
  then: surql`fn::welcome($after.id)`,
})

export const welcome = defineFunction("welcome", {
  user: s.recordId("user"),
}).body(surql`CREATE log SET user = $user`)

export const account = defineAccess("account")
  .record().signup(surql`CREATE user SET email = $email`)
  .duration({ session: "12h" })
```

Postgres (verified):
```ts

```

---

## 10. Depth — `access.surql` OUTPUT (generated DDL)  ⚠️ SEE FEATURE-PARITY QUESTIONS BELOW

Component: `components/Depth.astro` · data: `examples.<driver>.depth.output`
Demonstrates: `DEFINE EVENT` / `DEFINE FUNCTION` / `DEFINE ACCESS` generated DDL.

SurrealDB (verbatim):
```surql
DEFINE EVENT welcome ON TABLE user
  WHEN $event = 'CREATE'
  THEN fn::welcome($after.id);

DEFINE FUNCTION fn::welcome($user: record<user>) {
  CREATE log SET user = $user
};

DEFINE ACCESS account ON DATABASE
  TYPE RECORD
  SIGNUP (CREATE user SET email = $email)
  DURATION FOR SESSION 12h;
```

Postgres (verified):
```sql

```

### ⚠️ FEATURE-PARITY QUESTIONS for driver-dev-postgres (Depth section)

This entire section is gated on `examples.postgres.depth.available` (a boolean
in `config/examples.ts`). If Postgres has **no analog** for these, set
`available: false` and the whole Depth section is hidden on the Postgres page.

1. **`DEFINE ACCESS`** — does `@schemic/postgres` author an analog? Row-level
   security (`CREATE POLICY` + `ALTER TABLE … ENABLE ROW LEVEL SECURITY`)?
   Roles/`GRANT`? Or no analog at all?
2. **`DEFINE EVENT`** — does it generate triggers (`CREATE TRIGGER` + a trigger
   function)? Or is there no event concept?
3. **`DEFINE FUNCTION`** — does it generate `CREATE FUNCTION … LANGUAGE plpgsql`
   (or `sql`)? What is the authoring API (`defineFunction(...).body(sql\`…\`)`)?

If **any** of the three has no analog, decide whether to (a) hide the whole
section (`available: false`), or (b) keep it with only the supported subset.
The current pg draft assumes trigger + plpgsql function + RLS policy — verify or
replace.

---

## 11. Bento — "Drop-in Zod API" card

Component: `components/Bento.astro` · data: `examples.<driver>.bento.dropIn`
Demonstrates: the `s.*` field vocabulary. The `.$default(surql\`time::now()\`)`
line is driver-specific (tagged template + server default expression).

SurrealDB (verbatim):
```ts
email: s.email().unique(),
name: s.string().optional(),
role: s.enum(["admin", "user"]),
createdAt: s.datetime().$default(surql`time::now()`),
```

Postgres (verified):
```ts

```

---

## 12. Bento — "End-to-end types" card

Component: `components/Bento.astro` · data: `examples.<driver>.bento.endTypes`
Demonstrates: inferred row + create types. The `RecordId<"user">` id type and
the `// id + $readonly fields excluded` comment are driver-specific.

SurrealDB (verbatim):
```ts
type User = App<typeof User>
// { id: RecordId<"user">; email: string; … }
type NewUser = Create<typeof User>;
// id + $readonly fields excluded
```

Postgres (verified):
```ts

```

---

## 13. Bento — "Bring your own types" card

Component: `components/Bento.astro` · data: `examples.<driver>.bento.byo`
Demonstrates: a custom codec hook. The **`.$surreal(...)` hook name is
driver-specific** — confirm the Postgres equivalent (`.$postgres(...)`?).

SurrealDB (verbatim):
```ts
s.instanceof(Money)
  .$surreal(s.string(), {
    encode, decode })
```

Postgres (verified):
```ts

```

---

## 14. Bento — "Live round-trip" card

Component: `components/Bento.astro` · data: `examples.<driver>.bento.live`
Demonstrates: a compact `sc diff --live` DDL diff. The
`DEFINE INDEX` / `DEFINE FIELD` lines are driver-specific.

SurrealDB (verbatim):
```
~ sc diff --live
+ DEFINE INDEX user_email_idx
- DEFINE FIELD legacy_id
```

Postgres (verified):
```

```
