const db = require("../data/database");
const bcrypt = require("bcryptjs");

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    async findUser() {
        const user = await db.getDb().collection("users").findOne({
            email: this.email,
        });
        return user;
    }

    async userExist() {
        const existingUser = await this.findUser();

        if (existingUser) {
            return true;
        } else {
            return false;
        }
    }

    async createUser() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        const user = await db.getDb().collection("users").insertOne({
            email: this.email,
            password: hashedPassword,
        });

        return user;
    }

    async login(comparePassword) {
        const passwordsAreEqual = await bcrypt.compare(
            this.password,
            comparePassword
        );
        return passwordsAreEqual;
    }
}

module.exports = User;
