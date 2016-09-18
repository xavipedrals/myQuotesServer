'use strict';

import mongoose from 'mongoose';

var AuthorSchema = new mongoose.Schema({
  id: String,
  name: String,
  photo: String,
  quotes_count: Number,
  created_at: Date
});

AuthorSchema.pre('save', function (next) {
  this.created_at = new Date();
  next();
});

export default mongoose.model('Author', AuthorSchema);
