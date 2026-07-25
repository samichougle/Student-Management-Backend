import pool from "../db/db.js";

export async function createUser(userData) {
  const { name, email, password, role } = userData;

  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
  `;

  const values = [name, email, password, role];

  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function getUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getUserById(id) {
  const query =
    "SELECT id, name, email, role, refresh_token, created_at FROM users WHERE id=$1";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function saveResetPasswordToken(
  userId,
  resetToken,
  resetTokenExpires,
) {
  const query = `
  UPDATE users
  SET reset_password_token = $1,
  reset_password_expires = $2
  WHERE id = $3
  RETURNING id, email;
  `;
  const values = [resetToken, resetTokenExpires, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getUserByResetToken(resetToken) {
  const query = `
  SELECT * 
  FROM users
  WHERE reset_password_token = $1
  AND reset_password_expires > NOW();
  `;

  const values = [resetToken];

  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function updatePassword(userId, hashedPassword) {
  const query = `
  UPDATE users
    SET password = $1,
        reset_password_token = NULL,
        reset_password_expires = NULL
    WHERE id = $2
    RETURNING id, name, email;
  `;
  const values = [hashedPassword, userId];

  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function saveRefreshToken(userId, refreshToken) {
  const query = `
  UPDATE users
  SET refresh_token = $1
  WHERE id = $2
  RETURNING *
  `;
  const result = await pool.query(query, [refreshToken, userId]);
  return result.rows[0];
}

export async function removeRefreshToken(userId) {
  const query = `
  UPDATE users
  SET refresh_token = NULL
  WHERE id = $1
  RETURNING *
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}
