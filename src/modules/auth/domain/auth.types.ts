export interface UserVerificationProps {
  userId: string;
  target: string;
  token: string;
  expiresAt: Date;
  verified: boolean;
}

export interface CreateUserVerificationProps {
  userId: string;
  target: string;
  token: string;
}

export interface SessionProps {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export type CreateSessionProps = SessionProps;
