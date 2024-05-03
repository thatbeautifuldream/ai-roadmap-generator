import Link from "next/link";
import NeubrutalismButton from "@/components/ui/neobrutalism-button";

export default function CTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-green-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pb-12 pt-10 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:px-20 xl:py-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="block">We&apos;re open source!</span>
                <span className="block">
                  Feel free to have a discussion on open issues.
                </span>
              </h2>
              <p className="mt-4 mb-4 text-lg leading-6 text-green-200">
                We use GitHub to manage our project. You can browse the code and
                report issues there.
              </p>
              <Link
                href="https://github.com/thatbeautifuldream/ai-roadmap-generator"
                target="_blank"
              >
                <NeubrutalismButton>
                  <span className="flex items-center gap-x-2 text-base">
                    Repository
                  </span>
                </NeubrutalismButton>
              </Link>
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
