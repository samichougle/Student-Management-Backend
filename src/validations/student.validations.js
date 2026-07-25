import { z } from "zod";

export const createStudentSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters"),

  email: z.string().trim().email("Invalid email address"),

  phone_no: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  course_title: z.string().min(2, "Course title is required"),

  semester: z.string().min(1, "Semester is required"),
});
