const services = require('../services/index')

const consumer = (event, context, callback) => {

    try {

        const { statusCode, body } = services.consumer()

        return callback(null, { 
            statusCode: statusCode, 
            body: body
        })

    } catch (error) {

        return callback(null, { 
            statusCode: 500, 
            body: JSON.stringify(error) 
        })

    }

}

const sender = (event, context, callback) => {

    try {

        const { statusCode, body } = services.sender()

        return callback(null, { 
            statusCode: statusCode, 
            body: body
        })

    } catch (error) {

        return callback(null, { 
            statusCode: 500, 
            body: JSON.stringify(error) 
        })

    }

}

module.exports = {
    consumer: consumer,
    sender: sender
}