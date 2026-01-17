// export default function Lineup() {
//     return (
//         <div>
//             Lineup
//         </div>
//     )
// }

import { useState } from "react"
import { IoAddOutline, IoImageOutline, IoLogoInstagram, IoMusicalNote } from "react-icons/io5"
import { FaXTwitter } from "react-icons/fa6"
import { IoArrowBack, IoArrowForward } from "react-icons/io5"
import { IoTrashOutline, IoStar, IoStarOutline } from "react-icons/io5"
import { MdDragIndicator } from "react-icons/md"

interface Artist {
  id: number;
  image: File | null;
  name: string;
  role: string;
  isHeadliner: boolean;
  instagram: string;
  twitter: string;
  website: string;
}


interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Lineup({ step, setStep}: StepProps) {
  const [artists, setArtists] = useState<Artist[]>([
    {
      id: 1,
      image: null,
      name: "",
      role: "",
      isHeadliner: true,
      instagram: "",
      twitter: "",
      website: ""
    }
  ])

  const addArtist = () => {
    const newArtist: Artist = {
      id: Date.now(),
      image: null,
      name: "",
      role: "",
      isHeadliner: false,
      instagram: "",
      twitter: "",
      website: ""
    }
    setArtists([...artists, newArtist])
  }

  const clearAll = () => {
    setArtists([{
      id: Date.now(),
      image: null,
      name: "",
      role: "",
      isHeadliner: true,
      instagram: "",
      twitter: "",
      website: ""
    }])
  }

  const updateArtist = (id: number, field: keyof Artist, value: any) => {
    setArtists(artists.map(artist => 
      artist.id === id ? { ...artist, [field]: value } : artist
    ))
  }

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateArtist(id, 'image', e.target.files[0])
    }
  }

  const toggleHeadliner = (id: number) => {
    setArtists(artists.map(artist => 
      artist.id === id ? { ...artist, isHeadliner: !artist.isHeadliner } : artist
    ))
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">ARTIST LINEUP</h2>
          <p className="text-xs text-gray-500 mt-1">Details of Performing Artists</p>
        </div>
        <button
          onClick={addArtist}
          className="flex items-center gap-2 text-[#CCA33A] text-sm font-medium hover:text-[#b8922d] transition-colors"
        >
          <IoAddOutline className="text-lg" />
          Add Artist
        </button>
      </div>

      {/* Artists List */}
      <div className="space-y-8">
        {artists.map((artist) => (
          <div key={artist.id} className="space-y-4">
            {/* Artist Image */}
            <div>
              <label className="block text-sm mb-2">
                Artist Image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg h-40 w-48 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleImageUpload(artist.id, e)}
                  className="hidden"
                  id={`artist-image-${artist.id}`}
                />
                <label htmlFor={`artist-image-${artist.id}`} className="cursor-pointer text-center">
                  <IoImageOutline className="text-3xl text-gray-600 mx-auto mb-2" />
                  <p className="text-xs">
                    <span className="text-[#CCA33A]">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">JPG, JPEG, PNG less than 1MB</p>
                </label>
              </div>
            </div>

            {/* Artist Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Artist Name */}
              <div>
                <label className="block text-sm mb-2">
                  Artist Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={artist.name}
                  onChange={(e) => updateArtist(artist.id, 'name', e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                />
              </div>

              {/* Role/Genre */}
              <div>
                <label className="block text-sm mb-2">
                  Role/Genre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={artist.role}
                  onChange={(e) => updateArtist(artist.id, 'role', e.target.value)}
                  placeholder="e.g. Techno DJ/Producer"
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                />
              </div>

              {/* Headliner Status */}
              <div>
                <label className="block text-sm mb-2">
                  Headliner Status <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={() => toggleHeadliner(artist.id)}
                  className={`w-full border rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    artist.isHeadliner
                      ? "border-[#CCA33A] bg-[#CCA33A]/10 text-[#CCA33A]"
                      : "border-[#2a2a2a] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {artist.isHeadliner ? <IoStar /> : <IoStarOutline />}
                  {artist.isHeadliner ? "Headliner" : "Supporting Artist"}
                </button>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <label className="block text-sm mb-2">Social Media Links</label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Instagram */}
                <div className="relative">
                  <IoLogoInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={artist.instagram}
                    onChange={(e) => updateArtist(artist.id, 'instagram', e.target.value)}
                    placeholder="Instagram handle"
                    className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                  />
                </div>

                {/* Twitter */}
                <div className="relative">
                  <FaXTwitter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={artist.twitter}
                    onChange={(e) => updateArtist(artist.id, 'twitter', e.target.value)}
                    placeholder="Twitter handle"
                    className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                  />
                </div>

                {/* Website */}
                <div className="relative">
                  <IoMusicalNote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={artist.website}
                    onChange={(e) => updateArtist(artist.id, 'website', e.target.value)}
                    placeholder="john-doe"
                    className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            {artists.length > 1 && artists.indexOf(artist) < artists.length - 1 && (
              <div className="border-t border-[#2a2a2a] pt-4"></div>
            )}
          </div>
        ))}
      </div>

      {/* Clear All Button */}
      {artists.length > 1 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={clearAll}
            className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-400 transition-colors"
          >
            <IoTrashOutline className="text-lg" />
            Clear all
          </button>
        </div>
      )}

      {/* Tip */}
      <div className="flex items-start gap-2 mt-8 p-4 bg-gray-900/50 rounded-lg border border-[#2a2a2a]">
        <span className="text-[#CCA33A] text-xl mt-0.5">💡</span>
        <p className="text-xs text-gray-400">
          Tip: Drag artists to change performance order. Mark headliners to feature them prominently.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-10">
        <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors">
          <IoArrowBack />
          Previous
        </button>
        <button onClick={() => setStep(step + 1)} className="bg-[#CCA33A] text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#b8922d] transition-colors">
          Proceed
          <IoArrowForward />
        </button>
      </div>
    </div>
  )
}