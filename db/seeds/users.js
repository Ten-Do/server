const knex = require('../knexfile');

module.exports.test = function () {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                { id: 1, name: 'Hettie Marshall', email: 'lantunde@acbo.va', refreshToken: 'sadf' },
                { id: 2, name: 'Hester Owens', email: 'zo@girih.lv', refreshToken: 'sadf' },
                { id: 3, name: 'Henry Jackson', email: 'bekamohi@owo.mt', refreshToken: 'sadf' }
            ]);
        });
};

module.exports.seeds = function () {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                { id: 1, name: 'STEPAN', email: 'lantunde@acbo.va', refreshToken: 'sadf' },
                { id: 2, name: 'Hester Owens', email: 'zo@girih.lv', refreshToken: 'sadf' },
                { id: 3, name: 'Henry Jackson', email: 'bekamohi@owo.mt', refreshToken: 'sadf' }
            ]);
        });
};

module.exports.raitupdate = function () {
    return knex('raiting').del()
        .then(function () {
            // Inserts seed entries
            return knex('raiting').insert([
                { id: 1, points: 39, Reverse: 0, Stegano: 0, Ppc: 9, Forensic: 5, Crypto: 8, Web: 3, Network: 4, Osint: 0 },
                { id: 2, points: 59, Reverse: 21, Stegano: 7, Ppc: 0, Forensic: 3, Crypto: 0, Web: 0, Network: 4, Osint: 24 },
                { id: 3, points: 50, Reverse: 5, Stegano: 12, Ppc: 9, Forensic: 11, Crypto: 2, Web: 3, Network: 7, Osint: 1 },
                { id: 4, points: 60, Reverse: 13, Stegano: 0, Ppc: 0, Forensic: 0, Crypto: 1, Web: 31, Network: 15, Osint: 0 },

            ]);
        });
}