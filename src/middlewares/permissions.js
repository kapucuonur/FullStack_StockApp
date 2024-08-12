"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// Middleware: permissions

module.exports = {

    isLogin: (req, res, next) => {
        if (req.user && req.user.isActive) {
            return next()
        }
        return res.status(403).json({ error: true, message: "NoPermission: You must login." })
    },

    isAdmin: (req, res, next) => {
        if (req.user && req.user.isActive && req.user.isAdmin) {
            return next()
        }
        return res.status(403).json({ error: true, message: "NoPermission: You must login and to be Admin." })
    },

    isStaff: (req, res, next) => {
        if (req.user && req.user.isActive && (req.user.isAdmin || req.user.isStaff)) {
            return next()
        }
        return res.status(403).json({ error: true, message: "NoPermission: You must login and to be Staff." })
    },
}
