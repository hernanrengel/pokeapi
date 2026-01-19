import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from './user.service.js';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

interface TokenPayload {
    userId: string;
    email: string;
}

export class AuthService {
    /**
     * Hash a password using bcrypt
     */
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    /**
     * Compare a plain password with a hashed password
     */
    static async comparePasswords(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }

    /**
     * Generate a JWT token for a user
     */
    static generateToken(userId: string, email: string): string {
        const payload: TokenPayload = { userId, email };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
    }

    /**
     * Verify and decode a JWT token
     */
    static verifyToken(token: string): TokenPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Register a new user
     */
    static async register(email: string, password: string, name?: string) {
        // Check if user already exists
        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await this.hashPassword(password);

        // Create user
        const user = await UserService.createUser({
            email,
            password: hashedPassword,
            ...(name !== undefined && { name }),
        });

        // Generate token
        const token = this.generateToken(user.id, user.email);

        // Return user without password and token
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    /**
     * Login a user
     */
    static async login(email: string, password: string) {
        // Get user
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await this.comparePasswords(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = this.generateToken(user.id, user.email);

        // Return user without password and token
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
