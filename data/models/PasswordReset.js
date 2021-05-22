const mongoose = require('mongoose');
const passwordResetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      token: {
        type: mongoose.Schema.Types.String,
        required: true
      }
    }, {
      timestamps: true
});

passwordResetSchema.index({ 'updatedAt': 1 }, { expireAfterSeconds: 300 });
module.exports = mongoose.model('PasswordReset',passwordResetSchema);
