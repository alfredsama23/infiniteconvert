interface SettingsProps {
  quality: number;
  backgroundColor: string;
  hasTransparentFiles: boolean;
  onQualityChange: (quality: number) => void;
  onBackgroundColorChange: (color: string) => void;
}

export function Settings({
  quality,
  backgroundColor,
  hasTransparentFiles,
  onQualityChange,
  onBackgroundColorChange
}: SettingsProps) {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg animate-fade-in">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Output Quality
          </h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => onQualityChange(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-900 w-12">
              {quality}%
            </span>
          </div>
        </div>

        {hasTransparentFiles && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Background Color
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                Choose background color for transparent PNGs
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}