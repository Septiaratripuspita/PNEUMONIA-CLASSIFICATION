import Image from "next/image";
import { Share2, Facebook, Linkedin } from "lucide-react";

export default function PneumoniaClassification() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-[#4E4AB6] mb-8">
        Pneumonia Classification
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-100">
            <h2 className="text-xl font-semibold text-[#4E4AB6] text-center">
              PNEUMONIA
            </h2>
          </div>
          <div className="p-6 flex justify-center">
            <Image
              src="/images/image1.png"
              alt="Comparison between healthy lungs and pneumonia-affected lungs"
              width={300}
              height={300}
              className="rounded-lg object-contain"
            />
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-100">
            <h2 className="text-xl font-semibold text-[#4E4AB6] text-center">
              Normal Alveoli VS Pneumonia
            </h2>
          </div>
          <div className="p-6 flex justify-center">
            <Image
              src="/images/image2.png"
              alt="Comparison between normal alveoli and pneumonia-affected alveoli"
              width={300}
              height={300}
              className="rounded-lg object-contain"
            />
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-100">
            <h2 className="text-xl font-semibold text-[#4E4AB6] text-center">
              Affects the Body
            </h2>
          </div>
          <div className="p-6 flex justify-center">
            <Image
              src="/images/image3.png"
              alt="Diagram showing how pneumonia affects different parts of the body"
              width={300}
              height={300}
              className="rounded-lg object-contain"
            />
          </div>
        </div>
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

            <div className="grid grid-cols-5 gap-4 mb-8">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="relative aspect-square w-42 h- bg-white rounded-lg border-2 border-gray-200 hover:border-[#4E4AB6] cursor-pointer overflow-hidden"
                >
                  <Image
                    src={`/images/normal${num}.png`}
                    alt={`Chest X-ray ${num}`}
                    fill
                    className="object-cover p-2"
                    sizes="(max-width: 96px) 100vw, 96px"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="font-medium text-gray-700">
                Choose your classification:
              </h3>
              <div className="flex gap-4 flex-wrap">
                {["Normal", "Bacterial Pneumonia", "Viral Pneumonia"].map(
                  (option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="classification"
                        className="w-4 h-4 text-[#4E4AB6]"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  )
                )}
              </div>

              <button className="bg-[#4E4AB6] text-white px-6 py-2 rounded-md hover:bg-[#3d3a92] transition-colors">
                Submit
              </button>

              <div className="mt-8">
                <h3 className="font-medium text-gray-700 mb-4">AI verdict:</h3>
                <div className="relative aspect-square max-w-md mb-4">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Selected chest X-ray"
                    width={400}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
                <div className="bg-[#4E4AB6] text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">95.60%</div>
                  <div>Bacterial Pneumonia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
