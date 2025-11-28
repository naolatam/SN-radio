"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_controller_1 = require("../controllers/staff.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Get all staff members
 *     description: Retrieve a list of all staff members (public endpoint)
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: Staff list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     staff:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StaffPresenter'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', staff_controller_1.staffController.getAllStaff.bind(staff_controller_1.staffController));
/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get staff member by ID
 *     description: Retrieve a specific staff member by their ID (public endpoint)
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff member ID
 *     responses:
 *       200:
 *         description: Staff member retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     staff:
 *                       $ref: '#/components/schemas/StaffPresenter'
 *       404:
 *         description: Staff member not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.get('/:id', staff_controller_1.staffController.getStaffById.bind(staff_controller_1.staffController));
/**
 * @swagger
 * /api/staff/user/{userId}:
 *   get:
 *     summary: Get staff member by user ID
 *     description: Retrieve a staff member by their associated user ID (public endpoint)
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Staff member retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     staff:
 *                       $ref: '#/components/schemas/StaffPresenter'
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', staff_controller_1.staffController.getStaffByUserId.bind(staff_controller_1.staffController));
/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a new staff member
 *     description: Add a user to the staff (admin only)
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to add to staff
 *               role:
 *                 type: string
 *                 description: Role/position of the staff member
 *                 example: "Developer"
 *               description:
 *                 type: string
 *                 description: Optional description about the staff member
 *                 example: "Full-stack developer specializing in React and Node.js"
 *     responses:
 *       201:
 *         description: Staff member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     staff:
 *                       $ref: '#/components/schemas/StaffPresenter'
 *       400:
 *         description: Bad request - Missing required fields
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Conflict - User is already a staff member
 *       500:
 *         description: Internal server error
 */
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, staff_controller_1.staffController.createStaff.bind(staff_controller_1.staffController));
/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update staff member
 *     description: Update staff member's role and/or description (admin only)
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: New role/position
 *                 example: "Senior Developer"
 *               description:
 *                 type: string
 *                 description: New description
 *                 example: "Lead developer for frontend applications"
 *     responses:
 *       200:
 *         description: Staff member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     staff:
 *                       $ref: '#/components/schemas/StaffPresenter'
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, staff_controller_1.staffController.updateStaff.bind(staff_controller_1.staffController));
/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Delete staff member
 *     description: Remove a user from the staff (admin only)
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff member ID
 *     responses:
 *       200:
 *         description: Staff member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Staff member deleted successfully"
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, staff_controller_1.staffController.deleteStaff.bind(staff_controller_1.staffController));
/**
 * @swagger
 * /api/staff/count:
 *   get:
 *     summary: Get staff count
 *     description: Get the total number of staff members (admin only)
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Staff count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                       example: 5
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/count', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, staff_controller_1.staffController.getStaffCount.bind(staff_controller_1.staffController));
exports.default = router;
//# sourceMappingURL=staff.routes.js.map