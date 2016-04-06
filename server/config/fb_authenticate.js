module.exports = {
	'appID'			: process.env.FB_APP_ID || '212628289110530',
	'appSecret' 	: process.env.FB_APP_SECRET || '11f88706366d51d37dc0071f42937bea',
	'callbackUrl' 	: process.env.FB_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback'
}