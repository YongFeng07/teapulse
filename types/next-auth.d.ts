import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      points: number;
      tier: string;
    };
  }

  interface User {
    id: string;
    points: number;
    tier: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    points: number;
    tier: string;
  }
}
