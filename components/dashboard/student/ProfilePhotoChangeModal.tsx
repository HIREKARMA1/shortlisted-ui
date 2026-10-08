'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { validateProfilePhotoFile } from '@/lib/validation/profilePhoto';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

type Step = 'menu' | 'camera' | 'preview';

type ProfilePhotoChangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelected: (file: File) => void;
};

export function ProfilePhotoChangeModal({ isOpen, onClose, onPhotoSelected }: ProfilePhotoChangeModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<Step>('menu');
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const resetState = useCallback(() => {
    stopCamera();
    setStep('menu');
    setError(null);
    setCameraError(null);
    setPendingFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  }, [previewUrl, stopCamera]);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  useEffect(() => {
    if (!isOpen) resetState();
  }, [isOpen, resetState]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    setCameraError(null);
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(t('dashboard.profile.photo.cameraUnavailable'));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setStep('camera');
    } catch {
      setCameraError(t('dashboard.profile.photo.cameraUnavailable'));
    }
  };

  useEffect(() => {
    if (step !== 'camera' || !streamRef.current || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = streamRef.current;
    void video.play().catch(() => {
      setCameraError(t('dashboard.profile.photo.cameraUnavailable'));
      stopCamera();
      setStep('menu');
    });
  }, [step, stopCamera, t]);

  const handleFileChange = (file: File) => {
    const validationError = validateProfilePhotoFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    const url = URL.createObjectURL(file);
    setPendingFile(file);
    setPreviewUrl(url);
    setStep('preview');
    setError(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        stopCamera();
        const file = new File([blob], `profile-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setPendingFile(file);
        setPreviewUrl(url);
        setStep('preview');
      },
      'image/jpeg',
      0.92
    );
  };

  const retake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPendingFile(null);
    setStep('menu');
  };

  const usePhoto = () => {
    if (!pendingFile) return;
    onPhotoSelected(pendingFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
    stopCamera();
    setStep('menu');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('dashboard.profile.photo.modalTitle')}
      maxWidth="md"
    >
      {step === 'menu' && (
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">{t('dashboard.profile.photo.modalHint')}</p>
          {error && <p className="text-sm text-brand-red">{error}</p>}
          {cameraError && <p className="text-sm text-brand-red">{cameraError}</p>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
              e.target.value = '';
            }}
          />
          <Button
            type="button"
            fullWidth
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="justify-center gap-2"
          >
            <Upload className="h-4 w-4" aria-hidden />
            {t('dashboard.profile.photo.upload')}
          </Button>
          <Button
            type="button"
            fullWidth
            variant="secondary"
            onClick={() => void startCamera()}
            className="justify-center gap-2"
          >
            <Camera className="h-4 w-4" aria-hidden />
            {t('dashboard.profile.photo.take')}
          </Button>
          <Button type="button" fullWidth variant="ghost" onClick={handleClose}>
            {t('dashboard.profile.cancel')}
          </Button>
        </div>
      )}

      {step === 'camera' && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-line-default bg-black">
            <video ref={videoRef} className="aspect-[4/3] w-full object-cover" playsInline muted aria-label={t('dashboard.profile.photo.cameraPreview')} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="accent" onClick={capturePhoto}>
              {t('dashboard.profile.photo.capture')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                stopCamera();
                setStep('menu');
              }}
            >
              {t('dashboard.profile.cancel')}
            </Button>
          </div>
        </div>
      )}

      {step === 'preview' && previewUrl && (
        <div className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={t('dashboard.profile.photo.previewAlt')}
            className="mx-auto h-48 w-48 rounded-full border border-line-default object-cover"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="accent" onClick={usePhoto}>
              {t('dashboard.profile.photo.usePhoto')}
            </Button>
            <Button type="button" variant="secondary" onClick={retake}>
              {t('dashboard.profile.photo.retake')}
            </Button>
            <Button type="button" variant="ghost" onClick={handleClose}>
              {t('dashboard.profile.cancel')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
