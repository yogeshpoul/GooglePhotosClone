import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const S3Uploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageName, setImageName] = useState('');
    const [imageUrls, setImageUrls] = useState([]);  // State to store image URLs

    useEffect(() => {
        // Fetch the image URLs when the component mounts
        const fetchImageUrls = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/getImageURI', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setImageUrls(response.data.photoUrls);  // Set the image URLs
            } catch (error) {
                console.error('Error fetching image URLs:', error);
            }
        };

        fetchImageUrls();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setImageName(event.target.files[0].name);  
    };

    const uploadFile = async () => {
        try {
            const signedUrl = await axios.post("http://localhost:3000/api/v1/upload-photo", {
                type: selectedFile.type,
                imageName
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            const options = {
                method: 'PUT',
                body: selectedFile
            };
            await fetch(signedUrl.data.url, options);

            await axios.post("http://localhost:3000/api/v1/saveImageDb", {
                imageName,
                photoKey: signedUrl.data.photoKey
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>

            <div>
                {imageUrls.map((image, index) => (
                    <img key={index} src={image.imageUrl} alt={`Image ${index}`} style={{ width: '300px', margin: '10px' }} />
                ))}
            </div>
        </div>
    );
};
