import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"

const ImageWithDescription = ({
  image,
  title,
  description,
  alt,
  button,
  link,
}: {
  image: string
  title: string
  description: string
  alt: string
  button?: string
  link?: string
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
          {button && link && (
            <Link
              href={link}
              className="self-center md:ml-16 md:w-fit md:self-end"
            >
              <Button
                variant={"ghost"}
                className="text-primary mt-4 rounded-full bg-white px-6 py-2 font-semibold shadow-2xl transition-colors duration-300 hover:cursor-pointer hover:bg-gray-200"
              >
                {button}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageWithDescription
