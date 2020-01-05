module.exports = {
    users: {
        ACTION_REQUIRED: 'action (query parameter) is required',
        INVALID_ACTION: 'invalid action (query parameter)',
        ALREADY_EXISTS: 'user already exists',
        NOT_FOUND: 'user not found',
        ALREADY_CONFIRMED: 'user already verified',
        FORBIDDEN: 'user account is not verified',
        INVALID_CREDENTIALS: 'invalid mobile or password',
    },
    server: {
        SERVER_ERROR: 'something went wrong',
        TOO_MANY_REQUESTS: 'too many requests',
        UNPROCESSABLE_ENTITY: 'invalid credentials',
    }
}
