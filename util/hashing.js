const { hash, compare } = require('bcrypt')
const { createHmac } = require('node:crypto')

// hash password controller
exports.dohash = (value, saltValue) => {
    const result = hash(value, saltValue)
    return result
}

// compare password controller
exports.verifyPassword = (value, setValue) => {
    const result = compare(value, setValue);
    return result;
}

exports.hmacProcess = (value, key)=>{
    const result = createHmac('sha256', key).update(value).digest('hex');
    return result;
}
