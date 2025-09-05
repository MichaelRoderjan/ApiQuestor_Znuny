const { getFormattedDateTime } = require('../utils/formatDateTime');

exports.home = (req, res) => {
    const { hora, data } = getFormattedDateTime();
    res.send(`<strong>A API foi aberta na data ${data}, as ${hora}</strong>`);
};