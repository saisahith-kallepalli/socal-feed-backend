const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { private, paginate, softDelete } = require("./plugins");
const { roles } = require("../config/roles");
const validatePhoneNumber = require("validate-phone-number-node-js");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    image: { type: String },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: { type: String, required: false },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Others", "None"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    chatrooms: [{ type: Schema.Types.ObjectId, ref: "chatroom" }],
    saved: [{ id: { type: Schema.Types.ObjectId, ref: "post" } }],
    dateOfBirth: { type: String, required: false },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the private plugin
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: { type: Boolean, default: true },
    mobile: {
      type: String,
      validate: [validateNumber, "invalid number"],
    },
  },
  {
    timestamps: true,
  }
);
function validateNumber(value) {
  console.log(value.trim());
  return validatePhoneNumber.validate(value);
}
userSchema.plugin(softDelete);
userSchema.plugin(private);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
