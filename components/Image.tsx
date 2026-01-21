// components/ImageUpload.tsx
'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { IoImageOutline, IoCloseCircle } from 'react-icons/io5';
import Image from 'next/image';
import { uploadImage } from '@/app/actions/upload';
import Spinner from './Spinner';

interface ImageUploadProps {
  label: string;
  required?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete?: (imageData: {
    url: string;
    // publicId: string;
    // format: string;
    // width: number;
    // height: number;
  }) => void;
  error?: string;
  helperText?: string;
  className?: string;
  previewClassName?: string;
}

export default function ImageUpload({
  label,
  required = false,
  accept = 'image/jpeg,image/jpg,image/png',
  maxSize = 10, // 10MB default
  onUploadComplete,
  error,
  helperText = 'JPG, JPEG, PNG',
  className = '',
  previewClassName = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Process and validate file
  const processFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return fileType === type;
    });

    if (!isValidType) {
      setUploadError(`Please upload a valid file type: ${helperText}`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    setUploadError('');

    try {
      const res = await uploadImage(file);
      console.log("image===", res);

      if (res.success && res.data) {
        onUploadComplete?.(res.data);
      } else {
        setUploadError(res.message || 'Upload failed');
        setPreview(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setUploadError(errorMessage);
      setPreview(null);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Remove image
  const handleRemove = () => {
    setPreview(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={!preview && !isUploading ? handleClick : undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg h-64 flex items-center justify-center
          transition-all duration-200 relative overflow-hidden
          ${preview && !isUploading ? 'border-gray-700' : 'border-[#2a2a2a]'}
          ${!preview && !isUploading ? 'cursor-pointer hover:border-gray-600' : ''}
          ${isDragging ? 'border-[#CCA33A] bg-[#CCA33A]/5' : ''}
          ${error || uploadError ? 'border-red-500' : ''}
          ${isUploading ? 'pointer-events-none opacity-90' : ''}
          ${previewClassName}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={`image-upload-${label.replace(/\s+/g, '-')}`}
          disabled={isUploading}
        />

        {isUploading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center">
            <Spinner size="lg" />
            <p className="text-sm text-gray-600 mt-4">Uploading image...</p>
            <p className="text-xs text-gray-500 mt-1">Please wait</p>
          </div>
        ) : preview ? (
          // Preview Mode
          <div className="relative w-full h-full group">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClick}
                className="px-4 py-2 bg-[#CCA33A] text-white rounded-lg hover:bg-[#b8923a] transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>

            {/* Remove button (always visible on mobile) */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 md:hidden bg-red-500 text-white rounded-full p-1"
            >
              <IoCloseCircle className="text-2xl" />
            </button>
          </div>
        ) : (
          // Upload Mode
          <div className="text-center pointer-events-none">
            <IoImageOutline className="text-4xl text-gray-600 mx-auto mb-3" />
            <p className="text-sm">
              <span className="text-[#CCA33A]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {helperText} less than {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {(error || uploadError) && (
        <p className="text-red-500 text-xs mt-1">{error || uploadError}</p>
      )}
    </div>
  );
}