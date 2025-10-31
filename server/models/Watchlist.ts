import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default (mongoose.models.Watchlist as mongoose.Model<any>) || mongoose.model('Watchlist', watchlistSchema);


