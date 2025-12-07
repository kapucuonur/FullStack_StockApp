"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | DB SEED SCRIPT |
------------------------------------------------------- */

require('dotenv').config()

// Ensure a fallback local MongoDB URI if MONGODB is not set
process.env.MONGODB = process.env.MONGODB || 'mongodb://127.0.0.1:27017/stockapp'

const { dbConnection, mongoose } = require('../configs/dbConnection')

const User = require('../models/user')
const Brand = require('../models/brand')
const Category = require('../models/category')
const Firm = require('../models/firm')
const Product = require('../models/product')
const Purchase = require('../models/purchase')
const Sale = require('../models/sale')

async function upsert(Model, query, data) {
    return Model.findOneAndUpdate(query, { $set: data }, { upsert: true, new: true, setDefaultsOnInsert: true })
}

async function seed() {
    try {
        console.log('Starting DB seed...')

        // Users
        const admin = await upsert(User, { email: 'admin@site.com' }, {
            username: 'admin',
            password: 'aA?123456',
            email: 'admin@site.com',
            firstName: 'Admin',
            lastName: 'User',
            isActive: true,
            isStaff: true,
            isAdmin: true
        })

        const staff = await upsert(User, { email: 'staff@site.com' }, {
            username: 'staff',
            password: 'aA?123456',
            email: 'staff@site.com',
            firstName: 'Staff',
            lastName: 'User',
            isActive: true,
            isStaff: true,
            isAdmin: false
        })

        const test = await upsert(User, { email: 'test@site.com' }, {
            username: 'test',
            password: 'aA?123456',
            email: 'test@site.com',
            firstName: 'Test',
            lastName: 'User',
            isActive: true,
            isStaff: false,
            isAdmin: false
        })

        // Brands
        const brand1 = await upsert(Brand, { name: 'Brand A' }, { name: 'Brand A', image: '' })
        const brand2 = await upsert(Brand, { name: 'Brand B' }, { name: 'Brand B', image: '' })

        // Categories
        const cat1 = await upsert(Category, { name: 'Electronics' }, { name: 'Electronics' })
        const cat2 = await upsert(Category, { name: 'Accessories' }, { name: 'Accessories' })

        // Firms
        const firm1 = await upsert(Firm, { name: 'Supplier One' }, { name: 'Supplier One', phone: '555-0101', address: '123 Market St' })
        const firm2 = await upsert(Firm, { name: 'Supplier Two' }, { name: 'Supplier Two', phone: '555-0202', address: '456 Commerce Ave' })

        // Products
        const product1 = await upsert(Product, { name: 'Widget Pro' }, {
            name: 'Widget Pro',
            categoryId: cat1._id,
            brandId: brand1._id,
            quantity: 100
        })

        const product2 = await upsert(Product, { name: 'Cable X' }, {
            name: 'Cable X',
            categoryId: cat2._id,
            brandId: brand2._id,
            quantity: 200
        })

        // Purchases (create a couple of records) - create only when not present
        const existingPurchase1 = await Purchase.findOne({ productId: product1._id, userId: admin._id })
        if (!existingPurchase1) {
            await Purchase.create({
                userId: admin._id,
                firmId: firm1._id,
                brandId: brand1._id,
                productId: product1._id,
                quantity: 50,
                price: 10
            })
        }

        const existingPurchase2 = await Purchase.findOne({ productId: product2._id, userId: staff._id })
        if (!existingPurchase2) {
            await Purchase.create({
                userId: staff._id,
                firmId: firm2._id,
                brandId: brand2._id,
                productId: product2._id,
                quantity: 100,
                price: 5
            })
        }

        // Sales
        const existingSale1 = await Sale.findOne({ productId: product1._id, userId: test._id })
        if (!existingSale1) {
            await Sale.create({
                userId: test._id,
                brandId: brand1._id,
                productId: product1._id,
                quantity: 10,
                price: 15
            })
        }

        const existingSale2 = await Sale.findOne({ productId: product2._id, userId: test._id })
        if (!existingSale2) {
            await Sale.create({
                userId: test._id,
                brandId: brand2._id,
                productId: product2._id,
                quantity: 20,
                price: 8
            })
        }

        console.log('DB seed finished successfully.')
        process.exit(0)

    } catch (err) {
        console.error('DB seed error:', err)
        process.exit(1)
    }
}

// Start DB and run seed when ready
dbConnection()

mongoose.connection.once('open', () => {
    console.log('* Mongoose connected (seed) *')
    seed()
})

mongoose.connection.on('error', (err) => {
    console.error('* Mongoose connection error (seed) *', err)
})
