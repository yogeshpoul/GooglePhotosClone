import React from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { API_URL } from '../config';

const Modal = ({ selectedMedia, closeImage, handleImageUpdate }) => {
  const fileName = selectedMedia?.photoKey;
  const extension = fileName?.split('.').pop().toLowerCase();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/deleteImage`, {
        params: { photoKey: selectedMedia.photoKey },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      if (response.status === 200) {
        alert('File deleted successfully!');
        closeImage();
        handleImageUpdate(); // Refresh the images after deletion
      } else {
        alert('Failed to delete file.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file.');
    }
  };

  const renderContent = () => {
    if (extension === 'mp4') {
      return (
        <ReactPlayer
          url={selectedMedia.imageUrl}
          controls
          width="90vw"
          height="90vh"
        />
      );
    } else if (extension === 'pdf') {
      return (
        <div className="w-[90vw] h-[90vh]">
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
          className="max-w-[90vw] max-h-[90vh] rounded-lg"
        />
      );
    }
  };

  return (
    selectedMedia && (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={closeImage}
      >
        <div className="relative">
          {renderContent()}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal close on delete click
              handleDelete();
            }}
            className="absolute top-2 right-2 bg-red-400 text-white rounded-full p-2"
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
        </div>
      </div>
    )
  );
};

export default Modal;
