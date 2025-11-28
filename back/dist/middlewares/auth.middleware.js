"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffMiddleware = exports.adminMiddleware = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const auth_config_1 = require("../config/auth.config");
const shared_types_1 = require("../types/shared.types");
const user_service_1 = require("@/services/user.service");
/**
 * Auth Middleware Helper Class
 * Implements IAuthMiddleware interface
 */
class AuthMiddlewareHelper {
    /**
     * Extract and format user from BetterAuth session
     */
    authenticateUser(session) {
        return {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            emailVerified: session.user.emailVerified,
            role: session.user.role || shared_types_1.UserRole.MEMBER,
            createdAt: session.user.createdAt.toISOString(),
            updatedAt: session.user.updatedAt.toISOString(),
        };
    }
}
const authHelper = new AuthMiddlewareHelper();
const authMiddleware = async (req, res, next) => {
    try {
        const session = await auth_config_1.auth.api.getSession({
            headers: req.headers,
        });
        if (!session) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
            return;
        }
        // Attach user to request
        req.user = authHelper.authenticateUser(session);
        const fullUser = await user_service_1.userService.getUserById(req.user.id);
        if (!fullUser) {
            next();
            return;
        }
        req.user.role = fullUser.role;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            error: 'Invalid or expired session',
        });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = (req, res, next) => {
    auth_config_1.auth.api.getSession({
        headers: req.headers,
    })
        .then((session) => {
        if (session) {
            req.user = authHelper.authenticateUser(session);
        }
        next();
    })
        .catch(() => {
        // Continue without user
        next();
    });
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Authentication required',
        });
        return;
    }
    if (req.user.role !== shared_types_1.UserRole.ADMIN) {
        res.status(403).json({
            success: false,
            error: 'Admin access required',
        });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
const staffMiddleware = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Authentication required',
        });
        return;
    }
    if (req.user.role !== shared_types_1.UserRole.ADMIN && req.user.role !== shared_types_1.UserRole.STAFF) {
        res.status(403).json({
            success: false,
            error: 'Staff access required',
        });
        return;
    }
    next();
};
exports.staffMiddleware = staffMiddleware;
//# sourceMappingURL=auth.middleware.js.map