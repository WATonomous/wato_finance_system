const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const s3Client = new S3Client({
    region: 'us-east-2',
})

// for now, store files in memory as we are only handling small files
const getS3FileKey = (referenceCode, filename) => {
    return `${referenceCode}-${filename}`
}

const deleteS3File = (bucket, key) => {
    const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    })
    return s3Client.send(deleteCommand)
}

module.exports = {
    s3Client,
    getS3FileKey,
    deleteS3File,
}
