"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// app.use(authentication):

const jwt = require('jsonwebtoken')
const Token = require('../models/token')

module.exports = async (req, res, next) => {
    try {
        const auth = req.headers?.authorization || null
        
        if (!auth) {
            // No token, continue (public routes will work)
            // But you might want to set req.user = null or undefined
            req.user = null
            return next()
        }

        const tokenKey = auth.split(' ')
        
        if (tokenKey[0] === 'Token') { // SimpleToken
            const tokenData = await Token.findOne({ token: tokenKey[1] }).populate('userId')
            
            if (tokenData && tokenData.userId && tokenData.userId.isActive) {
                // ✅ Only expose necessary fields
                req.user = {
                    _id: tokenData.userId._id,
                    username: tokenData.userId.username,
                    email: tokenData.userId.email,
                    isAdmin: tokenData.userId.isAdmin,
                    isActive: tokenData.userId.isActive
                }
            } else {
                req.user = null
            }

        } else if (tokenKey[0] === 'Bearer') { // JWT
            try {
                const userData = jwt.verify(tokenKey[1], process.env.ACCESS_KEY || 'access-secret-key')
                
                // ✅ Verify user is still active in database
                const User = require('../models/user')
                const user = await User.findById(userData.userId || userData._id)
                
                if (user && user.isActive) {
                    req.user = {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        isActive: user.isActive
                    }
                } else {
                    req.user = null
                }
                
            } catch (err) {
                // JWT verification failed
                req.user = null
            }
        } else {
            req.user = null
        }

        next()
        
    } catch (error) {
        console.error('Authentication middleware error:', error)
        req.user = null
        next()
    }
}