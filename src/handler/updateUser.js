/**
 * 
 * @author AJ Catambay | Bridging Code 2020
 * 
 */
'use strict'

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateUser = (event, context, callback) => {

    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if( typeof data.task !== 'string' || typeof data.done !== 'boolean') {
        console.error('Value of task or done is invalid');
        const response = {
            statusCode: 400,
            body: JSON.stringify({ "message":"Value of task or done is invalid" })
        }

        return;
    }

    const params = {
        TableName: 'users',
        Key: {
            id: event.pathParameters.id
        },
        ExpressionAttributeValues: {
            ':rln': data.rollno,
            ':spr': data.sprno,
            ':nam': data.name,
            ':eml': data.email,
            ':onm': data.othernames,
            ':dob': data.dob,
            ':anv': data.anniversary,
            ':rel': data.relationship,
            ':nat': data.native,
            ':loc': data.location,
            ':wor': data.work,
            ':soc': data.social,
            ':img': data.img,
            ':clm': data.claimed,
            ':u': datetime
        },
        UpdateExpression: 'set rollno = :rln, sprno = :spr, name = :nam, email = :eml, othernames = :onm, dob = :dob, anniversary = :anv, relationship = :rel, native = :nat, location = :loc, work = :wor, social = :soc, img = :img,claimed = :clm,updatedAt = :u'
    };

    dynamoDb.update(params, (error, data) => {
        if(error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        callback(null, response);
    });
}