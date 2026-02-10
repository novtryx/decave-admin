// // components/ImageUpload.tsx
// 'use client';

// import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
// import { IoImageOutline, IoCloseCircle } from 'react-icons/io5';
// import Image from 'next/image';
// import { uploadImage } from '@/app/actions/upload';
// import Spinner from './Spinner';
// import imageCompression from 'browser-image-compression';

// interface ImageUploadProps {
//   label: string;
//   required?: boolean;
//   accept?: string;
//   maxSize?: number; // in MB
//   onUploadComplete?: (imageData: {
//     url: string;
//   }) => void;
//   onUploadError?: (error: string) => void;
//   onUploadStart?: () => void;
//   error?: string;
//   helperText?: string;
//   className?: string;
//   previewClassName?: string;
//   initialImage?: string;
//   disabled?: boolean;
// }

// export default function ImageUpload({
//   label,
//   required = false,
//   accept = 'image/jpeg,image/jpg,image/png',
//   maxSize = 10,
//   onUploadComplete,
//   onUploadError,
//   onUploadStart,
//   error,
//   helperText = 'JPG, JPEG, PNG',
//   className = '',
//   previewClassName = '',
//   initialImage,
//   disabled = false,
// }: ImageUploadProps) {
//   const [preview, setPreview] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string>('');
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (initialImage && !preview) {
//       setPreview(initialImage);
//     }
//   }, [initialImage, preview]);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       processFile(file);
//     }
//   };

//   const processFile = async (file: File) => {
//     // Validate file size
//     if (file.size > maxSize * 1024 * 1024) {
//       setUploadError(`File size must be less than ${maxSize}MB`);
//       onUploadError?.((`File size must be less than ${maxSize}MB`));
//       return;
//     }

//     // Validate file type
//     const acceptedTypes = accept.split(",").map(type => type.trim());
//     const isValidType = acceptedTypes.some(type => {
//       if (type.startsWith(".")) {
//         return file.name.toLowerCase().endsWith(type);
//       }
//       return file.type === type;
//     });

//     if (!isValidType) {
//       const errorMsg = `Please upload a valid file type: ${helperText}`;
//       setUploadError(errorMsg);
//       onUploadError?.(errorMsg);
//       return;
//     }

//     setIsUploading(true);
//     setUploadError("");
//     setUploadProgress(10);
//     onUploadStart?.();

//     try {
//       // Step 1: Compress the image
//       console.log('Original file size:', (file.size / 1024).toFixed(2), 'KB');
      
//       const compressionOptions = {
//         maxSizeMB: 0.8, // Compress to max 800KB
//         maxWidthOrHeight: 1920,
//         useWebWorker: true,
//         fileType: file.type,
//         initialQuality: 0.8,
//       };

//       setUploadProgress(30);
//       const compressedFile = await imageCompression(file, compressionOptions);
//       console.log('Compressed file size:', (compressedFile.size / 1024).toFixed(2), 'KB');

//       // Step 2: Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//         setUploadProgress(50);
//       };
//       reader.readAsDataURL(compressedFile);

//       // Step 3: Upload to Cloudinary with timeout
//       setUploadProgress(60);
      
//       // Create a timeout promise
//       const uploadPromise = uploadImage(compressedFile);
//       const timeoutPromise = new Promise((_, reject) => 
//         setTimeout(() => reject(new Error('Upload timeout - please try again')), 30000) // 30 second timeout
//       );

//       const res = await Promise.race([uploadPromise, timeoutPromise]);
      
//       setUploadProgress(90);
//       console.log("Upload response:", res);

//       // Handle response
//       if (typeof res === "string") {
//         // Success - res is the image URL
//         setUploadProgress(100);
//         onUploadComplete?.({ url: res });
//         setUploadError("");
//       } else if (res && typeof res === "object" && "error" in res) {
//         // Error response
//         const errorMsg = res.error || "Upload failed";
//         // setUploadError(errorMsg);
//         // setPreview(null);
//         // onUploadError?.(errorMsg);
//         if (!isValidType) {
//   const errorMsg: string = `Please upload a valid file type: ${helperText}`; // ✅ Add explicit type
//   setUploadError(errorMsg);
//   onUploadError?.(errorMsg);
//   return;
// }
//       } else {
//         throw new Error("Invalid response from upload");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
      
//       let errorMessage = "Upload failed. Please try again.";
      
//       if (err instanceof Error) {
//         if (err.message.includes('timeout')) {
//           errorMessage = "Upload timeout. Please check your connection and try a smaller image.";
//         } else if (err.message.includes('network')) {
//           errorMessage = "Network error. Please check your internet connection.";
//         } else {
//           errorMessage = err.message;
//         }
//       }
      
//       setUploadError(errorMessage);
//       setPreview(null);
//       onUploadError?.(errorMessage);
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isUploading && !disabled) {
//       setIsDragging(true);
//     }
//   };

//   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     if (isUploading || disabled) return;

//     const file = e.dataTransfer.files?.[0];
//     if (file) {
//       processFile(file);
//     }
//   };

//   const handleRemove = () => {
//     setPreview(null);
//     setUploadError('');
//     setUploadProgress(0);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleClick = () => {
//     if (!isUploading && !disabled) {
//       fileInputRef.current?.click();
//     }
//   };

//   return (
//     <div className={className}>
//       <label className="block text-sm mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>

//       <div
//         onClick={!preview && !isUploading && !disabled ? handleClick : undefined}
//         onDragEnter={handleDragEnter}
//         onDragLeave={handleDragLeave}
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         className={`
//           border-2 border-dashed rounded-lg h-64 flex items-center justify-center
//           transition-all duration-200 relative overflow-hidden
//           ${preview && !isUploading ? 'border-gray-700' : 'border-[#2a2a2a]'}
//           ${!preview && !isUploading && !disabled ? 'cursor-pointer hover:border-gray-600' : ''}
//           ${isDragging ? 'border-[#CCA33A] bg-[#CCA33A]/5' : ''}
//           ${error || uploadError ? 'border-red-500' : ''}
//           ${isUploading || disabled ? 'pointer-events-none opacity-90' : ''}
//           ${previewClassName}
//         `}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept={accept}
//           onChange={handleFileChange}
//           className="hidden"
//           id={`image-upload-${label.replace(/\s+/g, '-')}`}
//           disabled={isUploading || disabled}
//         />

//         {isUploading ? (
//           // Loading State with Progress
//           <div className="flex flex-col items-center justify-center">
//             <Spinner size="lg" />
//             <p className="text-sm text-gray-400 mt-4">
//               {uploadProgress < 50 ? 'Compressing image...' : 'Uploading...'}
//             </p>
//             <div className="w-48 h-2 bg-gray-800 rounded-full mt-3 overflow-hidden">
//               <div 
//                 className="h-full bg-[#CCA33A] transition-all duration-300"
//                 style={{ width: `${uploadProgress}%` }}
//               />
//             </div>
//             <p className="text-xs text-gray-500 mt-2">{uploadProgress}%</p>
//           </div>
//         ) : preview ? (
//           // Preview Mode
//           <div className="relative w-full h-full group">
//             <Image
//               src={preview}
//               alt="Preview"
//               fill
//               className="object-contain"
//             />
            
//             {!disabled && (
//               <>
//                 {/* Overlay on hover */}
//                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
//                   <button
//                     type="button"
//                     onClick={handleClick}
//                     className="px-4 py-2 bg-[#CCA33A] text-white rounded-lg hover:bg-[#b8923a] transition-colors"
//                   >
//                     Change
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleRemove}
//                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                   >
//                     Remove
//                   </button>
//                 </div>

