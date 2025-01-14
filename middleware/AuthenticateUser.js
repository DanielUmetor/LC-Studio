import 'dotenv/config'
import jwt from 'jsonwebtoken'
const { sign, verify } = jwt

function createToken(user) {
    return sign({
        email_add: user.email_add,
        user_pass: user.user_pass
    },
        process.env.SECRET_KEY,
            { 
                expiresIn: '1hr' 
            }
    )
}

function verifyToken(req, res, next) {
    const token = req?.headers['authorization']
    if(token) {
        if(verify(token, process.env.SECRET_KEY)) {
            next()
        } else {
            res.json({
                status: res.statusCode,
                msg: 'Invalid User Credentials ❌, please provide the correct credentials.'
            })
        }
    } else {
        res.json({
            status: res.statusCode,
            msg: 'Please login'
        })
    }
}

export {
    verifyToken,
    createToken
}