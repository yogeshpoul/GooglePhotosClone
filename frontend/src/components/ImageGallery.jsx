import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Import PDF.js worker
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { API_URL } from '../config';

// Set the workerSrc
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ImageGallery = ({ onImagesUpdated, handleImageUpdate }) => {
    const [mediaUrls, setMediaUrls] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [error, setError] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        const fetchMediaUrls = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/getImageURI`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (response.status === 200) {
                    const sortedMedia = (response.data.photoUrls || []).sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                    setMediaUrls(sortedMedia);
                    setError(null);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('No data uploaded');
                } else {
                    setError('Error fetching media URLs');
                }
                setMediaUrls([]);
            }
        };

        fetchMediaUrls();
    }, [onImagesUpdated]);

    const openMedia = (media) => {
        setSelectedMedia(media);
    };

    const closeMedia = () => {
        setSelectedMedia(null);
    };

    const getThumbnail = (media) => {
        const extension = media.photoKey.split('.').pop().toLowerCase();

        if (extension === 'mp4') {
            return (
                <video className="w-full h-48 object-cover">
                    <source src={media.imageUrl} type="video/mp4" />
                </video>
            );
        } else if (extension === 'pdf') {
            return (
                <div className="w-full h-48 object-cover">
                    <Viewer fileUrl={media.imageUrl} />
                </div>
            );
        } else {
            return (
                <img
                    src={media.imageUrl}
                    alt="Image Thumbnail"
                    className="w-full h-48 object-cover"
                />
            );
        }
    };

    return (
        <div className='p-2'>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : mediaUrls.length === 0 ? (
                <p>No media available</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaUrls.map((media, index) => (
                        <div key={index} className="relative cursor-pointer" onClick={() => openMedia(media)}>
                            {getThumbnail(media)}
                        </div>
                    ))}
                </div>
            )}
            <Modal selectedMedia={selectedMedia} closeImage={closeMedia} handleImageUpdate={handleImageUpdate} />
        </div>
    );
};

export default ImageGallery;
