import Link from "next/link";
import NeubrutalismButton from "@/components/ui/neobrutalism-button";

export default function CTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-red-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pb-12 pt-10 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:px-20 xl:py-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="block">
                  We&apos;re <span className="line-through">open</span> closed
                  source!
                </span>
              </h2>
              <p className="mt-4 mb-4 text-lg leading-6 text-red-200">
                We&apos;re working on a new version of our platform, expect new
                features and improvements soon!
              </p>
              <div className="flex gap-x-3">
                <Link href="/discord" target="_blank">
                  <NeubrutalismButton>
                    <span className="flex items-center gap-x-2 text-base">
                      Community
                    </span>
                  </NeubrutalismButton>
                </Link>
                <Link href="/twitter" target="_blank">
                  <NeubrutalismButton>
                    <span className="flex items-center gap-x-2 text-base">
                      Updates
                    </span>
                  </NeubrutalismButton>
                </Link>
              </div>
            </div>
          </div>
          <div className="aspect-h-3 aspect-w-5 -mt-6 md:aspect-h-1 md:aspect-w-2">
            <img
              className="translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
              src="/images/repository-screenshot.png"
              alt="Repository Screenshot"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
