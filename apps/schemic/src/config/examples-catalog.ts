// STUB — to be replaced by the vendored verified manifest from schemic (core-dev).
// Shape matches CatalogExample.
//
// Each example here was de-tokenized from the driver-verified entries in
// packages/landing/config/examples.ts (surrealdb + postgres schema/depth) into
// plain `code` (TS authoring source) and `ddl` (generated DDL) strings, kept
// byte-faithful to those verified examples. When core-dev ships the vendored
// manifest, swap this whole module for it — the page only depends on the
// CatalogExample shape and the `examplesCatalog` export below.

/**
 * One verified cookbook example: a TS authoring source (`code`) and the DDL it
 * generates (`ddl`), grouped per driver. `lang` is the DDL dialect label.
 */
export type CatalogExample = {
  driver: string;
  group: string;
  title: string;
  note?: string;
  code: string;
  ddl: string;
  lang: string;
};

export const examplesCatalog: CatalogExample[] = [
  {
    driver: "surrealdb",
    group: "Schema basics",
    title: "A typed table",
    note: "One s.email().unique() compiles to a typed FIELD plus a UNIQUE INDEX.",
    code: "export const User = defineTable(\"user\", {\n  id: s.string(),\n  email: s.email().unique(),\n  name: s.string().optional(),\n  createdAt: s.datetime()\n    .$default(surql`time::now()`)\n    .$readonly(),\n});",
    ddl: "DEFINE TABLE user TYPE NORMAL SCHEMAFULL;\nDEFINE FIELD email ON TABLE user TYPE string\n  ASSERT string::is_email($value);\nDEFINE INDEX user_email_idx ON TABLE user\n  FIELDS email UNIQUE;\nDEFINE FIELD name ON TABLE user TYPE option<string>;\nDEFINE FIELD createdAt ON TABLE user TYPE datetime\n  DEFAULT time::now() READONLY;",
    lang: "SurrealQL",
  },
  {
    driver: "surrealdb",
    group: "Access, events & functions",
    title: "Events, functions & access in one file",
    note: "Authoring events, a function, and a record access rule emits DEFINE EVENT / FUNCTION / ACCESS.",
    code: "// events, functions & access — one file\nUser.event(\"welcome\", {\n  when: surql`$event = 'CREATE'`,\n  then: surql`fn::welcome($after.id)`,\n})\n\nexport const welcome = defineFunction(\"welcome\", {\n  user: s.recordId(\"user\"),\n}).body(surql`CREATE log SET user = $user`)\n\nexport const account = defineAccess(\"account\")\n  .record().signup(surql`CREATE user SET email = $email`)\n  .duration({ session: \"12h\" })",
    ddl: "DEFINE EVENT welcome ON TABLE user\n  WHEN $event = 'CREATE'\n  THEN fn::welcome($after.id);\n\nDEFINE FUNCTION fn::welcome($user: record<user>) {\n  CREATE log SET user = $user\n};\n\nDEFINE ACCESS account ON DATABASE\n  TYPE RECORD\n  SIGNUP (CREATE user SET email = $email)\n  DURATION FOR SESSION 12h;",
    lang: "SurrealQL",
  },
  {
    driver: "postgres",
    group: "Schema basics",
    title: "A typed table",
    note: "One s.text().$unique().$check(…) compiles to a column, a CHECK, and a UNIQUE INDEX.",
    code: "import { defineTable, s, sqlExpr } from \"@schemic/postgres\";\n\nexport const user = defineTable(\"user\", {\n  email: s.text()\n    .$unique()\n    .$check(sqlExpr(\"email ~* '^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$'\")),\n  name: s.string().optional(),\n  createdAt: s.timestamptz().$default(sqlExpr(\"now()\")),\n});",
    ddl: "CREATE TABLE \"user\" (\n  \"id\" text PRIMARY KEY,\n  \"createdAt\" timestamp with time zone NOT NULL DEFAULT now(),\n  \"email\" text NOT NULL CHECK (email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'),\n  \"name\" text\n);\nCREATE UNIQUE INDEX \"user_email_key\" ON \"user\" (\"email\");",
    lang: "PostgreSQL",
  },
  {
    driver: "postgres",
    group: "Relations, checks & generated columns",
    title: "Foreign keys, checks & a generated column",
    note: "Typed relations and constraints emit a FOREIGN KEY with ON DELETE CASCADE, CHECK constraints, and a STORED generated column.",
    code: "import { defineTable, s, sqlExpr } from \"@schemic/postgres\";\n\nexport const customer = defineTable(\"customer\", {\n  email: s.text().$unique().$check(sqlExpr(\"email ~* '^[^@]+@[^@]+$'\")),\n  name: s.text(),\n});\n\nexport const order = defineTable(\"order\", {\n  customer: customer.record({ onDelete: \"cascade\" }),\n  quantity: s.integer().$check(sqlExpr(\"quantity > 0\")),\n  unitPrice: s.numeric(10, 2),\n  total: s.numeric(12, 2).$generated('quantity * \"unitPrice\"'),\n  createdAt: s.timestamptz().$default(sqlExpr(\"now()\")),\n});",
    ddl: "CREATE TABLE \"customer\" (\n  \"id\" text PRIMARY KEY,\n  \"email\" text NOT NULL CHECK (email ~* '^[^@]+@[^@]+$'),\n  \"name\" text NOT NULL\n);\n\nCREATE TABLE \"order\" (\n  \"id\" text PRIMARY KEY,\n  \"createdAt\" timestamp with time zone NOT NULL DEFAULT now(),\n  \"customer\" text NOT NULL,\n  \"quantity\" integer NOT NULL CHECK (quantity > 0),\n  \"total\" numeric(12, 2) NOT NULL GENERATED ALWAYS AS (quantity * \"unitPrice\") STORED,\n  \"unitPrice\" numeric(10, 2) NOT NULL\n);\n\nCREATE UNIQUE INDEX \"customer_email_key\" ON \"customer\" (\"email\");\nALTER TABLE \"order\" ADD CONSTRAINT \"order_customer_fkey\"\n  FOREIGN KEY (\"customer\") REFERENCES \"customer\" (\"id\") ON DELETE CASCADE;",
    lang: "PostgreSQL",
  },
];
