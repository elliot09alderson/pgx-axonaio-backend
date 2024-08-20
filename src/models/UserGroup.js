const mongoose = require('mongoose');

const UserGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission',
    }
  ],
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
});

const UserGroup = mongoose.model('UserGroup', UserGroupSchema);

module.exports = UserGroup;
