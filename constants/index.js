// app
exports.BASE_URL = '/v1';
exports.SALT_ROUNDS = 10;
// input validations
exports.NAME_MIN_LENGTH = 2;
exports.NAME_MAX_LENGTH = 35;
exports.NAME_REGEX = '^[a-zA-Z]+$';
exports.MOBILE_LENGTH = 10;
exports.MOBILE_REGEX = '^[0-9]+$';
exports.PASSWORD_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,32}$';
exports.OTAC_LENGTH = 8;
// users
exports.users_actions = {
    REGISTER: 'register',
    CONFIRM_ACCOUNT_OTAC: 'confirm-account-otac',
    CONFIRM_ACCOUNT: 'confirm-account',
    LOGIN: 'login',
    RESET_PASSWORD_OTAC: 'reset_password_otac',
    RESET_PASSWORD: 'reset_password'
};
exports.users_statuses = {
    UNCONFIRMED: 'unconfirmed',
    CONFIRMED: 'confirmed'
};
exports.users_types = {
    NORMAL: 'normal',
    ADMIN: 'admin'
};
exports.users_otac_config = {
    CONFIRM_OTAC_ATTEMPTS: 5, // 5 attempts
    CONFIRM_OTAC_INTERVAL: 86400, // per day
};
