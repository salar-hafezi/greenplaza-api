const retrieveOneWithMobile = async ({ db, mobile }) => {
    const query = 'SELECT * FROM users WHERE mobile = $1';
    const values = [mobile];
    const res = await db.query(query, values);
    return res.rows[0];
};

const createNew = async ({ db, first_name, last_name, mobile, password_hash, status, type }) => {
    const query = `
        INSERT INTO users(first_name, last_name, mobile, password_hash, status, type, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const now = new Date();
    const values = [first_name, last_name, mobile, password_hash, status, type, now, now];
    const res = await db.query(query, values);
    return res.rows[0];
};

const updateConfirmOtac = async ({ db, confirm_req_attempts, confirm_req_otac, mobile }) => {
    const query = `
        UPDATE users SET
        updated_at = $1,
        last_confirm_req = $2,
        confirm_req_attempts = $3,
        confirm_req_otac = $4
        WHERE mobile = $5
        RETURNING *
    `;
    const now = new Date();
    const values = [now, now, confirm_req_attempts, confirm_req_otac, mobile];
    const res = await db.query(query, values);
    return res.rows[0];
};

const updateConfirmAccount = async ({ db, status, mobile }) => {
    const query = `
        UPDATE users SET
        updated_at = $1,
        status = $2
        WHERE mobile = $3
        RETURNING *
    `;
    const now = new Date();
    const values = [now, status, mobile];
    const res = await db.query(query, values);
    return res.rows[0];
};

module.exports = {
    retrieveOneWithMobile,
    createNew,
    updateConfirmOtac,
    updateConfirmAccount,
};
