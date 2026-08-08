import {
  createStudentService,
  getAllStudentService,
  getStudentByIdService,
  updateStudentService,
  deleteStudentByIdService,
} from "../services/student.services.js";

import asyncHandler from "../utils/asyncHandler.js";

const VALID_SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Graduate",
];

export const createStudentController = asyncHandler(async (req, res) => {
  const studentData = req.body;

  // Validate semester
  if (!VALID_SEMESTERS.includes(studentData.semester)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid semester. Please select Semester 1, Semester 2, Semester 3, Semester 4, or Graduate.",
    });
  }

  const student = await createStudentService(studentData);

  return res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: student,
  });
});

export const getAllStudentsController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const result = await getAllStudentService(page, limit, search);

  const totalPages = Math.ceil(result.total / limit);

  return res.status(200).json({
    success: true,
    page,
    limit,
    total: result.total,
    totalPages,
    students: result.students,
  });
});

export const getStudentByIdController = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  const student = await getStudentByIdService(studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Student fetched successfully",
    data: student,
  });
});

export const updateStudentController = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  const studentData = req.body;

  // Validate semester
  if (!VALID_SEMESTERS.includes(studentData.semester)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid semester. Please select Semester 1, Semester 2, Semester 3, Semester 4, or Graduate.",
    });
  }

  const student = await updateStudentService(studentId, studentData);

  return res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

export const deleteStudentByIdController = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  const student = await deleteStudentByIdService(studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: student,
  });
});
