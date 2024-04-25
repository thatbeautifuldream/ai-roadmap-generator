import { StarIcon } from "@heroicons/react/20/solid";

export default function RoadmapTestimonial() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32 lg:px-8">
      <figure className="mx-auto max-w-2xl">
        {/* <p className="sr-only">5 out of 5 stars</p>
        <div className="flex gap-x-1 text-green-600">
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
        </div> */}
        <blockquote className="mt-10 text-xl font-semibold leading-8 tracking-tight text-gray-900 sm:text-2xl sm:leading-9">
          <p>
            “100% AGREE! Also, the way team has launched the project is
            commendable. This is by far the most successful project launch on
            Peerlist”
          </p>
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-x-6">
          <img
            className="h-12 w-12 rounded-full bg-gray-50"
            src="https://dqy38fnwh4fqs.cloudfront.net/UHDNK79BK6LA89DCMPRQGEGQOGGO/hdnk79bk6la89dcmprqgegqoggo-profile.webp"
            alt="Akash Bhadange, CEO of Peerlist"
          />
          <div className="text-sm leading-6">
            <div className="font-semibold text-gray-900">Akash Bhadange</div>
            <div className="mt-0.5 text-gray-600">CEO of Peerlist</div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
