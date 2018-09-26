function getPart(parts, idx) {

    var part = parts.length > idx ? parts[idx] : 0;

    try {
        part = parseInt(part)
    } catch (e) {
        console.warn('Unconventional part', parts)
    }

    return part;
}

class Version {

    constructor(version) {
        let parts = version.split('.')

        this.major = getPart(parts, 0);
        this.minor =  getPart(parts, 1);
        this.fix = getPart(parts, 2);
    }

    static compare(v1, v2) {

        if (v1.major < v2.major
            || (v1.major == v2.major && v1.minor < v2.minor)
            || (v1.major == v2.major && v1.minor == v2.minor && v1.fix < v2.fix))
            return -1;

        if (v1.major == v2.major && v1.minor == v2.minor && v1.fix== v2.fix)
            return 0;

        return 1;
    }
}

module.exports = Version;