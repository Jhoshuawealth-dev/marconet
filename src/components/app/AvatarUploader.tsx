import { useCallback, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Camera, Loader2, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploaderProps {
  currentUrl: string | null;
  fallbackText: string;
  uploading?: boolean;
  onUpload: (file: File) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
  size?: number;
}

// Crops the loaded image at the given pixel area and returns a JPEG Blob.
async function getCroppedBlob(imageSrc: string, area: Area, output = 512): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = imageSrc;
  });
  const canvas = document.createElement("canvas");
  canvas.width = output;
  canvas.height = output;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, output, output);
  return await new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => (b ? res(b) : rej(new Error("Canvas export failed"))), "image/jpeg", 0.9)
  );
}

const MAX_MB = 5;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const AvatarUploader = ({
  currentUrl,
  fallbackText,
  uploading = false,
  onUpload,
  onRemove,
  size = 80,
}: AvatarUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const openPicker = () => inputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      toast({ title: "Unsupported file", description: "Please choose a JPG, PNG or WEBP image.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast({ title: "File too large", description: `Please choose an image under ${MAX_MB} MB.`, variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setRawImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedArea(pixels), []);

  const handleSave = async () => {
    if (!rawImage || !croppedArea) return;
    setSaving(true);
    try {
      const blob = await getCroppedBlob(rawImage, croppedArea);
      const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" });
      await onUpload(file);
      setRawImage(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (err: any) {
      toast({ title: "Crop failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
      <button type="button" onClick={openPicker} disabled={uploading} className="relative group">
        {currentUrl ? (
          <img src={currentUrl} alt="Avatar" style={{ width: size, height: size }} className="rounded-3xl object-cover shadow-elevated" />
        ) : (
          <div style={{ width: size, height: size }} className="rounded-3xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-extrabold text-xl shadow-elevated">
            {fallbackText}
          </div>
        )}
        <div className="absolute inset-0 rounded-3xl bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? <Loader2 className="h-5 w-5 text-background animate-spin" /> : <Camera className="h-5 w-5 text-background" />}
        </div>
      </button>

      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={openPicker} disabled={uploading}
          className="h-8 rounded-full text-[11px] font-semibold gap-1.5">
          <Upload className="h-3 w-3" /> {currentUrl ? "Change" : "Upload"}
        </Button>
        {currentUrl && onRemove && (
          <Button type="button" size="sm" variant="outline" onClick={() => onRemove()} disabled={uploading}
            className="h-8 rounded-full text-[11px] font-semibold gap-1.5 text-destructive hover:text-destructive">
            <Trash2 className="h-3 w-3" /> Remove
          </Button>
        )}
      </div>

      <Dialog open={!!rawImage} onOpenChange={(o) => !o && setRawImage(null)}>
        <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-sm font-bold flex items-center justify-between">
              Adjust your photo
              <button onClick={() => setRawImage(null)} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64 bg-black">
            {rawImage && (
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Zoom</p>
              <Slider min={1} max={3} step={0.01} value={[zoom]} onValueChange={(v) => setZoom(v[0])} />
            </div>
          </div>
          <DialogFooter className="p-4 pt-0 flex gap-2 sm:flex-row">
            <Button variant="outline" className="flex-1 rounded-xl h-10" onClick={() => setRawImage(null)}>
              Cancel
            </Button>
            <Button className="flex-1 rounded-xl h-10 font-bold gradient-primary text-primary-foreground border-0" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarUploader;
