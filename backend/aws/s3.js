const {
    S3Client,
    DeleteObjectCommand,
    GetObjectCommand,
} = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const { HttpRequest } = require('@aws-sdk/protocol-http')
const { formatUrl } = require('@aws-sdk/util-format-url')

const { S3RequestPresigner } = require('@aws-sdk/s3-request-presigner')
const { Hash } = require('@aws-sdk/hash-node')

const s3Client = new S3Client({
    region: 'us-east-2',
})
const presigner = new S3RequestPresigner({
    sha256: Hash.bind(null, 'sha256'),
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
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

const generatePresignedUrl = async (bucket, key) => {
    console.log(bucket)
    console.log(key)
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    })
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return url
    // return formatUrl(await presigner.presign(new HttpRequest(url)))
}

module.exports = {
    s3Client,
    getS3FileKey,
    deleteS3File,
    generatePresignedUrl,
}
