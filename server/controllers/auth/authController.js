const { google } = require('googleapis');
const User = require('../../models/User');
const { generateTokens } = require('../../utils/Auth/jwt');   
const ErrorHandler = require('../../middleware/errorHandler');
const catchAsyncError = require('../../middleware/catchAsyncError');
const oauth2Client = require('../../utils/Auth/oauthClient');
const { default: axios } = require('axios');

exports.googleAuth = catchAsyncError(async (req, res, next) => {
    try {
        const code = req.query.code;
        console.log('Authorization code received');
        console.log(code);

        if (!code) {
            return next(new ErrorHandler('Authorization code is required', 400));
        }

        // Verify environment variables are set
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            return next(new ErrorHandler('Google OAuth configuration missing', 500));
        }

        console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
        console.log('Client Secret set:', !!process.env.GOOGLE_CLIENT_SECRET);

        // Create OAuth2 client
        // const oauth2Client = new google.auth.OAuth2(
        //     process.env.GOOGLE_CLIENT_ID,
        //     process.env.GOOGLE_CLIENT_SECRET,
        //     'postmessage'
        // );

        console.log('Exchanging code for tokens...');
        console.log(oauth2Client);
        // Exchange code for tokens
        const googleRes = await oauth2Client.oauth2Client.getToken(code);
        console.log('googleRes',googleRes);
        console.log('Tokens received successfully');
        console.log(tokens);
        
        oauth2Client.oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )

      

        // Find or create user
        let user = await User.findOne({ email: userRes.data.email });

        if (!user) {
            console.log('Creating new user');
            user = await User.create({
                name: userRes.data.name,
                email: userRes.data.email,
                avatar: userRes.data.picture,
                isVerified: true,
                provider: 'google'
            });
        } else {
            console.log('Existing user found:', user.email);
        }

        // Generate tokens
        const { refreshToken, accessToken } = generateTokens({
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email 
        });

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookies
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 24 * 60 * 60 * 1000,
            secure: isProduction,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax'
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000,
            secure: isProduction,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax'
        });

        res.status(200).json({
            success: true,
            message: 'Google authentication successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
            accessToken: accessToken
        });

    } catch (error) {
        console.error('Google authentication failed:', error.message);
        
        // Specific error handling
        if (error.message.includes('unauthorized_client')) {
            return next(new ErrorHandler('Google OAuth configuration error. Please check your Client ID and Secret in Google Cloud Console.', 500));
        }
        
        return next(new ErrorHandler(`Authentication failed: ${error.message}`, 500));
    }
});