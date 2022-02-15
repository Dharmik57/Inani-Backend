import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import AWS from '../config/aws.config';

const { region, secretAccessKey, accessKeyId, bucketName } = AWS;
aws.config.update({
    secretAccessKey,
    accessKeyId,
    region
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); //use Date.now() for unique file keys
        }
    })
});

export default upload;