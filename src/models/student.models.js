import pool from "../db/db.js";

export async function createStudent(studentData) {
  const { first_name, last_name, email, phone_no, course_title, semester } =
    studentData;

  const query = `INSERT INTO student (first_name, last_name, email, phone_no, course_title, semester) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [
    first_name,
    last_name,
    email,
    phone_no,
    course_title,
    semester,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function getStudentById(id) {
  const query = `SELECT * FROM student WHERE id = $1`;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateStudent(id, studentData) {
  const { first_name, last_name, email, phone_no, course_title, semester } =
    studentData;

  const query = `UPDATE student SET first_name = $1, last_name = $2, email = $3, phone_no = $4, course_title = $5, semester = $6 WHERE id = $7 RETURNING *`;
  const values = [
    first_name,
    last_name,
    email,
    phone_no,
    course_title,
    semester,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function deleteStudentById(id) {
  const query = `DELETE FROM student WHERE id = $1 RETURNING *`;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

//Pagination
export async function getAllStudent(page, limit, search = "") {
  const offset = (page - 1) * limit;
  const studentQuery = `
SELECT *
FROM student
WHERE
    first_name ILIKE $1
 OR last_name ILIKE $1
 OR email ILIKE $1
 OR phone_no ILIKE $1
 OR course_title ILIKE $1
 OR semester LIKE $1
 OR TO_CHAR(enrollment_at, 'DD/MM/YYYY') ILIKE $1
ORDER BY id
LIMIT $2 OFFSET $3
`;

  const studentResult = await pool.query(studentQuery, [
    `%${search}%`,
    limit,
    offset,
  ]);

  const totalQuery = `
SELECT COUNT(*) AS count
FROM student
WHERE
    first_name ILIKE $1
 OR last_name ILIKE $1
 OR email ILIKE $1
 OR phone_no ILIKE $1
 OR course_title ILIKE $1
 OR semester LIKE $1
 OR TO_CHAR(enrollment_at, 'DD/MM/YYYY') ILIKE $1
`;

  const totalResult = await pool.query(totalQuery, [`%${search}%`]);

  return {
    students: studentResult.rows,
    total: Number(totalResult.rows[0].count),
  };
}
