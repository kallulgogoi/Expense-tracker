const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,

      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      minlength: 4,
      required: true,
    },
    incomes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "income",
      },
    ],
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "expense",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
