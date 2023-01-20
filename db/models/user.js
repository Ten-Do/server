module.exports = function (user,hashPass,image){
    return {
        name: user.name,
        email: user.email,
        password: hashPass,
        img: image,
        admin: user.admin,
        reverse: user.reverse,
        stegano: user.stegano,
        ppc: user.ppc,
        forensic: user.forensic,
        crypto: user.crypto,
        web: user.web,
        network: user.network,
        osint: user.osint,
    }
}