"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const User = require('../models/user')
const Token = require('../models/token')
const passwordEncrypt = require('../helpers/passwordEncrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    login: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get Token and JWT.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                }
            }
        */

        try {
            const { username, email, password } = req.body

            // Validation
            if (!(username || email) || !password) {
                return res.status(400).send({
                    error: true,
                    message: 'Please enter username/email and password.'
                })
            }

            // Find user
            const user = await User.findOne({ $or: [{ email }, { username }] })
            
            if (!user) {
                return res.status(401).send({
                    error: true,
                    message: 'Wrong username/email or password.'
                })
            }

            // Check password
            const encryptedPassword = passwordEncrypt(password)
            if (user.password !== encryptedPassword) {
                return res.status(401).send({
                    error: true,
                    message: 'Wrong username/email or password.'
                })
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).send({
                    error: true,
                    message: 'This account is not active.'
                })
            }

            // Create or get Simple Token
            let tokenData = await Token.findOne({ userId: user._id })
            if (!tokenData) {
                tokenData = await Token.create({
                    userId: user._id,
                    token: passwordEncrypt(user._id + Date.now())
                })
            }

            // Create JWT tokens (for extra security)
            const accessToken = jwt.sign(
                { 
                    userId: user._id,
                    email: user.email,
                    isAdmin: user.isAdmin 
                }, 
                process.env.ACCESS_KEY || 'access-secret-key', 
                { expiresIn: '30m' }
            )
            
            const refreshToken = jwt.sign(
                { _id: user._id },
                process.env.REFRESH_KEY || 'refresh-secret-key', 
                { expiresIn: '3d' }
            )

            // ✅ GÜVENLİ ve FRONTEND-UYUMLU RESPONSE
            res.status(200).send({
                error: false,
                message: 'Login successful',
                token: tokenData.token,      // Simple token (frontend bunu kullanacak)
                bearer: {                    // JWT tokens (optional extra security)
                    accessToken,
                    refreshToken
                },
                user: {                      // ✅ SADECE GEREKLİ ALANLAR - GÜVENLİ
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isActive: user.isActive
                    // Password ve diğer hassas alanlar YOK!
                }
            })

        } catch (error) {
            console.error('Login error:', error)
            
            // Handle thrown errors from the code
            if (error.message.includes('account is not active') || 
                error.message.includes('Wrong username') ||
                error.message.includes('Please enter')) {
                
                return res.status(401).send({
                    error: true,
                    message: error.message
                })
            }
            
            // Generic server error
            res.status(500).send({
                error: true,
                message: 'Internal server error'
            })
        }
    },

    refresh: async (req, res) => {
        /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'JWT: Refresh'
            #swagger.description = 'Refresh access-token by refresh-token.'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    bearer: {
                        refresh: '___refreshToken___'
                    }
                }
            }
        */

        try {
            const refreshToken = req.body?.bearer?.refreshToken

            if (!refreshToken) {
                return res.status(400).send({
                    error: true,
                    message: 'Please provide refresh token'
                })
            }

            jwt.verify(refreshToken, process.env.REFRESH_KEY || 'refresh-secret-key', async (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        error: true,
                        message: 'Invalid refresh token'
                    })
                }

                const user = await User.findById(decoded._id)
                if (!user || !user.isActive) {
                    return res.status(401).send({
                        error: true,
                        message: 'User not found or inactive'
                    })
                }

                // Create new access token
                const newAccessToken = jwt.sign(
                    { 
                        userId: user._id,
                        email: user.email,
                        isAdmin: user.isAdmin 
                    },
                    process.env.ACCESS_KEY || 'access-secret-key',
                    { expiresIn: '30m' }
                )

                res.send({
                    error: false,
                    bearer: { 
                        accessToken: newAccessToken 
                    }
                })
            })

        } catch (error) {
            console.error('Refresh error:', error)
            res.status(500).send({
                error: true,
                message: 'Internal server error'
            })
        }
    },

    logout: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Token: Logout"
            #swagger.description = 'Delete token-key.'
        */

        try {
            const auth = req.headers?.authorization || null
            let message = null
            let result = {}

            if (auth) {
                const tokenKey = auth.split(' ')
                
                if (tokenKey[0] === 'Token') {
                    // Delete Simple Token
                    result = await Token.deleteOne({ token: tokenKey[1] })
                    message = 'Token deleted. Logout successful.'
                } else if (tokenKey[0] === 'Bearer') {
                    // For JWT, just inform client to delete tokens
                    message = 'Please delete JWT tokens from client storage.'
                } else {
                    message = 'Invalid authorization format.'
                }
            } else {
                message = 'No authorization token provided.'
            }

            res.send({
                error: false,
                message,
                result
            })

        } catch (error) {
            console.error('Logout error:', error)
            res.status(500).send({
                error: true,
                message: 'Internal server error'
            })
        }
    }

}