"use client";

const cards = [
  "CULTURE",
  "RHYTHM",
  "COLOR",
  "CULTURE",
  "RHYTHM",
  "COLOR",
  "CULTURE",
  "RHYTHM",
  "COLOR",
  "CULTURE",
  "RHYTHM",
  "COLOR",
  "CULTURE",
  "RHYTHM",
];

export default function BottomCards() {
  const cardWidth = 150;      // must match md:w-[150px]
  const overlap = 100;       // same as index * 100
  const totalWidth =
    (cards.length - 1) * overlap + cardWidth;

  return (
    <div className="pointer-events-none absolute bottom-0 z-20 h-40 w-full overflow-hidden">
      <div className="relative mx-auto h-full w-full">
        {cards.map((label, index) => {
          const rotation = index % 2 === 0 ? -8 : 8;
          const left = `calc(50% - ${totalWidth / 2}px + ${
            index * overlap
          }px)`;

          return (
            <div
              key={index}
              style={{
                left,
                transform: `rotate(${rotation}deg)`,
              }}
              className="
                absolute
                top-6
                w-35
                md:w-37.5
                rounded-xl
                border-4 border-white
                bg-yellow-500/90
                px-4 py-3
                text-center
                text-xs
                font-semibold
                text-white
                shadow-lg
                backdrop-blur-md
              "
            >
              <p className="text-xl tracking-widest">
                {label}
              </p>
              <p className="mt-1 text-xl font-normal">
                RHYTHM
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
