const createError = require('../utils/createError')

exports.getMyAccount = async (req, res, next) => {
    try {
        const { id } = req.user
        console.log('User Id : ', id);
        // look for user
        const rs = 'hello'
        // const rs = await prisma.user.findFirst({ where: { clerkID: id}})
        res.status(200).json({ msg: "My account get", rs})
    } catch (error) {
        next (error)
    }
}

// dummy for now
exports.createUpdateAccount = async (req, res, next) => {
    try {
        console.log('Dummy for update');
        const rs = await 'Updated'
        res.status(200).json({ msg: "Create Update", rs})
    } catch (error) {
        next (error)
    }
}