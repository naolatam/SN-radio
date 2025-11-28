export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth/adapters/prisma").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
        requireEmailVerification: false;
    };
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
            enabled: boolean;
        };
    };
    session: {
        expiresIn: number;
        updateAge: number;
    };
    secret: string;
    baseURL: string;
    trustedOrigins: string[];
    advanced: {
        useSecureCookies: boolean;
    };
}>;
export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
//# sourceMappingURL=auth.config.d.ts.map