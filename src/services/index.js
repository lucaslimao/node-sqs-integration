const AWS = require('aws-sdk')
const config = require('config')

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

const queueUrl = config.get('queueUrl')

AWS.config.update({ region: 'us-east-1' })

const consumer = () => {

    try {

        const params = {
            AttributeNames: [
                'SentTimestamp'
            ],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: [
                'All'
            ],
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0
        }
        
        sqs.receiveMessage(params, (err, data) => {
        
            if (err) {
                console.log(err, err.stack)
            } else if (data.Messages) {
        
                console.log('Reading Messages')
        
                console.log(`${JSON.stringify(data.Messages)}`)
        
                var deleteParams = {
                QueueUrl: queueUrl,
                ReceiptHandle: data.Messages[0].ReceiptHandle
                }
        
                sqs.deleteMessage(deleteParams, (err, data) => {
        
                    if (err) {
                        console.log(err, err.stack)
                    } else {
                        console.log('Successfully deleted message from queue')
                    }
        
                })
        
            }
        
        })

        return {
            statusCode: 200,
            body: ''
        }

    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }

    }

}

const sender = () => {

    try {

        const params = {
            DelaySeconds: 10,
            MessageAttributes: {
                "name": {
                    DataType: "String",
                    StringValue: "Lucas Limão"
                },
                "tag": {
                    DataType: "String",
                    StringValue: "lucas.limao"
                }
            },
            MessageBody: "Follow Information",
            QueueUrl: config.get('queueUrl')
        };
        
        sqs.sendMessage(params, function(err, data) {
        
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.MessageId);
            }
        
        })

        return {
            statusCode: 200,
            body: ''
        }

    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }

    }

}

module.exports = {
    consumer,
    sender
}