//                 {/* Remove button (always visible on mobile) */}
//                 <button
//                   type="button"
//                   onClick={handleRemove}
//                   className="absolute top-2 right-2 md:hidden bg-red-500 text-white rounded-full p-1"
//                 >
//                   <IoCloseCircle className="text-2xl" />
//                 </button>
//               </>
//             )}
//           </div>
//         ) : (
//           // Upload Mode
//           <div className="text-center pointer-events-none">
//             <IoImageOutline className="text-4xl text-gray-600 mx-auto mb-3" />
//             <p className="text-sm">
//               <span className="text-[#CCA33A]">Click to upload</span> or drag and drop
//             </p>
//             <p className="text-xs text-gray-600 mt-1">
//               {helperText} less than {maxSize}MB
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//               Images will be compressed automatically
//             </p>
//           </div>
//         )}
//       </div>

//       {(error || uploadError) && (
//         <p className="text-red-500 text-xs mt-1">{error || uploadError}</p>
//       )}
//     </div>
//   );
// }


// // components/ImageUpload.tsx
// // 'use client';

// // import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
// // import { IoImageOutline, IoCloseCircle } from 'react-icons/io5';
// // import Image from 'next/image';
// // import { uploadImage } from '@/app/actions/upload';
// // import Spinner from './Spinner';
// // import imageCompression from 'browser-image-compression';

