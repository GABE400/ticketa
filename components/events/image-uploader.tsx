'use client';

import { useState } from 'react';
import { IKUpload, IKImage, ImageKitProvider } from 'imagekitio-next';
import { Loader2, Upload, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const authenticator = async () => {
    try {
        const response = await fetch('/api/imagekit/auth');
        if (!response.ok) throw new Error('Failed to authenticate');
        return await response.json();
    } catch (error) {
        throw new Error('ImageKit Authentication failed');
    }
};

interface ImageUploaderProps {
    onUploadSuccess: (url: string) => void;
    currentImage?: string;
}

export default function ImageUploader({ onUploadSuccess, currentImage }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(currentImage || '');

    const onError = (err: any) => {
        console.error("Upload Error:", err);
        setIsUploading(false);
        setUploadProgress(0);
    };

    const onSuccess = (res: any) => {
        setIsUploading(false);
        setUploadProgress(100);
        setPreviewUrl(res.url);
        onUploadSuccess(res.url);
    };

    const onUploadStart = () => {
        setIsUploading(true);
        setUploadProgress(0);
    };

    const onUploadProgress = (progress: any) => {
        setUploadProgress(Math.round(progress.loaded / progress.total * 100));
    };

    if (!publicKey || !urlEndpoint) {
        return (
            <div className="h-48 rounded-3xl border-2 border-dashed border-red-500/20 bg-red-500/5 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-sm font-bold text-red-400">ImageKit Configuration Missing</p>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-2">
                    Please add ImageKit keys to your environment variables.
                </p>
            </div>
        );
    }

    return (
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {previewUrl ? (
                        <motion.div 
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group bg-slate-900"
                        >
                            <img 
                                src={previewUrl} 
                                alt="Event Preview" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm" 
                                    className="rounded-full px-6"
                                    onClick={() => {
                                        setPreviewUrl('');
                                        onUploadSuccess('');
                                    }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                            <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                Ready
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="uploader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative"
                        >
                            <div className={`
                                h-48 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3
                                ${isUploading ? 'border-purple-500/20 bg-purple-500/5' : 'border-white/10 hover:border-purple-500/30 bg-black/40'}
                            `}>
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                                        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-purple-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-purple-400 uppercase tracking-widest">{uploadProgress}% Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-white mb-1">Upload Event Banner</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">JPG, PNG, WEBP (Max 5MB)</p>
                                        </div>
                                        <IKUpload
                                            fileName="event-banner"
                                            useUniqueFileName={true}
                                            validateFile={(file) => file.size < 5000000}
                                            onError={onError}
                                            onSuccess={onSuccess}
                                            onUploadProgress={onUploadProgress}
                                            onUploadStart={onUploadStart}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ImageKitProvider>
    );
}
