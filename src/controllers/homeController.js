const { getFormattedDateTime } = require('../utils/formatDateTime');
const { hora, data } = getFormattedDateTime();
exports.home = (req, res) => {
    
    res.send(`<strong>A API foi aberta na data ${data}, as ${hora}</strong>`);
};