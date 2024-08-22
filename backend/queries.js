const zod = require("zod");
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const JWT_SECRET = "myJWT"
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, userPhotos } = require('./models');
const validations = require('./zodValidation');
const { s3Client, getObjectUrl } = require("./S3AwsMethods");
// const userPhotos = require("./models/userPhotos");
require('dotenv').config();


const uploadPhoto = async (request, response) => {
  const type = request.body.type;
  const imageName = request.body.imageName;
  const email = request.userId;
  const photoKey = `uploads/${email + imageName}.jpg`;

  const command = new PutObjectCommand({
    Bucket: "nodejsprivate",
    Key: photoKey,
    ContentType: type,
  });
  try {
    const url = await getSignedUrl(s3Client, command);
    response.send({ url, photoKey });
  } catch (error) {
    response.status(500).send('Error uploading photo', error);
  }
}

// image registration endpoint
const saveImageDb = async (request, response) => {
  const { imageName, photoKey } = request.body;
  const email = request.userId;
  try {
    const image = await userPhotos.create({ email, imageName, photoKey });
    response.status(201).send({ "message": 'image registered successfully' });
  } catch (error) {
    response.status(500).send({ "message": 'Error registering image', error });
  }
};

const getImageURI = async (request, response) => {
  const email = request.userId;
  try {
    const imagesInfo = await userPhotos.findAll({ where: { email } });

    if (!imagesInfo.length) {
      return response.status(404).json({ message: 'No images found for this email' });
    }

    const photoUrls = await Promise.all(imagesInfo.map(async (imageInfo) => {
      const photoUrl = await getObjectUrl(imageInfo.photoKey);
      return {
        photoKey:imageInfo.photoKey,
        imageUrl: photoUrl
      };
    }));
    response.status(200).json({ photoUrls })
  } catch (error) {
    response.status(500).send({ "message": 'Error getting image' });
  }
}

const deleteImage = async (request, response) => {
  const email = request.userId; // Assuming userId holds the email
  const photoKey = request.query.photoKey; // Extract photoKey from the request body
  console.log("photokey from query",photoKey)
  const command = new DeleteObjectCommand({
    Bucket: "nodejsprivate",
    Key: photoKey,
  });
  try {
    // Find the image record based on email and photoKey
    const imageInfo = await userPhotos.findOne({where: {email: email,photoKey: photoKey}});
    const S3DeleteStatus = await s3Client.send(command);
    if (imageInfo) {
      // If record is found, delete it
      await imageInfo.destroy();
      response.status(200).json({ message: 'Image deleted successfully.',S3DeleteStatus });
    } else {
      response.status(404).json({ message: 'Image not found.' });
    }
  } catch (error) {
    console.error('Error occurred while deleting the image:', error);
    response.status(500).json({ message: 'Internal server error.' });
  }
};


const signup = async (request, response) => {
  const { name, email, password } = request.body;
  try {
    validations.signupBody.parse(request.body);
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ userId: newUser.email }, process.env.JWT_SECRET);
    response.status(201).json({
      message: "User created successfully",
      token: token
    });

  } catch (e) {
    if (e instanceof zod.ZodError) {
      const errorMessages = e.errors.map(err => err.message);
      response.status(500).json({ error: errorMessages });
    } else {
      response.status(500).json({ error: e.errors });
    }
  }
}

const signin = async (request, response) => {
  const { email, password } = request.body;
  try {
    validations.signinBody.parse(request.body);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response.status(401).json({ error: "User does'nt exists Please create account" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.status(401).json({ error: "Enter correct Password" });
    }
    const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET);
    response.status(200).json({
      message: 'Sign-in successful',
      token: token,
    })
  } catch (e) {
    if (e instanceof zod.ZodError) {
      const errorMessages = e.errors.map(err => err.message);
      response.status(500).json({ error: errorMessages });
    } else {
      response.status(500).json({ error: e });
    }
  }
}

const dashboard = async (request, response) => {
  response.json({ message: "this is dashboard" })
}



module.exports = {
  signup,
  signin,
  dashboard,
  uploadPhoto,
  saveImageDb,
  getImageURI,
  deleteImage,
};
