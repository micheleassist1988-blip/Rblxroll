const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const User = require('../database/models/User');
const UserSeed = require('../database/models/UserSeed');

const ADMIN_EMAIL = 'kaylenvos07@gmail.com';
const ADMIN_PASSWORD = 'Kayolen!55';

const ensureAdmin = async () => {
    try {
        const existing = await User.findOne({ 'local.email': ADMIN_EMAIL });

        if (existing) {
            if (existing.rank !== 'admin') {
                await User.findByIdAndUpdate(existing._id, { rank: 'admin' });
                console.log(`[Admin] Restored admin rank for ${ADMIN_EMAIL}`);
            }
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
                username: 'Kaylen',
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

        console.log(`[Admin] Admin account created for ${ADMIN_EMAIL}`);
    } catch (err) {
        console.error('[Admin] Failed to ensure admin account:', err.message);
    }
};

module.exports = ensureAdmin;
