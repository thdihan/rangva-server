import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_token_secret: process.env.RESET_TOKEN_SECRET,
        reset_token_expires_in: process.env.RESET_TOKEN_EXPIRES_IN,
    },
    reset_password_link: process.env.RESET_PASSWORD_LINK,
    email: {
        sender: process.env.EMAIL_SENDER,
        app_pass: process.env.EMAIL_APP_PASS,
    },
};
