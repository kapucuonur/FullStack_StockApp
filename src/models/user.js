"use strict"
const { mongoose } = require('../configs/dbConnection')
const bcrypt = require("bcryptjs")

// User Model:
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  isActive: { type: Boolean, default: true },
  isStaff: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
}, {
  collection: 'users',
  timestamps: true
})

// ✅ Şifreyi kaydetmeden önce bcrypt ile hashle
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const isPasswordValidated = this.password
      ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(this.password)
      : true

    if (!isPasswordValidated) {
      return next(new Error("Password is not validated."))
    }

    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// ✅ Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
