// Localization system for the application

// Define the structure of our translations
export interface Translations {
  common: {
    appName: string;
    imageTools: string;
    home: string;
    help: string;
    about: string;
    openTool: string;
    toolNotFound: string;
    backToHome: string;
    getStarted: string;
  };
  pages: {
    home: {
      title: string;
      subtitle: string;
      selectTool: string;
    };
    notFound: {
      title: string;
      message: string;
    };
  };
  tools: {
    common: {
      settings: string;
      preview: string;
      originalImage: string;
      processedImage: string;
      uploadImage: string;
      downloadResult: string;
      uploadToStart: string;
      errorSelectImage: string;
      errorProcessImage: string;
    };
    transparentTrimmer: {
      name: string;
      description: string;
      transparencyThreshold: string;
      padding: string;
      preserveAspectRatio: string;
      trimButton: string;
      processToSee: string;
    };
    colorChanger: {
      name: string;
      description: string;
      colorSettings: string;
      hue: string;
      saturation: string;
      brightness: string;
      applyButton: string;
      applyToSee: string;
    };
  };
}

// Japanese translations
export const ja: Translations = {
  common: {
    appName: '画像処理ツール',
    imageTools: '画像ツール',
    home: 'ホーム',
    help: 'ヘルプ',
    about: '概要',
    openTool: 'ツールを開く',
    toolNotFound: 'ツールが見つかりません',
    backToHome: 'ホームに戻る',
    getStarted: '始める',
  },
  pages: {
    home: {
      title: '画像処理ツール',
      subtitle: '画像を操作するための便利なツールコレクション',
      selectTool: 'サイドバーまたは上のカードからツールを選択して始めてください。',
    },
    notFound: {
      title: 'ページが見つかりません',
      message: 'お探しのツールまたはページは存在しないか、移動されました。',
    },
  },
  tools: {
    common: {
      settings: '設定',
      preview: 'プレビュー',
      originalImage: '元の画像',
      processedImage: '処理後の画像',
      uploadImage: '画像をアップロード',
      downloadResult: '結果をダウンロード',
      uploadToStart: '画像をアップロードして始めてください',
      errorSelectImage: '画像ファイルを選択してください',
      errorProcessImage: '画像の処理に失敗しました',
    },
    transparentTrimmer: {
      name: '透明部分トリマー',
      description: '画像から透明な領域を自動的に検出して切り取ります',
      transparencyThreshold: '透明度のしきい値',
      padding: '余白 (px)',
      preserveAspectRatio: 'アスペクト比を保持',
      trimButton: '透明部分を切り取る',
      processToSee: '画像を処理して結果を表示',
    },
    colorChanger: {
      name: '色変更ツール',
      description: '色相、彩度、明度コントロールを使用して画像の色を変更します',
      colorSettings: '色の設定',
      hue: '色相',
      saturation: '彩度',
      brightness: '明度',
      applyButton: '色の変更を適用',
      applyToSee: '変更を適用して結果を表示',
    },
  },
};

// Default language
export const defaultLanguage = 'ja';

// Get translations
export function getTranslations(): Translations {
  return ja;
}