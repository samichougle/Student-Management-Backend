import {
  createStudent,
  getAllStudent,
  getStudentById,
  updateStudent,
  deleteStudentById,
} from "../models/student.models.js";

export async function createStudentService(studentData) {
  try {
    const student = createStudent(studentData);
    return student;
  } catch (error) {
    throw new Error("Error while creating student: " + error.message);
  }
}

export async function getAllStudentService(page, limit, search) {
  try {
    const students = await getAllStudent(page, limit, search);
    return students;
  } catch (error) {
    throw new Error("Error while fetching students: " + error.message);
  }
}

export async function getStudentByIdService(id) {
  try {
    const student = await getStudentById(id);
    return student;
  } catch (error) {
    throw new Error("Error while fetching student: " + error.message);
  }
}

export async function updateStudentService(id, studentData) {
  try {
    const student = await updateStudent(id, studentData);
    return student;
  } catch (error) {
    throw new Error("Error while updating student: " + error.message);
  }
}

export async function deleteStudentByIdService(id) {
  try {
    const student = await deleteStudentById(id);
    return student;
  } catch (error) {
    throw new Error("Error while deleting student: " + error.message);
  }
}
