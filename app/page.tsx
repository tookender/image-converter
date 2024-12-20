"use client";

import JSZip from "jszip";
import { useState } from "react";

import { FaCheck, FaDownload, FaTrashCan } from "react-icons/fa6";
import { Button, LinkButton } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "@/components/ui/select";
import { AiOutlineLoading } from "react-icons/ai";

interface ImageFile {
  file: File;
  downloadUrl?: string;
  loading?: boolean;
  done?: boolean;
}

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("image/png");

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    console.log(selectedFormat)
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setImages((prev) => [...prev, ...files.map(file => ({ file }))]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages((prev) => [...prev, ...files.map(file => ({ file }))]);
  };

  const truncateFileName = (fileName: string, maxLength: number = 20): string => {
    const lastDotIndex = fileName.lastIndexOf(".");
    const name = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
    const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : "";

    if (name.length > maxLength) {
      return `${name.slice(0, maxLength)} ...${extension}`;
    }
    return fileName;
  };

  const convertImages = async () => {
    const updatedImages = await Promise.all(images.map(async (image) => {
      const img = new Image();
      const reader = new FileReader();

      setImages((prev) => prev.map((imgFile, idx) => idx === images.indexOf(image) ? { ...imgFile, loading: true } : imgFile));

      return new Promise<ImageFile>((resolve) => {
        reader.onload = async (e) => {
          img.src = e.target?.result as string;
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                }
              }, selectedFormat);
            });

            const downloadUrl = URL.createObjectURL(blob);
            resolve({ file: image.file, downloadUrl });
          }
        };

        reader.readAsDataURL(image.file);
      }).then((result) => {
        setImages((prev) => prev.map((imgFile, idx) => idx === images.indexOf(image) ? { ...result, loading: false, done: true } : imgFile));
        return result;
      });
    }));

    setImages(updatedImages);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder("converted_images")!;

    for (const image of images) {
      if (image.downloadUrl) {
        const response = await fetch(image.downloadUrl);
        const blob = await response.blob();
        folder.file(image.file.name.replace(/\.[^/.]+$/, `.${selectedFormat.split("/")[1]}`), blob);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted_images.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main
      className="p-4 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold mb-4">Image Converter</h1>

      <label className="border-neutral-500 border-2 rounded-lg border-dotted py-8 px-4 mx-auto w-full max-w-[950px]">
        <h1 className="text-lg text-neutral-300 font-bold"> 
          Drag and drop or click here to upload images
        </h1>

        <p className="text-neutral-400">
          Make sure you drag and drop into the dotted container
        </p>
        <input
          onDrop={handleDrop} onChange={handleFileChange} type="file" accept=".png, .jpeg, .jpg, .webp, .gif"
          multiple placeholder="Drag and drop or click here to upload images"
          className="hidden"
        />
      </label>


      <ul className="space-y-2">
        {images.map((image, index) => (
          <li key={index} className="flex items-center justify-between p-2 border rounded bg-">
            <div className="flex items-center gap-2">
              <div className="loader-container">
                {image.loading ? (
                  <AiOutlineLoading className="animate-spin text-sky-500"/>
                ) : image.done ? (
                  <FaCheck className="text-green-500"/>
                ) : image.downloadUrl ? (
                  <FaCheck className="text-green-500"/>
                ) : (
                  <FaCheck className="text-transparent"/>
                )}
              </div>
              <span>{truncateFileName(image.file.name)}</span>
            </div>
            <div className="flex items-center gap-2">
              {image.downloadUrl && (
                <LinkButton variant="outline" size="icon" href={image.downloadUrl} download={image.file.name} className="text-blue-500 bg-transparent">
                  <FaDownload />
                </LinkButton>
              )}
              <Button onClick={() => deleteImage(index)} variant="outline" size="icon" className="text-red-500">
                <FaTrashCan />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Select
        defaultValue="image/png"
        value={selectedFormat}
        onValueChange={(e) => setSelectedFormat(e)}
      >
        <SelectTrigger className="w-[180px] mt-12" title="Select a file format you want to convert your files to">
          <SelectValue placeholder="Select a format"/>
        </SelectTrigger>
        
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Image Format</SelectLabel>
            <SelectItem value="image/png">.png</SelectItem>
            <SelectItem value="image/jpeg">.jpeg</SelectItem>
            <SelectItem value="image/webp">.webp</SelectItem>
            <SelectItem value="image/gif">.gif</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex flex-row gap-2 -translate-y-2">
        <Button 
          title="Convert uploaded files"
          onClick={convertImages} 
          className="bg-blue-600 hover:bg-blue-700 text-white duration-300"
        >
          Convert
        </Button>
        {images.length > 0 && (
          <Button 
            title="Download all uploaded files in a .zip"
            onClick={downloadAll}
            className="bg-green-600 hover:bg-green-700 text-white duration-300"
          >
            Download All
          </Button>
        )}
      </div>
    </main>
  );
}
