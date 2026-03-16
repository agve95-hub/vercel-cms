export interface NewsletterAdapter { subscribe(email: string): Promise<void>; unsubscribe(email: string): Promise<void>; }
