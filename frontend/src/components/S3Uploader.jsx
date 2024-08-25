import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const S3Uploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageName, setImageName] = useState('');
    const [imageUrls, setImageUrls] = useState([]);  // State to store image URLs
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the image URLs when the component mounts
        const fetchImageUrls = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/getImageURI', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (response.status === 200) {
                    setImageUrls(response.data.photoUrls || []);  // Set the image URLs
                    setError(null);  // Clear any previous errors
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('No data uploaded');  // Set error message for 404
                } else {
                    setError('Error fetching image URLs');  // Generic error message
                }
                setImageUrls([]);  // Clear image URLs in case of error
            }
        };

        fetchImageUrls();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                await axios.get("http://localhost:3000/api/v1/JWTVerifier", {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
            } catch (error) {
                navigate("/");
            }
        }
        fetchData();
    }, [navigate]);

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

            {error ? (
                <p>{error}</p>
            ) : imageUrls.length === 0 ? (
                <p>No images available</p>
            ) : (
            <div>
                {imageUrls.map((image, index) => (
                    <img key={index} src={image.imageUrl} alt={`Image ${index}`} style={{ width: '300px', margin: '10px' }} />
                ))}
            </div>
            )}
        </div>
    );
};
