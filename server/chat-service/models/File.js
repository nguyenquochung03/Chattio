const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    message: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    fileType: {
      type: String,
      enum: ["image", "pdf", "doc", "other"],
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
