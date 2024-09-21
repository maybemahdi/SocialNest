"use client";

import { Dispatch, SetStateAction } from "react";
import React, { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploadProps {
  handleImage: (file: File | null) => void;
  setImageUrl: Dispatch<SetStateAction<string | null>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  handleImage,
  setImageUrl,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.substr(0, 6) === "image/") {
      setImage(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        handleImage(file);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImageUrl(null);
      setPreview(null);
      setError("Please select an image file");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setImageUrl(null);
    setImage(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          preview ? "border-green-500" : "border-gray-300 hover:border-gray-400"
        } transition duration-150 ease-in-out`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={300}
              className="mx-auto rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600 transition duration-150 ease-in-out"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-sm text-gray-500">
              Drag and drop your image here, or click to select
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Select Image
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {image && (
        <p className="mt-2 text-sm text-gray-500">
          File name: {image.name} ({Math.round(image.size / 1024)} KB)
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
