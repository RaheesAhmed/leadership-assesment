# Generate a secure NEXTAUTH_SECRET

'Generate a secure NEXTAUTH_SECRET for your Next.js application. There are a few ways to do this:
Using the terminal (OpenSSL):
`openssl rand -base64 32`

Using Node.js in the terminal:
`node -e "console.log(crypto.randomBytes(32).toString('hex'))"`

Or for a quick development secret, you can run this in your browser's console:
`crypto.randomBytes(32).toString('hex')`

Once you have generated the secret, add it to your `.env` file

const { user, isAuthenticated, isLoading } = useAuth();
