"use client";

import Image from "next/image";
import { Share2, Facebook, Linkedin } from "lucide-react";
import { useState, useRef, useCallback } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/predict/";

export default function PneumoniaClassification() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUploadedFile, setLastUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        if (
          lastUploadedFile &&
          file.name === lastUploadedFile.name &&
          file.size === lastUploadedFile.size
        ) {
          console.warn(
            "Warning: The same file seems to have been uploaded again."
          );
        }
        setUploadedFile(file);
        setLastUploadedFile(file);
        setSelectedImage(null);
        setError(null);
      } else {
        setError("Please select a valid image file");
      }
    },
    [lastUploadedFile]
  );

  const handleSubmit = useCallback(async () => {
    if (selectedImage || uploadedFile) {
      setIsProcessing(true);
      setApiResult(null);
      setError(null);

      try {
        const formData = new FormData();
        if (uploadedFile) {
          formData.append("file", uploadedFile);
          console.log("File name:", uploadedFile.name);
          console.log("File size:", uploadedFile.size);
          console.log("File type:", uploadedFile.type);
        } else {
          const response = await fetch(`/images/normal${selectedImage}.png`);
          const blob = await response.blob();
          formData.append("file", blob, `normal${selectedImage}.png`);
        }

        console.log("Sending request to API...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

        const apiResponse = await fetch(API_URL, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          throw new Error(
            `HTTP error! status: ${apiResponse.status}, message: ${errorText}`
          );
        }

        const result = await apiResponse.json();
        console.log("Full API Response:", JSON.stringify(result, null, 2));

        if (!result.class || !result.confidence || !result.probabilities) {
          throw new Error("Invalid API response format");
        }

        setApiResult(result);
      } catch (error) {
        console.error("Error processing image:", error);
        setError(
          `An error occurred while processing the image: ${error.message}`
        );
      } finally {
        setIsProcessing(false);
      }
    } else {
      setError("Please select or upload an image before submitting");
    }
  }, [selectedImage, uploadedFile]);

  return (
    <div className="container mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-[#4E4AB6] mb-8">
        Pneumonia Classification
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["PNEUMONIA", "Normal Alveoli VS Pneumonia", "Affects the Body"].map(
          (title, index) => (
            <div
              key={title}
              className="bg-white/50 backdrop-blur-sm rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 bg-blue-100">
                <h2 className="text-xl font-semibold text-[#4E4AB6] text-center">
                  {title}
                </h2>
              </div>
              <div className="p-6 flex justify-center">
                <Image
                  src={`/images/image${index + 1}.png`}
                  alt={title}
                  width={300}
                  height={300}
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[#4E4AB6] mb-4">
              Description
            </h2>
            <p className="text-gray-700">
              This project uses deep learning to automatically classify chest
              X-ray images into different stages of pneumonia. Convolutional
              neural networks (CNNs) are trained on large datasets of chest
              X-ray images to detect and classify the severity of pneumonia,
              aiding in quick and accurate diagnosis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#4E4AB6] mb-4">
              Tools & Technologies
            </h2>
            <p className="text-gray-700">
              Deep Learning, PyTorch, Keras, TensorFlow
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#4E4AB6] mb-4">
              Share This
            </h2>
            <div className="flex gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Facebook className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Linkedin className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#4E4AB6] mb-6">
              Choose image:
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`relative aspect-square bg-white rounded-lg border-2 ${
                    selectedImage === num
                      ? "border-[#4E4AB6]"
                      : "border-gray-200"
                  } hover:border-[#4E4AB6] cursor-pointer overflow-hidden`}
                  onClick={() => {
                    setSelectedImage(num);
                    setUploadedFile(null);
                  }}
                >
                  <Image
                    src={`/images/normal${num}.png`}
                    alt={`Chest X-ray ${num}`}
                    fill
                    className="object-cover p-2"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="font-medium text-gray-700 mb-2">
                Or upload your own image:
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Choose File
                </button>
                <span className="text-sm text-gray-600">
                  {uploadedFile ? uploadedFile.name : "No file chosen"}
                </span>
              </div>
              {uploadedFile && (
                <div className="mt-4 relative aspect-square w-full max-w-md">
                  <Image
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Uploaded chest X-ray"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <button
                className={`w-full bg-[#4E4AB6] text-white px-6 py-3 rounded-md hover:bg-[#3d3a92] transition-colors ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Submit for Analysis"}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {apiResult && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg text-black">
                  <h3 className="text-xl font-semibold text-[#4E4AB6] mb-4">
                    API Result:
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Prediction:</strong> {apiResult.class}
                    </p>
                    <p>
                      <strong>Confidence:</strong>{" "}
                      {(apiResult.confidence * 100).toFixed(2)}%
                    </p>
                    {apiResult.probabilities && (
                      <>
                        <p>
                          <strong>Normal Probability:</strong>{" "}
                          {(apiResult.probabilities.Normal * 100).toFixed(2)}%
                        </p>
                        <p>
                          <strong>Pneumonia Probability:</strong>{" "}
                          {(apiResult.probabilities.Pneumonia * 100).toFixed(2)}
                          %
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {apiResult && (
                <div className="mt-8">
                  <h3 className="font-medium text-gray-700 mb-4">
                    AI verdict:
                  </h3>
                  <div className="relative aspect-square w-full max-w-md mb-4">
                    <Image
                      src={
                        uploadedFile
                          ? URL.createObjectURL(uploadedFile)
                          : `/images/normal${selectedImage}.png`
                      }
                      alt="Selected or uploaded chest X-ray"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="bg-[#4E4AB6] text-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {(apiResult.confidence * 100).toFixed(2)}%
                    </div>
                    <div>{apiResult.class}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
