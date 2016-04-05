module.exports = {
	'appID'			: process.env.FB_APP_ID || '509195005931801',
	'appSecret' 	: process.env.FB_APP_SECRET || 'e8a939fe8230ca0729a8279473ff0825',
	'callbackUrl' 	: process.env.FB_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback'
}