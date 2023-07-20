const mongoose = require('mongoose')

const { Schema } = mongoose

const FileSchema = new Schema(
    {
        // currently only support attaching to a ticket (most likely will never have to attach to other things)
        // since ticket id is not unique, use surrogate of item type + id (e.g. PR-12)
        reference_code: { type: String, index: true },
        name: { type: String, required: true },
        location: { type: String, required: true },
        mimetype: { type: String, required: true },
        // receipts, po documents, invoices, etc.
        // anything that will be sent along with the sf reimbursement request
        is_supporting_document: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
)

const File = mongoose.model('File', FileSchema)

module.exports = File
