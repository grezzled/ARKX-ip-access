const express = require('express')
const AccessControl = require('express-ip-access-control');

const PORT = process.env.PORT || 5000
const app = express()

const options = {
    mode: 'deny', // Set the mode to 'deny' for IP blacklist or 'allow' for IP whitelist
    denys: [], // Array of IP addresses to block (blacklist) or allow (whitelist)
    allows: [], // Array of IP addresses to allow (whitelist) or block (blacklist)
    forceConnectionAddress: false, // Set to true if you want to use the connection address instead of the real address
    log: function (clientIp, access) {
        console.log(clientIp + (access ? ' accessed.' : ' denied.'));
    },
    statusCode: 401, // HTTP status code to send for denied requests
    redirectTo: 'denied.ejs', // URL to redirect denied requests to (if empty, it will send the status code without redirecting)
    message: 'Unauthorized' // Message to display for denied requests
};

const middleware = AccessControl(options);
app.use(middleware);

app.set('trust proxy', true);

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', { ip: req.ip })
})

app.get('/denied', (req, res) => {
    // const ipAddress = req.headers['x-forwarded-for'] || req.ip;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    res.render('denied', { ip: ipAddress })
})

app.listen(PORT, () => {
    console.log('server is running on http://localhost:5000')
})





