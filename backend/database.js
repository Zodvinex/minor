const mongoose = require('mongoose');
const dns = require('node:dns');

// Use public DNS resolvers to avoid local resolver SRV query refusals.
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function main() {
    const uri = process.env.DB_CRED;

    try {
        await mongoose.connect(uri);
    } catch (err) {
        console.log('error ', err);
        throw err;
    }
}

module.exports = main;