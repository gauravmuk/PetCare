module.exports = {
	'consumerKey': process.env.TWITTER_CONSUMER_KEY || 'hiftMt3bBZ4deOswFQJXKsZpn',
	'consumerSecret': process.env.TWITTER_CONSUMER_SECRET || 'kGBwlQdMT8geqFXqtM6wscdumxbVsr6xYfywnYbmCZBbPWg0ol',
	'callbackUrl': process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/auth/twitter/callback'
}