// // interface ImageUploadProps {
// //   label: string;
// //   required?: boolean;
// //   accept?: string;
// //   maxSize?: number; // in MB
// //   onUploadComplete?: (imageData: {
// //     url: string;
// //   }) => void;
// //   onUploadError?: (error: string) => void;
// //   onUploadStart?: () => void;
// //   error?: string;
// //   helperText?: string;
// //   className?: string;
// //   previewClassName?: string;
// //   initialImage?: string;
// //   disabled?: boolean;
// // }

// // export default function ImageUpload({
// //   label,
// //   required = false,
// //   accept = 'image/jpeg,image/jpg,image/png',
// //   maxSize = 10,
// //   onUploadComplete,
// //   onUploadError,
// //   onUploadStart,
// //   error,
// //   helperText = 'JPG, JPEG, PNG',
// //   className = '',
// //   previewClassName = '',
// //   initialImage,
// //   disabled = false,
// // }: ImageUploadProps) {
// //   const [preview, setPreview] = useState<string | null>(null);
// //   const [isDragging, setIsDragging] = useState(false);
// //   const [isUploading, setIsUploading] = useState(false);
// //   const [uploadError, setUploadError] = useState<string>('');
// //   const [uploadProgress, setUploadProgress] = useState<number>(0);
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   useEffect(() => {
// //     if (initialImage && !preview) {
// //       setPreview(initialImage);
// //     }
// //   }, [initialImage, preview]);

// //   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       processFile(file);
// //     }
// //   };

// //   const processFile = async (file: File) => {
// //     // Validate file type FIRST
// //     const acceptedTypes = accept.split(",").map(type => type.trim());
// //     const isValidType = acceptedTypes.some(type => {
// //       if (type.startsWith(".")) {
// //         return file.name.toLowerCase().endsWith(type);
// //       }
// //       return file.type === type;
// //     });

// //     if (!isValidType) {
// //       const errorMsg = `Please upload a valid file type: ${helperText}`;
// //       setUploadError(errorMsg);
// //       onUploadError?.(errorMsg);
// //       return;
// //     }

// //     // Validate file size
// //     if (file.size > maxSize * 1024 * 1024) {
// //       const errorMsg = `File size must be less than ${maxSize}MB`;
// //       setUploadError(errorMsg);
// //       onUploadError?.(errorMsg);
// //       return;
// //     }

// //     setIsUploading(true);
// //     setUploadError("");
// //     setUploadProgress(10);
// //     onUploadStart?.();

// //     try {
// //       // Step 1: Compress the image
// //       console.log('Original file:', file.name, 'Type:', file.type, 'Size:', (file.size / 1024).toFixed(2), 'KB');
      
// //       const compressionOptions = {
// //         maxSizeMB: 0.8, // Compress to max 800KB
// //         maxWidthOrHeight: 1920,
// //         useWebWorker: true,
// //         fileType: file.type, // Preserve original MIME type
// //         initialQuality: 0.8,
// //       };

// //       setUploadProgress(30);
// //       const compressedFile = await imageCompression(file, compressionOptions);
// //       console.log('Compressed file:', compressedFile.name, 'Type:', compressedFile.type, 'Size:', (compressedFile.size / 1024).toFixed(2), 'KB');

// //       // ✅ CRITICAL: Ensure the compressed file has the correct MIME type
// //       // Create a new File object with explicit type if needed
// //       let finalFile = compressedFile;
// //       if (!compressedFile.type || compressedFile.type === 'application/octet-stream') {
// //         console.warn('⚠️ Compressed file lost MIME type, restoring it...');
// //         finalFile = new File([compressedFile], compressedFile.name || file.name, {
// //           type: file.type, // Use original file's MIME type
// //           lastModified: Date.now(),
// //         });
// //         console.log('Fixed file type:', finalFile.type);
// //       }

// //       // Step 2: Create preview (temporary - only show after successful upload)
// //       setUploadProgress(50);

// //       // Step 3: Upload to server with timeout
// //       setUploadProgress(60);
      
// //       console.log('🚀 Starting upload to server with file type:', finalFile.type);
      
// //       // Create a timeout promise
// //       const uploadPromise = uploadImage(finalFile);
// //       const timeoutPromise = new Promise((_, reject) => 
// //         setTimeout(() => reject(new Error('Upload timeout - please try again')), 30000) // 30 second timeout
// //       );

// //       const res = await Promise.race([uploadPromise, timeoutPromise]);
      
// //       setUploadProgress(90);
// //       console.log("📥 Upload response:", res);
// //       console.log("Response type:", typeof res);

// //       // Handle response
// //       if (typeof res === "string") {
// //         // ✅ Success - res is the image URL
// //         console.log('✅ Upload successful! URL:', res);
// //         setUploadProgress(100);
        
// //         // Create preview from the uploaded URL
// //         const reader = new FileReader();
// //         reader.onloadend = () => {
// //           setPreview(reader.result as string);
// //         };
// //         reader.readAsDataURL(finalFile);
        
// //         onUploadComplete?.({ url: res });
// //         setUploadError("");
// //       } else if (res && typeof res === "object" && "error" in res) {
// //         // ❌ Error response - PROPERLY HANDLE IT
// //         console.error('❌ Upload error response:', res.error);
// //         const errorMsg: string = (res.error as string) || "Upload failed";
// //         setUploadError(errorMsg);
// //         setPreview(null);
// //         onUploadError?.(errorMsg);
// //       } else {
// //         console.error('❌ Invalid response format:', res);
// //         throw new Error("Invalid response from upload");
// //       }
// //     } catch (err) {
// //       console.error("❌ Upload error:", err);
      
// //       let errorMessage = "Upload failed. Please try again.";
      
// //       if (err instanceof Error) {
// //         if (err.message.includes('timeout')) {
// //           errorMessage = "Upload timeout. Please check your connection and try a smaller image.";
// //         } else if (err.message.includes('network')) {
// //           errorMessage = "Network error. Please check your internet connection.";
// //         } else {
// //           errorMessage = err.message;
// //         }
// //       }
      
// //       setUploadError(errorMessage);
// //       setPreview(null);
// //       onUploadError?.(errorMessage);
// //     } finally {
// //       setIsUploading(false);
// //       setUploadProgress(0);
// //     }
// //   };

// //   const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     if (!isUploading && !disabled) {
// //       setIsDragging(true);
// //     }
// //   };

// //   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     setIsDragging(false);
// //   };

// //   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //   };

// //   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     setIsDragging(false);

// //     if (isUploading || disabled) return;

// //     const file = e.dataTransfer.files?.[0];
// //     if (file) {
// //       processFile(file);
// //     }
// //   };

// //   const handleRemove = () => {
// //     setPreview(null);
// //     setUploadError('');
// //     setUploadProgress(0);
// //     if (fileInputRef.current) {
// //       fileInputRef.current.value = '';
// //     }
// //   };

// //   const handleClick = () => {
// //     if (!isUploading && !disabled) {
// //       fileInputRef.current?.click();
// //     }
// //   };

// //   return (
// //     <div className={className}>
// //       <label className="block text-sm mb-2">
// //         {label} {required && <span className="text-red-500">*</span>}
// //       </label>

// //       <div
// //         onClick={!preview && !isUploading && !disabled ? handleClick : undefined}
// //         onDragEnter={handleDragEnter}
// //         onDragLeave={handleDragLeave}
// //         onDragOver={handleDragOver}
// //         onDrop={handleDrop}
// //         className={`
// //           border-2 border-dashed rounded-lg h-64 flex items-center justify-center
// //           transition-all duration-200 relative overflow-hidden
// //           ${preview && !isUploading ? 'border-gray-700' : 'border-[#2a2a2a]'}
// //           ${!preview && !isUploading && !disabled ? 'cursor-pointer hover:border-gray-600' : ''}
// //           ${isDragging ? 'border-[#CCA33A] bg-[#CCA33A]/5' : ''}
// //           ${error || uploadError ? 'border-red-500' : ''}
// //           ${isUploading || disabled ? 'pointer-events-none opacity-90' : ''}
// //           ${previewClassName}
// //         `}
// //       >
// //         <input
// //           ref={fileInputRef}
// //           type="file"
// //           accept={accept}
// //           onChange={handleFileChange}
// //           className="hidden"
// //           id={`image-upload-${label.replace(/\s+/g, '-')}`}
// //           disabled={isUploading || disabled}
// //         />

// //         {isUploading ? (
// //           // Loading State with Progress
// //           <div className="flex flex-col items-center justify-center">
// //             <Spinner size="lg" />
// //             <p className="text-sm text-gray-400 mt-4">
// //               {uploadProgress < 50 ? 'Compressing image...' : 'Uploading...'}
// //             </p>
// //             <div className="w-48 h-2 bg-gray-800 rounded-full mt-3 overflow-hidden">
// //               <div 
// //                 className="h-full bg-[#CCA33A] transition-all duration-300"
// //                 style={{ width: `${uploadProgress}%` }}
// //               />
// //             </div>
// //             <p className="text-xs text-gray-500 mt-2">{uploadProgress}%</p>
// //           </div>
// //         ) : preview ? (
// //           // Preview Mode
// //           <div className="relative w-full h-full group">
// //             <Image
// //               src={preview}
// //               alt="Preview"
// //               fill
// //               className="object-contain"
// //             />
            
// //             {!disabled && (
// //               <>
// //                 {/* Overlay on hover */}
// //                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
// //                   <button
// //                     type="button"
// //                     onClick={handleClick}
// //                     className="px-4 py-2 bg-[#CCA33A] text-white rounded-lg hover:bg-[#b8923a] transition-colors"
// //                   >
// //                     Change
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={handleRemove}
// //                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
// //                   >
// //                     Remove
// //                   </button>
// //                 </div>

// //                 {/* Remove button (always visible on mobile) */}
// //                 <button
// //                   type="button"
// //                   onClick={handleRemove}
// //                   className="absolute top-2 right-2 md:hidden bg-red-500 text-white rounded-full p-1"
// //                 >
// //                   <IoCloseCircle className="text-2xl" />
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         ) : (
// //           // Upload Mode
// //           <div className="text-center pointer-events-none">
// //             <IoImageOutline className="text-4xl text-gray-600 mx-auto mb-3" />
// //             <p className="text-sm">
// //               <span className="text-[#CCA33A]">Click to upload</span> or drag and drop
// //             </p>
// //             <p className="text-xs text-gray-600 mt-1">
// //               {helperText} less than {maxSize}MB
// //             </p>
// //             <p className="text-xs text-gray-500 mt-1">
// //               Images will be compressed automatically
// //             </p>
// //           </div>
// //         )}
// //       </div>

// //       {(error || uploadError) && (
// //         <p className="text-red-500 text-xs mt-1">{error || uploadError}</p>
// //       )}
// //     </div>
// //   );
// // }


// components/ImageUpload.tsx
'use client';

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { IoImageOutline, IoCloseCircle } from 'react-icons/io5';
import Image from 'next/image';
import { uploadImage } from '@/app/actions/upload';
import Spinner from './Spinner';
import { ImageData } from '@/store/create-events/EventDetails';

interface ImageUploadProps {
  label: string;
  required?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete?: (imageData: ImageData) => void;

  error?: string;
  helperText?: string;
  className?: string;
  previewClassName?: string;
  initialImage?: string; // Add this prop
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
  initialImage, // Add this
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize preview with initial image if provided
  useEffect(() => {
    if (initialImage && !preview) {
      setPreview(initialImage);
    }
  }, [initialImage, preview]);


  // Process and validate file
  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  const processFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(",").map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type);
      }
      return file.type === type;
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

    // Upload
    setIsUploading(true);
    setUploadError("");

    try {
      const res = await uploadImage(file);
      // console.log("image===", res);



      // 🔑 Narrow the union
      if (typeof res === "string") {
        onUploadComplete?.({ url: res });
      } else if ("error" in res) {
        // error
        setUploadError(res.error || "Upload failed");
        setPreview(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadError(errorMessage);
      setPreview(null);
      console.error("Upload error:", err);
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