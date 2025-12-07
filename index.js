"use strict";
require("express-async-errors");
require("dotenv").config();
// Use the port provided by the host (Render sets PORT env). Fall back to 10000 for local dev.
const PORT = process.env.PORT || 10000;
const express = require("express");
const path = require("node:path");
const punycode = require('punycode'); // npm package

const app = express();

const { dbConnection, mongoose } = require("./src/configs/dbConnection");
dbConnection();

// ✅ TEST için: Database'de kullanıcı kontrolü ve oluşturma
const checkAndCreateTestUser = async () => {
  try {
    const User = require('./src/models/user');
    const passwordEncrypt = require('./src/helpers/passwordEncrypt');
    
    console.log('🔍 Checking for admin user in database...');
    
    // Admin kullanıcısını kontrol et
    let adminUser = await User.findOne({ username: 'admin' });
    
    if (!adminUser) {
      console.log('👤 Admin user not found. Creating...');
      
      adminUser = await User.create({
        username: 'admin',
        password: 'aA?123456', // pre-save middleware encrypt edecek
        email: 'admin@site.com',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        isStaff: true,
        isAdmin: true
      });
      
      console.log('✅ Admin user created successfully');
      console.log('   Username:', adminUser.username);
      console.log('   Email:', adminUser.email);
    } else {
      console.log('✅ Admin user already exists');
      console.log('   Username:', adminUser.username);
      console.log('   Email:', adminUser.email);
    }
    
    // Test için hardcoded login endpoint
    app.post('/api/v1/debug-login', async (req, res) => {
      console.log('🔐 DEBUG LOGIN CALLED');
      
      try {
        const { username, password } = req.body;
        
        if (username === 'admin' && password === 'aA?123456') {
          // Kullanıcıyı bul
          const user = await User.findOne({ username: 'admin' });
          
          if (user) {
            // Token oluştur
            const Token = require('./src/models/token');
            let tokenData = await Token.findOne({ userId: user._id });
            
            if (!tokenData) {
              tokenData = await Token.create({
                userId: user._id,
                token: passwordEncrypt(user._id + Date.now())
              });
            }
            
            res.json({
              error: false,
              message: 'Debug login successful',
              token: tokenData.token,
              user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                isStaff: user.isStaff,
                isAdmin: user.isAdmin
              }
            });
          } else {
            res.status(401).json({ error: true, message: 'User not found' });
          }
        } else {
          res.status(401).json({ 
            error: true, 
            message: 'Use username: admin, password: aA?123456' 
          });
        }
      } catch (error) {
        console.error('Debug login error:', error);
        res.status(500).json({ error: true, message: error.message });
      }
    });
    
    console.log('✅ Debug login endpoint ready: POST /api/v1/debug-login');
    
  } catch (error) {
    console.error('❌ Test user setup failed:', error.message);
  }
};

// 2 saniye sonra test user kontrolünü çalıştır (DB bağlantısı için zaman ver)
setTimeout(checkAndCreateTestUser, 2000);

// ✅ TEST endpoint'i: Database durumunu kontrol et
app.get('/api/v1/debug/db-status', async (req, res) => {
  try {
    const User = require('./src/models/user');
    const userCount = await User.countDocuments();
    
    res.json({
      error: false,
      message: 'Database status',
      dbConnected: mongoose.connection.readyState === 1,
      userCount: userCount,
      adminExists: await User.exists({ username: 'admin' })
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// ✅ Basit test endpoint
app.get('/api/v1/debug/test', (req, res) => {
  res.json({
    error: false,
    message: 'Debug test endpoint working',
    timestamp: new Date(),
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || PORT
  });
});

 //require('./src/helpers/sync')() // !!! It clear database.
