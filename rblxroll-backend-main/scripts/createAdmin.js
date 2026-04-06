const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/config.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../database/models/User');
const UserSeed = require('../database/models/UserSeed');

const ADMIN_EMAIL = process.argv[2] || 'admin@rblxroll.com';
const ADMIN_PASSWORD = process.argv[3] || 'Admin1234!';

const run = async () => {
    await mongoose.connect(process.env.DATABASE_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    const existing = await User.findOne({ 'local.email': ADMIN_EMAIL });
    if (existing) {
        if (existing.rank !== 'admin') {
            await User.findByIdAndUpdate(existing._id, { rank: 'admin' });
            console.log(`Updated existing user "${ADMIN_EMAIL}" to admin rank.`);
        } else {
            console.log(`User "${ADMIN_EMAIL}" already exists with admin rank.`);
        }
        await mongoose.disconnect();
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const seedsClient = [
        crypto.randomBytes(8).toString('hex'),
        crypto.randomBytes(8).toString('hex')
    ];
    const seedsServer = [
        crypto.randomBytes(24).toString('hex'),
        crypto.randomBytes(24).toString('hex')
    ];
    const hashes = [
        crypto.createHash('sha256').update(seedsServer[0]).digest('hex'),
        crypto.createHash('sha256').update(seedsServer[1]).digest('hex')
    ];

    const userId = new mongoose.Types.ObjectId();

    await Promise.all([
        User.create({
            _id: userId,
            username: 'Admin',
            rank: 'admin',
            local: {
                email: ADMIN_EMAIL,
                password: hashedPassword,
                emailVerified: true
            },
            ips: []
        }),
        UserSeed.create({
            seedClient: seedsClient[0],
            seedServer: seedsServer[0],
            hash: hashes[0],
            nonce: 1,
            user: userId,
            state: 'active'
        }),
        UserSeed.create({
            seedClient: seedsClient[1],
            seedServer: seedsServer[1],
            hash: hashes[1],
            nonce: 1,
            user: userId,
            state: 'created'
        })
    ]);

    console.log(`Admin account created successfully!`);
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`\nYou can override these by passing arguments:`);
    console.log(`  node scripts/createAdmin.js your@email.com yourpassword`);

    await mongoose.disconnect();
};

run().catch(err => {
    console.error('Error creating admin:', err.message);
    process.exit(1);
});
