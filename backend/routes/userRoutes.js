const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const router = express.Router();


// ==========================================
// REGISTER USER
// ==========================================

router.post("/register", async (req, res) => {

    console.log("Registration body:", req.body);

    const {
        name,
        email,
        password,
        location
    } = req.body || {};


    try {

        // ==========================================
        // 1. VALIDATE INPUT
        // ==========================================

        if (
            !name ||
            !email ||
            !password ||
            !location
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required."

            });

        }


        // ==========================================
        // 2. CHECK IF EMAIL ALREADY EXISTS
        // ==========================================

        const [existingUsers] =
            await pool.query(

                `
                SELECT user_id
                FROM users
                WHERE email = ?
                `,

                [email]

            );


        if (existingUsers.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "Email is already registered."

            });

        }


        // ==========================================
        // 3. HASH PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ==========================================
        // 4. SAVE USER
        // ==========================================

        const [result] =
            await pool.query(

                `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    location
                )

                VALUES (?, ?, ?, ?)
                `,

                [
                    name,
                    email,
                    hashedPassword,
                    location
                ]

            );


        // ==========================================
        // 5. SUCCESS RESPONSE
        // ==========================================

        res.status(201).json({

            success: true,

            message:
                "Registration successful.",

            user: {

                user_id:
                    result.insertId,

                name,

                email,

                location

            }

        });


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to register user."

        });

    }

});

// ==========================================
// GET USER PROFILE
// ==========================================

router.get("/:id", async (req, res) => {

    const userId = req.params.id;

    try {

        const [users] = await pool.query(
            `
            SELECT
                user_id,
                name,
                email,
                location,
                created_at
            FROM users
            WHERE user_id = ?
            `,
            [userId]
        );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        res.json({

            success: true,

            user: users[0]

        });


    } catch (error) {

        console.error(
            "Get Profile Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to retrieve user profile."

        });

    }

});


// ==========================================
// UPDATE USER PROFILE
// ==========================================

router.put("/:id", async (req, res) => {

    const userId = req.params.id;

    const {
        name,
        email,
        location
    } = req.body || {};


    try {

        // ==========================================
        // 1. VALIDATE INPUT
        // ==========================================

        if (!name || !email || !location) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email, and location are required."

            });

        }


        // ==========================================
        // 2. CHECK IF USER EXISTS
        // ==========================================

        const [users] = await pool.query(
            `
            SELECT user_id
            FROM users
            WHERE user_id = ?
            `,
            [userId]
        );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        // ==========================================
        // 3. CHECK IF EMAIL IS ALREADY USED
        // ==========================================

        const [existingEmail] =
            await pool.query(
                `
                SELECT user_id
                FROM users
                WHERE email = ?
                AND user_id != ?
                `,
                [email, userId]
            );


        if (existingEmail.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "Email is already being used by another user."

            });

        }


        // ==========================================
        // 4. UPDATE USER
        // ==========================================

        await pool.query(
            `
            UPDATE users

            SET
                name = ?,
                email = ?,
                location = ?

            WHERE user_id = ?
            `,
            [
                name,
                email,
                location,
                userId
            ]
        );


        // ==========================================
        // 5. RETURN UPDATED PROFILE
        // ==========================================

        const [updatedUsers] =
            await pool.query(
                `
                SELECT
                    user_id,
                    name,
                    email,
                    location,
                    created_at

                FROM users

                WHERE user_id = ?
                `,
                [userId]
            );


        res.json({

            success: true,

            message:
                "Profile updated successfully.",

            user:
                updatedUsers[0]

        });


    } catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to update user profile."

        });

    }

});

module.exports = router;


// ==========================================
// LOGIN USER
// ==========================================

router.post("/login", async (req, res) => {

    console.log("Login request:", req.body);

    const {
        email,
        password
    } = req.body || {};


    try {

        // ==========================================
        // 1. VALIDATE INPUT
        // ==========================================

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        // ==========================================
        // 2. FIND USER
        // ==========================================

        const [users] =
            await pool.query(

                `
                SELECT
                    user_id,
                    name,
                    email,
                    password,
                    location

                FROM users

                WHERE email = ?
                `,

                [email]

            );


        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const user = users[0];


        // ==========================================
        // 3. CHECK PASSWORD
        // ==========================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // ==========================================
        // 4. LOGIN SUCCESSFUL
        // ==========================================

        res.json({

            success: true,

            message:
                "Login successful.",

            user: {

                user_id:
                    user.user_id,

                name:
                    user.name,

                email:
                    user.email,

                location:
                    user.location

            }

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to login."

        });

    }

});