import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ImageGallery from '../components/ImageGallery';

export const Dashboard = () => {
    const [imagesUpdated, setImagesUpdated] = useState(false);

    const handleImageUpdate = () => {
        setImagesUpdated(prev => !prev); // Toggle state to refresh images
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar onImageUpload={handleImageUpdate} />
            <ImageGallery onImagesUpdated={imagesUpdated} handleImageUpdate={handleImageUpdate}/>
        </div>
    );
};
