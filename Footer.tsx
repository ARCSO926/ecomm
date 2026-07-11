import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { groqVisionAnalyze } from "@/lib/groq";
import { supabase } from "@/lib/supabase";

type VisionSearchProps = {
  onKeywords: (keywords: string[]) => void;
};

export function VisionSearch({ onKeywords }: VisionSearchProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (file: File) => {
    setError(null);
    const dataUrl = await fileToDataUrl(file);
    setPreview(dataUrl);
    setIsLoading(true);

    try {
      let keywords: string[];
      try {
        const { data, error } = await supabase.functions.invoke("vision-search", {
          body: { image: dataUrl },
        });
        if (error) throw error;
        keywords = data.keywords;
      } catch {
        keywords = await groqVisionAnalyze(dataUrl);
      }
      onKeywords(keywords);
      setOpen(false);
    } catch (err) {
      setError("Could not analyze the image. Please try a different photo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Search by image">
        <Camera className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search by image</DialogTitle>
            <DialogDescription>
              Upload a photo of an item and we'll find similar products using Groq Vision.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Upload preview" className="w-full rounded-md object-cover max-h-64" />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => setPreview(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input py-10 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Camera className="h-8 w-8" />
                <span className="text-sm">Click to upload an image</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing image...
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
