import pool from "../db/db.js";

export async function getDashboardStats() {
  const totalStudentsQuery = `
    SELECT COUNT(*) AS count
    FROM student
  `;

  const totalCoursesQuery = `
    SELECT COUNT(DISTINCT course_title) AS count
    FROM student
  `;

  const semesterQuery = `
    SELECT semester, COUNT(*) AS count
    FROM student
    GROUP BY semester
    ORDER BY
      CASE semester
        WHEN 'Semester 1' THEN 1
        WHEN 'Semester 2' THEN 2
        WHEN 'Semester 3' THEN 3
        WHEN 'Semester 4' THEN 4
        WHEN 'Graduate' THEN 5
        ELSE 6
      END
  `;

  const currentMonthQuery = `
    SELECT COUNT(*) AS count
    FROM student
    WHERE enrollment_at >= DATE_TRUNC('month', CURRENT_DATE)
      AND enrollment_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
  `;

  const previousMonthQuery = `
    SELECT COUNT(*) AS count
    FROM student
    WHERE enrollment_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND enrollment_at < DATE_TRUNC('month', CURRENT_DATE)
  `;

  const admissionsQuery = `
    SELECT
      TO_CHAR(months.month, 'Mon') AS month,
      COUNT(student.enrollment_at) AS admissions
    FROM generate_series(
      DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months',
      DATE_TRUNC('month', CURRENT_DATE),
      INTERVAL '1 month'
    ) AS months(month)

    LEFT JOIN student
      ON student.enrollment_at >= months.month
      AND student.enrollment_at < months.month + INTERVAL '1 month'

    GROUP BY months.month
    ORDER BY months.month
  `;

  const [
    totalStudentsResult,
    totalCoursesResult,
    semesterResult,
    currentMonthResult,
    previousMonthResult,
    admissionsResult,
  ] = await Promise.all([
    pool.query(totalStudentsQuery),
    pool.query(totalCoursesQuery),
    pool.query(semesterQuery),
    pool.query(currentMonthQuery),
    pool.query(previousMonthQuery),
    pool.query(admissionsQuery),
  ]);

  const totalStudents = Number(totalStudentsResult.rows[0].count);

  const totalCourses = Number(totalCoursesResult.rows[0].count);

  const currentMonth = Number(currentMonthResult.rows[0].count);

  const previousMonth = Number(previousMonthResult.rows[0].count);

  let growth = 0;

  if (previousMonth > 0) {
    growth = ((currentMonth - previousMonth) / previousMonth) * 100;
  } else if (currentMonth > 0) {
    growth = 100;
  }

  return {
    totalStudents,

    totalCourses,

    currentMonth,

    previousMonth,

    growth: Number(growth.toFixed(1)),

    semesters: semesterResult.rows.map((row) => ({
      semester: row.semester,
      count: Number(row.count),
    })),

    admissions: admissionsResult.rows.map((row) => ({
      month: row.month,
      admissions: Number(row.admissions),
    })),
  };
}
