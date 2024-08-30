import React, { useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { API_URL } from '../config';

const Modal = ({ selectedMedia, closeImage, handleImageUpdate }) => {
    const fileName = selectedMedia?.photoKey;
    const extension = fileName?.split('.').pop().toLowerCase();

    useEffect(() => {
        const handlePopState = () => {
            closeImage();
        };

        if (selectedMedia) {
            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [selectedMedia, closeImage]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/api/v1/deleteImage`, {
                params: { photoKey: selectedMedia.photoKey },
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            if (response.status === 200) {
                alert('File deleted successfully!');
                closeImage();
                handleImageUpdate();
            } else {
                alert('Failed to delete file.');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file.');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this media',
                url: selectedMedia.shareableUrl,
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            alert('Sharing not supported on this browser.');
        }
    };

    const renderContent = () => {
        if (extension === 'mp4') {
            return (
                <ReactPlayer
                    url={selectedMedia.imageUrl}
                    controls
                    width="100vw"
                    height="100vh"
                    style={{ maxHeight: '100vh', maxWidth: '100vw' }}
                />
            );
        } else if (extension === 'pdf') {
            return (
                <div className="w-full h-full">
                    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
                        <Viewer fileUrl={selectedMedia.imageUrl} />
                    </Worker>
                </div>
            );
        } else {
            return (
                <img
                    src={selectedMedia.imageUrl}
                    alt="Full size"
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '100vh', maxWidth: '100vw' }}
                />
            );
        }
    };

    return (
        selectedMedia && (
            <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    {renderContent()}
                    {/* Buttons container */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between">
                        {/* Back Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeImage();
                            }}
                            className="text-white rounded-full p-2 flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z" />
                            </svg>
                        </button>
                        <div className="flex gap-1">
                            {/* Share Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare();
                                }}
                                className="text-white rounded-full p-2 flex items-center justify-center"
                            >
                                <svg width="24px" fill='white' height="24px" viewBox="0 0 24 24"><path d="M18 16c-.79 0-1.5.31-2.03.81L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.53.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.48.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.05 4.12c-.05.22-.09.45-.09.69 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3zm0-12c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="text-white rounded-full p-2"
                            >
                                <svg
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z"></path>
                                </svg>
                            </button>

                            {/* Download Button */}
                            <a
                                href={selectedMedia.imageUrl}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="text-white rounded-full p-2 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M5 20h14v-2H5v2zm7-18l-5 5h4v6h2V7h4l-5-5z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default Modal;
