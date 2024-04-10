import Link from "next/link";

type People = {
  name: string;
  role: string;
  imageUrl: string;
  link: string;
};

const people: People[] = [
  {
    name: "Vishwajeet Raj",
    role: "Software Engineer",
    imageUrl:
      "https://dqy38fnwh4fqs.cloudfront.net/UH8OABPQAKN8DPE29GOMBJBMQBJB/h8oabpqakn8dpe29gombjbmqbjb-profile.webp",
    link: "https://peerlist.io/vishwajeetraj11",
  },
  {
    name: "Milind Mishra",
    role: "Software Engineer",
    imageUrl:
      "https://dqy38fnwh4fqs.cloudfront.net/UHDNGKG7BMJ8PKPFNLPRDDRNOAG7/9922bb83-bd73-429b-bb25-4cb381f51a4a.png",
    link: "https://peerlist.io/milind",
  },
  {
    name: "Sinchan Dasgupta",
    role: "Software Engineer",
    imageUrl:
      "https://dqy38fnwh4fqs.cloudfront.net/UH6AJJ8JJJMLE771G6KNQDLKP68R/h6ajj8jjjmle771g6knqdlkp68r-profile.webp",
    link: "https://peerlist.io/syndg",
  },
  {
    name: "Suyash Patil",
    role: "Software Engineer",
    imageUrl:
      "https://dqy38fnwh4fqs.cloudfront.net/UHA9NNDRJ9PBRGD1JGBGJ9MP8A7D/ha9nndrj9pbrgd1jgbgj9mp8a7d-profile",
    link: "https://peerlist.io/suyashpatil",
  },
];

export default function RoadmapTeam() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl ">
            Meet{" "}
            <span class="relative inline-block">
              <span
                class="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent blur-md"
                aria-hidden="true"
              >
                Makkhan Labs
              </span>
              <span class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Makkhan Labs
              </span>
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            It started from Vishwajeet generating roadmap tree from the AI and
            rendering React flow, rest of us liked the idea and built the bells
            and whistles around it.
          </p>
        </div>
        <ul
          role="list"
          className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
        >
          {people.map((person) => (
            <li key={person.name}>
              <div className="flex items-center gap-x-6">
                <img
                  className="h-16 w-16 rounded-full"
                  src={person?.imageUrl}
                  alt=""
                />
                <div>
                  <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                    {person.name}
                  </h3>
                  <p className="text-sm font-semibold leading-6 text-gray-600">
                    {person.role}
                  </p>
                  <div className="mt-2">
                    <a
                      href={person?.link}
                      target="_blank"
                      className="text-md font-semibold text-green-600 hover:underline"
                    >
                      Peerlist Profile &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
