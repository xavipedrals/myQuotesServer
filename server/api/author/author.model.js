'use strict';

import mongoose from 'mongoose';

var AuthorSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Author', AuthorSchema);
