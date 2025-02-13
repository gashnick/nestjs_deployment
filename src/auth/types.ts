export interface PayLoadType {
    email: string;
    userId: number;
    artistId?: number;
}

export interface Enable2FAType {
    secret: string
}