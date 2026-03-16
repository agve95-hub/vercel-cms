import { db, schema } from "@/lib/db";
import { v4 as uuid } from "uuid";
import type { NewsletterAdapter } from "./adapter";
export class DatabaseNewsletterAdapter implements NewsletterAdapter {
  async subscribe(email: string) { await db.insert(schema.formSubmissions).values({ id: uuid(), formName: "newsletter", data: JSON.stringify({ email }) }); }
  async unsubscribe() {}
}
