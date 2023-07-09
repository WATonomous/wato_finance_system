const mongoose = require('mongoose')

const { Schema } = mongoose

const FileSchema = new Schema(
    {
        // reference a file by its id
        referenceItem: { type: Number, index: true },
        filename: { type: String, required: true },
        data: { type: Buffer, required: true },
        mimetype: { type: String, required: true },
        isPoDocument: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
)

const File = mongoose.model('File', FileSchema)

module.exports = File
