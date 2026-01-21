import { EditEventAction } from "@/app/actions/event";
import ImageUpload from "@/components/Image";
import Spinner from "@/components/Spinner";
import { useAboutEventStore } from "@/store/create-events/AboutEvent";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  IoAddOutline,
  IoArrowBack,
  IoArrowForward,
  IoTrashOutline,
} from "react-icons/io5";

interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

interface ValidationErrors {
  heading?: string;
  description?: string;
  sections?: {
    [key: number]: {
      subTitle?: string;
      content?: string;
      image?: string;
    };
  };
}

export default function AboutEvent({ step, setStep }: StepProps) {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") ?? "";

  const {
    heading,
    description,
    sections,
    setHeading,
    setDescription,
    addSection,
    deleteSection,
    updateSection,
  } = useAboutEventStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>("");

  /** Validate all required fields */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      sections: {},
    };

    // Heading validation
    if (!heading || heading.trim() === "") {
      newErrors.heading = "Heading is required";
    } else if (heading.trim().length < 3) {
      newErrors.heading = "Heading must be at least 3 characters";
    }

    // Description validation
    if (!description || description.trim() === "") {
      newErrors.description = "Event description is required";
    } else if (description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    // Sections validation
    sections.forEach((section, index) => {
      const sectionErrors: {
        subTitle?: string;
        content?: string;
        image?: string;
      } = {};

      // Sub-title validation
      if (!section.subTitle || section.subTitle.trim() === "") {
        sectionErrors.subTitle = "Sub-title is required";
      } else if (section.subTitle.trim().length < 3) {
        sectionErrors.subTitle = "Sub-title must be at least 3 characters";
      }

      // Content validation
      if (!section.content || section.content.trim() === "") {
        sectionErrors.content = "Section content is required";
      } else if (section.content.trim().length < 10) {
        sectionErrors.content = "Content must be at least 10 characters";
      }

      // Image validation
      if (!section.image || !section.image.url) {
        sectionErrors.image = "Supporting image is required";
      }

      if (Object.keys(sectionErrors).length > 0) {
        newErrors.sections![index] = sectionErrors;
      }
    });

    // Clean up empty sections object
    if (Object.keys(newErrors.sections!).length === 0) {
      delete newErrors.sections;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submission */
  const handleSaveAboutEvent = async () => {
    // Reset previous errors
    setSubmitError("");

    // Validate form
    if (!validateForm()) {
      setSubmitError("Please fill in all required fields correctly");
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        stage: step,
        addboutEvent: {
          heading: heading,
          description: description,
          content: sections.map((section) => ({
            subTitle: section.subTitle,
            sectionContent: section.content,
            supportingImage: section.image,
          })),
        },
      };

      const res = await EditEventAction(data, eventId);

      if (!res.success) {
        setSubmitError(res.message || "Failed to save event details");
        console.log("res==", res.message);
        return;
      }

      setStep(step + 1);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";
      setSubmitError(errorMessage);
      console.error("Error saving about event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white">
      {/* ABOUT EVENT Section */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">ABOUT EVENT</h2>

      {/* Global Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{submitError}</p>
        </div>
      )}

      {/* Heading */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Heading <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={heading}
          onChange={(e) => {
            setHeading(e.target.value);
            setErrors((prev) => ({ ...prev, heading: undefined }));
          }}
          placeholder="e.g. More than an Event"
          className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
            errors.heading ? "border-red-500" : "border-[#2a2a2a]"
          }`}
        />
        {errors.heading && (
          <p className="text-red-500 text-xs mt-1">{errors.heading}</p>
        )}
      </div>

      {/* What is this event all about */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          What is this event all about? <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          placeholder="Enter event description"
          rows={6}
          className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none ${
            errors.description ? "border-red-500" : "border-[#2a2a2a]"
          }`}
        />
        <div className="flex justify-between items-center mt-2">
          {errors.description ? (
            <p className="text-red-500 text-xs">{errors.description}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Let your audience know what this event is about
            </p>
          )}
          <p className="text-xs text-gray-500 ml-auto">
            {description.length} characters
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2a2a2a] my-8"></div>

      {/* EXPERIENCE CONTENT Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">
            EXPERIENCE CONTENT
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage event-specific experience sections
          </p>
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
        {sections.map((section, index) => {
          const sectionErrors = errors.sections?.[index] || {};

          return (
            <div key={section.id} className="space-y-6">
              {/* Section Number Indicator */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#CCA33A] font-semibold">
                  Section {index + 1}
                </span>
                {Object.keys(sectionErrors).length > 0 && (
                  <span className="text-red-500 text-xs">
                    (Please complete all fields)
                  </span>
                )}
              </div>

              {/* Sub-title */}
              <div>
                <label className="block text-sm mb-2">
                  Sub-title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={section.subTitle}
                  onChange={(e) => {
                    updateSection(section.id, "subTitle", e.target.value);
                    setErrors((prev) => {
                      const newSections = { ...prev.sections };
                      if (newSections[index]) {
                        delete newSections[index].subTitle;
                        if (Object.keys(newSections[index]).length === 0) {
                          delete newSections[index];
                        }
                      }
                      return { ...prev, sections: newSections };
                    });
                  }}
                  placeholder="e.g. Main Stage"
                  className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
                    sectionErrors.subTitle ? "border-red-500" : "border-[#2a2a2a]"
                  }`}
                />
                {sectionErrors.subTitle && (
                  <p className="text-red-500 text-xs mt-1">
                    {sectionErrors.subTitle}
                  </p>
                )}
              </div>

              {/* Section content */}
              <div>
                <label className="block text-sm mb-2">
                  Section content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={section.content}
                  onChange={(e) => {
                    updateSection(section.id, "content", e.target.value);
                    setErrors((prev) => {
                      const newSections = { ...prev.sections };
                      if (newSections[index]) {
                        delete newSections[index].content;
                        if (Object.keys(newSections[index]).length === 0) {
                          delete newSections[index];
                        }
                      }
                      return { ...prev, sections: newSections };
                    });
                  }}
                  placeholder="Enter brief description"
                  rows={5}
                  maxLength={150}
                  className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none ${
                    sectionErrors.content ? "border-red-500" : "border-[#2a2a2a]"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {sectionErrors.content && (
                    <p className="text-red-500 text-xs">
                      {sectionErrors.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {section.content.length}/150
                  </p>
                </div>
              </div>

              {/* Supporting Image */}
              <ImageUpload
                label="Supporting Image"
                required
                onUploadComplete={(image) => {
                  updateSection(section.id, "image", image);
                  setErrors((prev) => {
                    const newSections = { ...prev.sections };
                    if (newSections[index]) {
                      delete newSections[index].image;
                      if (Object.keys(newSections[index]).length === 0) {
                        delete newSections[index];
                      }
                    }
                    return { ...prev, sections: newSections };
                  });
                }}
                error={sectionErrors.image}
              />

              {/* Delete Button - only show if more than one section */}
              {sections.length > 1 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      deleteSection(section.id);
                      // Clear errors for this section
                      setErrors((prev) => {
                        const newSections = { ...prev.sections };
                        delete newSections[index];
                        // Reindex remaining sections
                        const reindexed: typeof newSections = {};
                        Object.keys(newSections).forEach((key) => {
                          const keyNum = parseInt(key);
                          if (keyNum > index) {
                            reindexed[keyNum - 1] = newSections[keyNum];
                          } else {
                            reindexed[keyNum] = newSections[keyNum];
                          }
                        });
                        return { ...prev, sections: reindexed };
                      });
                    }}
                    className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-400 transition-colors"
                  >
                    <IoTrashOutline className="text-lg" />
                    Delete Section
                  </button>
                </div>
              )}

              {/* Divider between sections */}
              {index < sections.length - 1 && (
                <div className="border-t border-[#2a2a2a] mt-8"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-10">
        <button
          onClick={() => setStep(step - 1)}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoArrowBack />
          Previous
        </button>
        <button
          onClick={handleSaveAboutEvent}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-full flex items-center gap-2 font-semibold transition-colors ${
            isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#CCA33A] hover:bg-[#b8922d]"
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" color="border-black" />
              Saving...
            </>
          ) : (
            <>
              Proceed
              <IoArrowForward />
            </>
          )}
        </button>
      </div>
    </div>
  );
}