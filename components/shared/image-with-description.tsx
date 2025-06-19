import Image from "next/image"

const ImageWithDescription = ({
  image,
  title,
  description,
  alt,
}: {
  image: string
  title: string
  description: string
  alt: string
}) => {
  return (
    <div className="bg-secondary flex flex-col md:flex-row md:gap-8">
      <Image
        src={image}
        alt={alt}
        width={1500}
        height={1500}
        className="flex h-[280px] w-full object-cover md:h-[420px] md:w-3/5 md:rounded-l-[185px]"
      />
      <div className="w-full p-8">
        <div className="flex h-full flex-col justify-center text-white">
          <h2 className="mb-4 text-center text-4xl font-extrabold md:text-6xl">
            {title}
          </h2>
          <p className="leading-relaxed font-semibold md:text-lg lg:text-2xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageWithDescription
