import { Request } from 'express';

export interface signUpInfo {
	username: string;
	email: string;
	user_password: string;
}

export interface signInInfo {
	username: string;
	password: string;
}

export interface AuthenticatedRequest extends Request {
    user ?: any;
}