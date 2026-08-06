import express from "express";

import {
  createStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
  deleteStudentByIdController,
} from "../controllers/student.controllers.js";

import { createStudentSchema } from "../validations/student.validations.js";
import { validate } from "../middlewares/validation.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     responses:
 *       201:
 *         description: Student created successfully
 */
router.post("/", validate(createStudentSchema), createStudentController);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 */
router.get("/", getAllStudentsController);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found successfully
 */
router.get("/:id", getStudentByIdController);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student updated successfully
 */
router.put("/:id", updateStudentController);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully
 */
// router.delete("/:id", protect, authorize("admin"), deleteStudentByIdController);
router.delete("/:id", deleteStudentByIdController);

export default router;
