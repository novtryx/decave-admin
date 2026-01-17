// export default function AboutEvent() {
//     return (
//         <div>
//             AboutEvent
//         </div>
//     )
// }


import { useState } from "react"
import { IoImageOutline, IoAddOutline, IoArrowBack, IoArrowForward, IoTrashOutline } from "react-icons/io5"

interface ExperienceSection {
  id: number;
  subTitle: string;
  content: string;
  image: File | null;
}

interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function AboutEvent({ step, setStep}: StepProps) {
  const [heading, setHeading] = useState("")
  const [description, setDescription] = useState("")
  const [sections, setSections] = useState<ExperienceSection[]>([
    { id: 1, subTitle: "", content: "", image: null }
  ])

  const addSection = () => {
    const newSection: ExperienceSection = {
      id: Date.now(),
      subTitle: "",
      content: "",
      image: null
    }
    setSections([...sections, newSection])
  }

  const deleteSection = (id: number) => {
    if (sections.length > 1) {
      setSections(sections.filter(section => section.id !== id))
    }
  }

  const updateSection = (id: number, field: keyof ExperienceSection, value: string | File | null) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ))
  }

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateSection(id, 'image', e.target.files[0])
    }
  }

  return (
    <div className="text-white">
      {/* ABOUT EVENT Section */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">ABOUT EVENT</h2>

      {/* Heading */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Heading <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. More than an Event"
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
        />
      </div>

      {/* What is this event all about */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          What is this event all about? <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter event description"
          rows={6}
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">Let your audience know what this event is about</p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2a2a2a] my-8"></div>

      {/* EXPERIENCE CONTENT Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">EXPERIENCE CONTENT</h2>
          <p className="text-xs text-gray-500 mt-1">Manage event-specific experience sections</p>
        </div>
        <button
          onClick={addSection}
          className="flex items-center gap-2 text-[#CCA33A] text-sm font-medium hover:text-[#b8922d] transition-colors"
        >
          <IoAddOutline className="text-lg" />
          Add Section
        </button>
      </div>

      {/* Experience Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={section.id} className="space-y-6">
            {/* Sub-title */}
            <div>
              <label className="block text-sm mb-2">
                Sub-title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={section.subTitle}
                onChange={(e) => updateSection(section.id, 'subTitle', e.target.value)}
                placeholder="e.g. Main Stage"
                className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
              />
            </div>

            {/* Section content */}
            <div>
              <label className="block text-sm mb-2">
                Section content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                placeholder="Enter brief description"
                rows={5}
                maxLength={150}
                className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{section.content.length}/150</p>
            </div>

            {/* Supporting Image */}
            <div>
              <label className="block text-sm mb-2">
                Supporting image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleImageUpload(section.id, e)}
                  className="hidden"
                  id={`image-upload-${section.id}`}
                />
                <label htmlFor={`image-upload-${section.id}`} className="cursor-pointer text-center">
                  <IoImageOutline className="text-4xl text-gray-600 mx-auto mb-3" />
                  <p className="text-sm">
                    <span className="text-[#CCA33A]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-600 mt-1">JPG, JPEG, PNG less than 1MB</p>
                </label>
              </div>
            </div>

            {/* Delete Button - only show if more than one section */}
            {sections.length > 1 && (
              <div className="flex justify-end">
                <button
                  onClick={() => deleteSection(section.id)}
                  className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-400 transition-colors"
                >
                  <IoTrashOutline className="text-lg" />
                  Delete
                </button>
              </div>
            )}

            {/* Divider between sections */}
            {index < sections.length - 1 && (
              <div className="border-t border-[#2a2a2a] mt-8"></div>
            )}
          </div>
        ))}
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