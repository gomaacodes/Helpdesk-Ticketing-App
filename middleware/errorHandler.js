const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}\t${err.name}: ${err.message}`, 'errLog.log')
    console.error(err.stack)

    const status = res.statusCode ? res.statusCode : 500 // server error
    res.status(status)
    res.json({ message: err.message })
}

module.exports = errorHandler