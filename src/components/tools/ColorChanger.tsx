"use client";

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Slider,
  Alert,
  CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { getTranslations } from '@/lib/i18n';

export default function ColorChanger() {
  const t = getTranslations();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError(t.tools.common.errorSelectImage);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessImage = () => {
    if (!originalImage || !canvasRef.current) return;
    
    setIsProcessing(true);
    setError(null);
    
    // Simulate processing
    setTimeout(() => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error('Canvas not available');
        }
        
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the image
          ctx.drawImage(img, 0, 0);
          
          // Apply color transformations (simplified for demo)
          // In a real implementation, you would manipulate pixels based on hue/saturation/brightness
          ctx.globalCompositeOperation = 'hue';
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          ctx.globalAlpha = saturation / 100;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Apply brightness (simplified)
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1 - brightness / 100;
          ctx.fillStyle = brightness > 100 ? 'white' : 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Reset
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          
          // Set the processed image
          setProcessedImage(canvas.toDataURL('image/png'));
          setIsProcessing(false);
        };
        
        img.src = originalImage;
        
      } catch (err) {
        setError(t.tools.common.errorProcessImage);
        setIsProcessing(false);
        console.error(err);
      }
    }, 1000);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'color-changed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t.tools.colorChanger.name}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {t.tools.colorChanger.description}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Settings panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t.tools.colorChanger.colorSettings}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t.tools.colorChanger.hue}</Typography>
              <Slider
                value={hue}
                onChange={(_, value) => setHue(value as number)}
                min={0}
                max={360}
                valueLabelDisplay="auto"
                disabled={!originalImage}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t.tools.colorChanger.saturation}</Typography>
              <Slider
                value={saturation}
                onChange={(_, value) => setSaturation(value as number)}
                min={0}
                max={200}
                valueLabelDisplay="auto"
                disabled={!originalImage}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t.tools.colorChanger.brightness}</Typography>
              <Slider
                value={brightness}
                onChange={(_, value) => setBrightness(value as number)}
                min={0}
                max={200}
                valueLabelDisplay="auto"
                disabled={!originalImage}
              />
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept="image/*"
              />
              
              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                onClick={() => fileInputRef.current?.click()}
                fullWidth
                sx={{ mb: 2 }}
              >
                {t.tools.common.uploadImage}
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<ColorLensIcon />}
                onClick={handleProcessImage}
                disabled={!originalImage || isProcessing}
                fullWidth
                sx={{ mb: 2 }}
              >
                {isProcessing ? <CircularProgress size={24} /> : t.tools.colorChanger.applyButton}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!processedImage}
                fullWidth
              >
                {t.tools.common.downloadResult}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Preview area */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t.tools.common.preview}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: '280px' }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t.tools.common.originalImage}
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {originalImage ? (
                    <img
                      src={originalImage}
                      alt="Original"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t.tools.common.uploadToStart}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ flex: 1, minWidth: '280px' }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t.tools.common.processedImage}
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {isProcessing ? (
                    <CircularProgress />
                  ) : processedImage ? (
                    <img
                      src={processedImage}
                      alt="Processed"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t.tools.colorChanger.applyToSee}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
            
            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}