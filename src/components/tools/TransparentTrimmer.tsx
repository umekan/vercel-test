"use client";

import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Divider,
  Slider,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import CropIcon from '@mui/icons-material/Crop';

export default function TransparentTrimmer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings
  const [threshold, setThreshold] = useState(0);
  const [padding, setPadding] = useState(0);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTrimTransparentAreas = () => {
    if (!originalImage || !canvasRef.current) return;
    
    setIsProcessing(true);
    setError(null);
    
    // Simulate processing (in a real app, this would be your actual image processing logic)
    setTimeout(() => {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        const img = new Image();
        img.onload = () => {
          // This is where you would implement the actual transparent area trimming
          // For demonstration, we're just drawing the image with some modifications
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Clear canvas first
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the image
          ctx.drawImage(img, 0, 0);
          
          // For demonstration, add a border to show the trimming effect
          // In a real implementation, you would analyze the image pixels and trim accordingly
          const border = 20 + padding;
          
          // Create a new, smaller canvas
          const trimmedCanvas = document.createElement('canvas');
          const trimmedCtx = trimmedCanvas.getContext('2d');
          
          if (!trimmedCtx) {
            throw new Error('Could not create trimmed canvas context');
          }
          
          trimmedCanvas.width = img.width - (border * 2);
          trimmedCanvas.height = img.height - (border * 2);
          
          // Draw the trimmed image
          trimmedCtx.drawImage(
            canvas, 
            border, border, 
            canvas.width - (border * 2), canvas.height - (border * 2),
            0, 0, 
            trimmedCanvas.width, trimmedCanvas.height
          );
          
          // Set the processed image
          setProcessedImage(trimmedCanvas.toDataURL('image/png'));
          setIsProcessing(false);
        };
        
        img.src = originalImage;
        
      } catch (err) {
        setError('Failed to process image');
        setIsProcessing(false);
        console.error(err);
      }
    }, 1000); // Simulate processing time
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'trimmed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transparent Area Trimmer
      </Typography>
      
      <Typography variant="body1" paragraph>
        This tool automatically detects and trims transparent areas from your images.
        Upload a PNG with transparency to get started.
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
              Settings
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Transparency Threshold</Typography>
              <Slider
                value={threshold}
                onChange={(_, value) => setThreshold(value as number)}
                min={0}
                max={255}
                valueLabelDisplay="auto"
                disabled={!originalImage}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Padding (px)</Typography>
              <Slider
                value={padding}
                onChange={(_, value) => setPadding(value as number)}
                min={0}
                max={50}
                valueLabelDisplay="auto"
                disabled={!originalImage}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={preserveAspectRatio}
                  onChange={(e) => setPreserveAspectRatio(e.target.checked)}
                  disabled={!originalImage}
                />
              }
              label="Preserve Aspect Ratio"
            />
            
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
                Upload Image
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<CropIcon />}
                onClick={handleTrimTransparentAreas}
                disabled={!originalImage || isProcessing}
                fullWidth
                sx={{ mb: 2 }}
              >
                {isProcessing ? <CircularProgress size={24} /> : 'Trim Transparent Areas'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!processedImage}
                fullWidth
              >
                Download Result
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Preview area */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, flexGrow: 1 }}>
              <Box sx={{ flex: 1, minWidth: '280px' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Original Image
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xOdTWsmQAAAAbSURBVDhPYxgFo2AUjALyQGhoKBsDwyiAAQYGADr3A2bOAEkgAAAAAElFTkSuQmCC")',
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
                      Upload an image to get started
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Divider orientation="vertical" flexItem />
              
              <Box sx={{ flex: 1, minWidth: '280px' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Processed Image
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xOdTWsmQAAAAbSURBVDhPYxgFo2AUjALyQGhoKBsDwyiAAQYGADr3A2bOAEkgAAAAAElFTkSuQmCC")',
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
                      Process an image to see the result
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