var config = {};

config.authProviders = ['twitter','reddit','facebook','github','fitbit','local']

config.twitter = {};
  config.twitter.consumer_key    =  process.env.TWITTER_CONSUMER_KEY    || '';
  config.twitter.consumer_secret =  process.env.TWITTER_CONSUMER_SECRET || '';

config.reddit = {};
  config.reddit.client_id = process.env.REDDIT_ID || '';
  config.reddit.client_secret = process.env.REDDIT_SECRET || '';

config.facebook = {};
  config.facebook.client_id = process.env.FACEBOOK_ID || '';
  config.facebook.client_secret = process.env.FACEBOOK_SECRET || '';

config.github= {};
  config.github.client_id = process.env.GITHUB_ID || '';
  config.github.client_secret = process.env.GITHUB_SECRET || '';

config.fitbit= {};
  config.fitbit.client_id = process.env.FITBIT_ID || '';
  config.fitbit.client_secret = process.env.FITBIT_SECRET || '';

config.db = {};
  config.db.host = process.env.DB_HOST || '';
  config.db.username = process.env.DB_USERNAME || '';
  config.db.password = process.env.DB_PASSWORD || '';
  config.db.database = process.env.DB_SCHEMA || '';

module.exports = config;
