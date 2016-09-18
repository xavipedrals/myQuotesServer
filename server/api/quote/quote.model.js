'use strict';

import mongoose from 'mongoose';

var QuoteSchema = new mongoose.Schema({
  text: String,
  background_img: String,
  background_color: String,
  like_count: Number,
  created_at: Date,
  //author ref, stored to fasten the server (small RAM) and mongoDB
  author_id: String,
  author_name: String,
  author_photo: String
});

QuoteSchema.pre('save', function (next) {
  this.created_at = new Date();
  this.like_count = 0;
  next();
});

export default mongoose.model('Quote', QuoteSchema);
