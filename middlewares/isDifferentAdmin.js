const authService = require('../services/auth');

exports.isDifferentAdmin = async function(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1]
    isVerfied = await authService.verifyUser(token);
    if (isVerfied?.id != req.params.id) {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messages: [
            'You cannot perform this action'
        ]
    })
    return 
}