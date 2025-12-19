import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCourseContext} from "@/context/CourseContext";
import {IBatch} from "@/lib/services/instructor.services";
import Button from "@/components/Button";
import ErrorDisplay from "@/components/ErrorDisplay";
import {
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import Chip from "@/components/Chip";
import {toast} from "react-toastify";
import {Heading2} from "@/components/Typography";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import QuillMarkdownEditor from "@/components/QuillMarkdownEditor/QuillMarkdownEditor";
import CommonSelect from "@/components/CommonSelect";
import FileUpload from "@/components/FileUpload";
import {UploadPurpose} from "@/types/upload.types";
import ReactPlayer from "react-player";
import Calendar from "@/components/Calendar";
import SectionCard from "@/components/SectionCard";

export default function EditBatch() {
  const navigate = useNavigate();
  const {batchId} = useParams<{batchId: string}>();
  const {
    batchFormData,
    updateBatchFormData,
    getBatchById,
    updateBatch,
    publishBatch,
    isLoading,
    isSubmitting,
    clearError,
  } = useCourseContext();

  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [debouncedYoutubeUrl, setDebouncedYoutubeUrl] = useState<string>("");
  const [isPaidBatch, setIsPaidBatch] = useState(false);
  const [dateErrors, setDateErrors] = useState<string[]>([]);
  const isPublished = batchFormData.status === "PUBLISHED";

  const currencyOptions = [
    {value: "VND", label: "VND"},
    {value: "USD", label: "USD"},
    {value: "EUR", label: "EUR"},
    {value: "GBP", label: "GBP"},
  ];

  const languageOptions = [
    {value: "Vietnamese", label: "Vietnamese"},
    {value: "English", label: "English"},
    {value: "Chinese", label: "Chinese"},
    {value: "Japanese", label: "Japanese"},
  ];

  // Debounce YouTube URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedYoutubeUrl(youtubeUrl);
    }, 500);

    return () => clearTimeout(timer);
  }, [youtubeUrl]);

  // Validate date logic
  useEffect(() => {
    const errors: string[] = [];
    const {openTime, closeTime, startTime, endTime} = batchFormData;

    if (openTime && closeTime && new Date(openTime) >= new Date(closeTime)) {
      errors.push("Open Date must be before Close Date.");
    }
    if (closeTime && startTime && new Date(closeTime) >= new Date(startTime)) {
      errors.push("Close Date must be before Start Date.");
    }
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      errors.push("Start Date must be before End Date.");
    }

    setDateErrors(errors);

    if (errors.length > 0) {
      // Using toast to show the first error found
      toast.error(errors[0]);
    }
  }, [
    batchFormData.openTime,
    batchFormData.closeTime,
    batchFormData.startTime,
    batchFormData.endTime,
  ]);

  const handleSelectDate = (field: string, date: Date) => {
    date.setDate(date.getDate() + 1);
    const formattedDate = date.toISOString().split("T")[0];
    updateBatchFormData({[field]: formattedDate});
  };

  useEffect(() => {
    if (!batchId) {
      navigate("/instructor/batch");
      return;
    }

    const fetchBatch = async () => {
      const batchData: IBatch | null = await getBatchById(batchId);
      if (batchData) {
        updateBatchFormData({
          title: batchData.title,
          description: batchData.description,
          actualPrice: batchData.actualPrice,
          startTime: batchData.startTime
            ? new Date(batchData.startTime).toISOString().split("T")[0]
            : undefined,
          endTime: batchData.endTime
            ? new Date(batchData.endTime).toISOString().split("T")[0]
            : undefined,
          openTime: batchData.openTime
            ? new Date(batchData.openTime).toISOString().split("T")[0]
            : undefined,
          closeTime: batchData.closeTime
            ? new Date(batchData.closeTime).toISOString().split("T")[0]
            : undefined,
          tags: batchData.tags || [], // Ensure tags is an array
          labels: batchData.labels || [],
          timeCommitment: batchFormData.timeCommitment,
          status: batchData.status,
          language: batchData.language,
          maxCapacity: batchData.maxCapacity,
          image: batchData.image,
          videoLink: batchData.videoLink,
          paidBatch: batchData.paidBatch,
          currency: batchData.currency,
          sellingPrice: batchData.sellingPrice,
          amountUsd: batchData.amountUsd,
        });
        setIsPaidBatch(batchData.paidBatch);
        setYoutubeUrl(batchData.videoLink);
      } else {
        setError("Fail to load batch data");
      }
    };
    fetchBatch();
  }, [batchId, getBatchById]);

  const handleUpdate = async () => {
    if (!batchId) return;

    if (isPublished) {
      // If published, only allow updating a subset of fields
      await handleUpdatePublishedBatch();
      return;
    }

    const {
      tags,
      labels,
      startTime,
      endTime,
      openTime,
      closeTime,
      ...restOfData
    } = batchFormData;

    const success = await updateBatch(batchId, {
      ...restOfData,
      tags: tags,
      labels: labels,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      openTime: openTime ? new Date(openTime) : undefined,
      closeTime: closeTime ? new Date(closeTime) : undefined,
    });
    if (success) {
      navigate(`/instructor/batch`);
    } else {
      setError("Failed to update the batch. Please try again.");
    }
  };

  const handleUpdatePublishedBatch = async () => {
    if (!batchId) return;

    const {title, description, image, videoLink} = batchFormData;

    const success = await updateBatch(batchId, {
      title,
      description,
      image,
      videoLink,
      // The following are required by IBatchRequest but won't be changed
      status: "PUBLISHED",
      tags: batchFormData.tags,
      labels: batchFormData.labels,
    });

    if (success) {
      toast.success("Batch updated successfully!");
      navigate("/instructor/batch");
    }
  };

  const handlePublishBatch = async () => {
    if (!batchFormData || !batchId) return;
    if (batchFormData.status === "PUBLISHED") {
      toast.info("This batch already published");
      return;
    }

    setShowPublishModal(true);
  };

  const handleConfirmPublishBatch = async () => {
    if (!batchFormData || !batchId) return;
    setShowPublishModal(false);
    setIsPublishing(true);
    try {
      const success = await publishBatch(batchId);
      if (success) {
        toast.info("Publish batch successfully");
        navigate("/instructor/batch");
      } else {
        toast.error("Fail to publish batch");
      }
    } catch {
      toast.error("An error occurred while publishing the batch.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBack = () => {
    navigate("/instructor/batch"); // Corrected path from 'batch' to 'batches'
  };

  const handleInputChange = (field: string, value: string) => {
    updateBatchFormData({[field]: value} as any);
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      !batchFormData.tags.some((tag) => tag.name == newTag.trim())
    ) {
      updateBatchFormData({
        tags: [...batchFormData.tags, {name: newTag.trim()}],
      });

      setNewTag("");
    }
  };

  const handleRemoveTag = (tagName: string) => {
    if (batchFormData.tags.length <= 1) {
      toast.warning("You must have at least one tag");
      return;
    }

    updateBatchFormData({
      tags: batchFormData.tags.filter((tag) => tag.name !== tagName),
    });
  };

  const addSubject = () => {
    if (
      newSubject.trim() &&
      !batchFormData.labels.some((label) => label.name === newSubject.trim())
    ) {
      updateBatchFormData({
        labels: [...batchFormData.labels, {name: newSubject.trim()}],
      });
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subjectName: string) => {
    if (batchFormData.labels.length <= 1) {
      toast.warning("You must have at least one subject");
      return;
    }

    updateBatchFormData({
      labels: batchFormData.labels.filter(
        (label) => label.name !== subjectName,
      ),
    });
  };

  const handleUploadSuccess = (url: string) => {
    toast.success("Upload image successfully!");
    updateBatchFormData({image: url});
  };

  const handleUploadFail = (error: string) => {
    toast.error(`Upload image fail: ${error} `);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {error && <ErrorDisplay error={error} clearError={clearError} />}

      {/* Header (Sticky, Shadowed) */}
      <div className="sticky top-0 z-10 bg-white shadow-md border-b border-gray-100 px-6 sm:px-10 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="secondary"
              leftIcon={<ArrowLeft size={16} />}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to batches
            </Button>
            <div className="flex items-center gap-3">
              <Heading2>{batchFormData.title || "Batch Name"}</Heading2>
              <Chip
                variant={
                  batchFormData?.status === "PUBLISHED" ? "success" : "warning"
                }
              >
                {batchFormData.status || "Draft"}
              </Chip>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={
                batchFormData?.status === "PUBLISHED" ? "secondary" : "primary"
              }
              leftIcon={
                isPublishing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )
              }
              onClick={handlePublishBatch}
              disabled={isLoading || isPublishing || !batchFormData}
              className={
                batchFormData?.status === "PUBLISHED"
                  ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-300"
                  : ""
              }
            >
              {isPublishing
                ? "Publishing..."
                : batchFormData?.status === "PUBLISHED"
                  ? "Published"
                  : "Publish Batch"}
            </Button>
            <Button
              onClick={handleUpdate}
              variant="primary"
              disabled={isLoading || isSubmitting || dateErrors.length > 0}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Body Content (Centered, Card Layout) */}
      <div className="pt-10 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-0 space-y-8">
          {/* Batch Information Section */}
          <SectionCard title="Batch Information">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch title
              </label>
              <Input
                value={batchFormData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Example title about batch"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Description
              </label>
              <QuillMarkdownEditor
                value={batchFormData.description}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Example Description about batch"
                rows={4}
                className="w-full"
              />
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                isPublished ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="block text-sm font-medium text-gray-700 space-y-2">
                <label>Start Date</label>
                <Calendar
                  minDate={new Date()}
                  value={batchFormData.startTime}
                  onChange={(date) => handleSelectDate("startTime", date)}
                />
              </div>

              <div className="block text-sm font-medium text-gray-700 space-y-2">
                <label>End Date</label>
                <Calendar
                  minDate={new Date()}
                  value={batchFormData.endTime}
                  onChange={(date) => handleSelectDate("endTime", date)}
                />
              </div>

              <div className="block text-sm font-medium text-gray-700 space-y-2">
                <label>Open Date</label>
                <Calendar
                  minDate={new Date()}
                  value={batchFormData.openTime}
                  onChange={(date) => handleSelectDate("openTime", date)}
                />
              </div>

              <div className="block text-sm font-medium text-gray-700 space-y-2">
                <label>Close Date</label>
                <Calendar
                  minDate={new Date()}
                  value={batchFormData.closeTime}
                  onChange={(date) => handleSelectDate("closeTime", date)}
                />
              </div>
            </div>
          </SectionCard>

          {/* Basic Info Section */}
          <SectionCard
            title="Basic Info"
            className={isPublished ? "opacity-50 pointer-events-none" : ""}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <CommonSelect
                value={batchFormData.language}
                options={languageOptions}
                onChange={(value) => handleInputChange("language", value)}
                placeholder="Select Language"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Capacity
              </label>
              <Input
                type="number"
                value={batchFormData.maxCapacity}
                onChange={(e) =>
                  handleInputChange("maxCapacity", e.target.value)
                }
                placeholder="Enter maximum number of students"
                className="w-full"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {batchFormData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    variant="default"
                    className="bg-gray-800 text-white border-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      {tag.name}
                      <button
                        onClick={() => handleRemoveTag(tag.name)}
                        disabled={batchFormData.tags.length <= 1}
                        className={`ml-1 transition-colors ${
                          batchFormData.tags.length <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:text-gray-300"
                        }`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </Chip>
                ))}
              </div>
              <div className="flex gap-3">
                {" "}
                {/* Increased gap */}
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag (e.g., Programming, React)"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button
                  variant="secondary"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Add tags to help students discover your batch (at least 1
                required)
              </p>
            </div>

            {/* Subjects/Labels Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What you primarily taught in this batch?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {batchFormData.labels.map((subject, index) => (
                  <Chip
                    key={index}
                    variant="default"
                    className="bg-gray-800 text-white border-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      {subject.name}
                      <button
                        onClick={() => handleRemoveSubject(subject.name)}
                        disabled={batchFormData.labels.length <= 1}
                        className={`ml-1 transition-colors ${
                          batchFormData.labels.length <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:text-gray-300"
                        }`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </Chip>
                ))}
              </div>
              <div className="flex gap-3">
                {" "}
                {/* Increased gap */}
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add subject (e.g., Web Development, Finance)"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addSubject()}
                />
                <Button
                  variant="secondary"
                  onClick={addSubject}
                  disabled={!newSubject.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="block text-xs font-medium text-gray-500 mt-1">
                Add subjects you teach in this batch (at least 1 required)
              </p>
            </div>
          </SectionCard>

          {/* Media & Promotion Section */}
          <SectionCard title="Media & Promotion">
            {/* Batch Image Upload */}
            {batchId && (
              <FileUpload
                title="Batch Image"
                accept="image/*"
                purpose={UploadPurpose.BATCH_THUMBNAIL}
                courseId={batchId}
                src={batchFormData.image}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadFail}
              />
            )}

            {/* Promotional Video */}
            <div className="space-y-3 pt-4">
              <label className="text-lg font-semibold text-gray-900">
                Promotional Video Link
              </label>
              <Input
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  handleInputChange("videoLink", e.target.value);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {debouncedYoutubeUrl && (
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl">
                  <ReactPlayer
                    src={debouncedYoutubeUrl}
                    width="100%"
                    height="100%"
                    controls
                    config={{
                      youtube: {
                        rel: 0,
                        cc_load_policy: 1,
                      },
                    }}
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                Paste YouTube link to display promotional video on landing page
              </p>
            </div>
          </SectionCard>

          {/* Pricing Section */}
          <SectionCard
            title="Pricing"
            className={isPublished ? "opacity-50 pointer-events-none" : ""}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Batch Pricing Type
              </label>
              <div className="flex space-x-8">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="batchType"
                    checked={!isPaidBatch}
                    onChange={() => {
                      setIsPaidBatch(false);
                      updateBatchFormData({
                        paidBatch: false,
                        sellingPrice: 0,
                        actualPrice: 0,
                        amountUsd: 0,
                      });
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-base text-gray-700">Free Batch</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="batchType"
                    checked={isPaidBatch}
                    onChange={() => {
                      setIsPaidBatch(true);
                      updateBatchFormData({
                        paidBatch: true,
                      });
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-base text-gray-700">Paid Batch</span>
                </label>
              </div>
            </div>

            {/* Pricing Control */}
            {isPaidBatch && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <CommonSelect
                      value={batchFormData.currency}
                      options={currencyOptions}
                      onChange={(value) => {
                        handleInputChange("currency", value);
                      }}
                      placeholder="Select Currency"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount USD
                    </label>
                    <Input
                      type="number"
                      value={batchFormData.amountUsd}
                      onChange={(e) =>
                        handleInputChange("amountUsd", e.target.value)
                      }
                      placeholder="Enter the Amount Usd price"
                      rightIcon={<DollarSign />}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <Input
                      type="number"
                      value={batchFormData.actualPrice}
                      onChange={(e) =>
                        handleInputChange("actualPrice", e.target.value)
                      }
                      placeholder="Enter Original Price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price
                    </label>
                    <Input
                      type="number"
                      value={batchFormData.sellingPrice}
                      onChange={(e) =>
                        handleInputChange("sellingPrice", e.target.value)
                      }
                      placeholder="Enter Selling Price"
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">
                    Price Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="font-medium text-gray-900">
                        {batchFormData.actualPrice}{" "}
                        {batchFormData.currency?.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Selling Price:</span>
                      <span className="font-medium text-green-600">
                        {batchFormData.sellingPrice}{" "}
                        {batchFormData.currency?.toUpperCase()}
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-semibold">
                          Discount:{" "}
                        </span>
                        <span className="font-bold text-red-600">
                          {(() => {
                            const original =
                              Number(batchFormData.actualPrice) || 0;
                            const selling =
                              Number(batchFormData.sellingPrice) || 0;
                            const discount = original - selling;

                            // Check if original and selling price are valid numbers
                            if (isNaN(original) || isNaN(selling))
                              return "Invalid Price";

                            return discount > 0
                              ? `${discount.toLocaleString("en-US", {minimumFractionDigits: 0, maximumFractionDigits: 0})} ${batchFormData.currency?.toUpperCase()}`
                              : `0 ${batchFormData.currency?.toUpperCase() || ""}`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isPaidBatch && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Free Batch
                </h4>
                <p className="text-sm text-blue-700">
                  This batch will be available to all students at no cost.
                  Students can enroll directly without payment.
                </p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title={
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <span>Publish Batch</span>
          </div>
        }
        size="sm"
        hideCloseButton={isPublishing}
        closeOnOverlayClick={!isPublishing}
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowPublishModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmPublishBatch}
              disabled={isPublishing}
              leftIcon={
                isPublishing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )
              }
            >
              {isPublishing ? "Publishing..." : "Publish Batch"}
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to publish this batch? Once published, students
          will be able to enroll and access your content.
        </p>
      </Modal>
    </div>
  );
}
