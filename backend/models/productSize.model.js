const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSizeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
});

module.exports = mongoose.model('ProductSize', productSizeSchema);

