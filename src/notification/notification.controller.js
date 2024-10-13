const e = require('express');
const pool = require('../../database');


// Add notification schedule for user
exports.addSchedule = async (req, res) => {
    const { id, userId, bookId, notificationDateTime, repeatType, active } = req.body;

    try {
        const addResult = await pool.query(
            `INSERT INTO account.notifications (id, user_id, book_id, date_time, repeat_type, active)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, userId, bookId, notificationDateTime, repeatType, active]
        )

        if (addResult.rows.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Error insert schedule into notifications table"
            });
        }

        res.status(200).json({
            success: true,
            message: "Add notification schedule successfully!"
        });
    } catch (error) {
        console.error("Add schedule error: ", error);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

// Change the state (activate/deactivate) of the notification
exports.activate = async (req, res) => {
    const { active, id } = req.body;

    try {
        const activateResult = await pool.query(
            `UPDATE account.notifications 
            SET active = $1 
            WHERE id = $2`,
            [active, id]
        )

        if (activateResult.rows.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "(De)activate notification successfully!"
        });
    } catch (error) {
        console.error("Activate notification error: ", error);
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}

// Delete a notification by id
exports.delete = async (req, res) => {
    const id = req.body;

    try {
        const activateResult = await pool.query(
            `DELETE FROM account.notifications 
            WHERE id = $1`,
            [id]
        )

        if (activateResult.rows.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Delete notification successfully!"
        });
    } catch (error) {
        console.error("Delete notification error: ", error);
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}

// Get all notification of an user
exports.fetch = async (req, res) => {
    const userId = req.query.user;

    try {
        const fetchResult = await pool.query(
            `SELECT * FROM account.notifications 
            WHERE user_id = $1`,
            [userId]
        )

        if (activateResult.rows.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "User notification not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Fetch notification successfully!",
            notifications: fetchResult.rows
        });
    } catch (error) {
        console.error("Fetch notification error: ", error);
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}

// Delete all notification of an user
exports.deleteAll = async (req, res) => {
    const userId = req.body;

    try {
        const deleteResult = await pool.query(
            `DELETE FROM account.notifications 
            WHERE user_id = $1`,
            [userId]
        );

        if (deleteResult.rows.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "User notification not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Delete all notifications successfully!"
        });
    } catch (error) {
        console.error("Delete all notification error: ", error);
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}