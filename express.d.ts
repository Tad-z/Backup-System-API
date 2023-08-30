// express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userData?: {
        fullName: string;
        userID: string;
        // Add other properties if needed
      };
    }
  }
}
