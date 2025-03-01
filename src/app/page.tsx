'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
  const [newSize, setNewSize] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイルがドロップまたは選択されたときの処理
  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('画像ファイルを選択してください');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        setOriginalImage(img.src);
        setOriginalSize({ width: img.width, height: img.height });
        
        // 画像の処理を実行
        processTrimTransparent(img);
      };
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  };

  // 画像をドラッグしたときのイベントハンドラ
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // 画像をドロップしたときの処理
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // ファイル選択ダイアログからの処理
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // 透明部分をトリミングする処理
  const processTrimTransparent = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // キャンバスサイズを画像サイズに設定
    canvas.width = img.width;
    canvas.height = img.height;
    
    // 画像を描画
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    
    // ピクセルデータを取得
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // 有効なピクセル範囲を特定（透明でないピクセルの範囲）
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;

    // 4バイトごとに処理（RGBA）
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        // アルファ値が0より大きい（透明でない）ピクセルを見つける
        if (data[index + 3] > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
    
    // 有効なピクセルが見つからない場合は処理を終了
    if (minX >= maxX || minY >= maxY) {
      setIsProcessing(false);
      alert('透明でないピクセルが見つかりません');
      return;
    }
    
    // トリミング領域の幅と高さを計算
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    
    // トリミングした画像を新しいキャンバスに描画
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCtx.drawImage(
      canvas,
      minX, minY, width, height,
      0, 0, width, height
    );
    
    // トリミング後の画像をセット
    setProcessedImage(tempCanvas.toDataURL('image/png'));
    setNewSize({ width, height });
    setIsProcessing(false);
  };

  // ダウンロードボタンのハンドラ
  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'trimmed_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">透明部分自動トリミングツール</h1>
      <p className="mb-6">
        ゲームアイコンの透明部分を自動的に検出してトリミングします。
        画像をドラッグ＆ドロップするか、下のボタンからファイルを選択してください。
      </p>
      
      {/* ファイルアップロードエリア */}
      <div 
        className={`border-2 border-dashed p-8 rounded-lg text-center mb-8 
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <p className="mb-4">ここに画像をドラッグ＆ドロップ</p>
        <p>または</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          ファイルを選択
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* 処理中の表示 */}
      {isProcessing && (
        <div className="my-6 text-center">
          <p>処理中...</p>
        </div>
      )}

      {/* 画像の表示エリア */}
      {originalImage && processedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">元の画像</h2>
            {originalSize && (
              <p className="mb-2 text-sm text-gray-600">
                サイズ: {originalSize.width} x {originalSize.height} px
              </p>
            )}
            <div className="border p-2 bg-gray-100 rounded">
              {originalImage && (
                <div 
                  className="max-w-full mx-auto relative"
                  style={{ 
                    background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4zjOaR+AAAAChJREFUOE9jZGBgEAFifOANxH+A+D8QIwMsmlEcQAZGDRg1gPYGMAAAIUenAS1h5RYAAAAASUVORK5CYII=") repeat',
                    width: '100%',
                    height: originalSize ? originalSize.height * (300 / originalSize.width) : 300
                  }}
                >
                  <Image 
                    src={originalImage} 
                    alt="元画像"
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized={true} // Data URLを使用する場合は最適化をオフにする
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">トリミング後</h2>
            {newSize && (
              <p className="mb-2 text-sm text-gray-600">
                サイズ: {newSize.width} x {newSize.height} px
                {originalSize && (
                  <span className="ml-2">
                    ({Math.round((newSize.width * newSize.height) / (originalSize.width * originalSize.height) * 100)}% のサイズ)
                  </span>
                )}
              </p>
            )}
            <div className="border p-2 bg-gray-100 rounded">
              {processedImage && (
                <div 
                  className="max-w-full mx-auto relative"
                  style={{ 
                    background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4zjOaR+AAAAChJREFUOE9jZGBgEAFifOANxH+A+D8QIwMsmlEcQAZGDRg1gPYGMAAAIUenAS1h5RYAAAAASUVORK5CYII=") repeat',
                    width: '100%',
                    height: newSize ? newSize.height * (300 / newSize.width) : 300
                  }}
                >
                  <Image 
                    src={processedImage} 
                    alt="処理後画像"
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized={true} // Data URLを使用する場合は最適化をオフにする
                  />
                </div>
              )}
            </div>
            
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              onClick={handleDownload}
            >
              画像をダウンロード
            </button>
          </div>
        </div>
      )}
      
      {/* 非表示のキャンバス */}
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}