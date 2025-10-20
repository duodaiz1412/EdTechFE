import {useState, useEffect} from "react";
import {Heading3} from "@/components/Typography";
import Input from "@/components/Input";
import CommonSelect from "@/components/CommonSelect";
import Button from "@/components/Button";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";

export default function PricingContent() {
  const {
    // Form data from context
    formData,
    updateFormData,

    // API State (from hook via context)
    state: courseState,
    updateCourse,
    isLoading,
    error,
  } = useCourseContext();
  const {course} = courseState;

  // Local state for UI-specific data (currency, prices)
  const [currency, setCurrency] = useState("VND");
  const [originalPrice, setOriginalPrice] = useState("0");
  const [sellingPrice, setSellingPrice] = useState("0");

  // Fill form with course data when course is loaded (only once)
  useEffect(() => {
    if (course && formData.originalPrice === 0) {
      updateFormData({
        currency: course.currency || "VND",
        originalPrice: course.coursePrice || 0,
        sellingPrice: course.sellingPrice || 0,
      });
    }
  }, [course, formData.originalPrice, updateFormData]);

  // Sync local state with formData
  useEffect(() => {
    setCurrency(formData.currency || "VND");
    setOriginalPrice(formData.originalPrice?.toString() || "0");
    setSellingPrice(formData.sellingPrice?.toString() || "0");
  }, [formData.currency, formData.originalPrice, formData.sellingPrice]);

  const currencyOptions = [
    {value: "VND", label: "VND"},
    {value: "USD", label: "USD"},
    {value: "EUR", label: "EUR"},
    {value: "GBP", label: "GBP"},
  ];

  const handleInputChange = (field: string, value: string) => {
    updateFormData({[field]: value} as any);
  };

  const handleSave = async () => {
    if (!course?.id) {
      toast.error("No course selected");
      return;
    }

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        coursePrice: formData.originalPrice,
        sellingPrice: formData.sellingPrice,
        tag: formData.tag || [],
        label: formData.label || [],
      };

      const success = await updateCourse(course.id, updateData);

      if (success) {
        toast.success("Pricing saved successfully!");
      } else {
        toast.error("Failed to save pricing");
      }
    } catch {
      toast.error("Error saving pricing");
    }
  };

  const formatPrice = (price: string) => {
    // Remove non-numeric characters and format with dots
    const numericPrice = price.replace(/[^\d]/g, "");
    return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (
    field: "originalPrice" | "sellingPrice",
    value: string,
  ) => {
    const formattedPrice = formatPrice(value);
    const numericValue = parseInt(formattedPrice.replace(/\./g, "")) || 0;

    if (field === "originalPrice") {
      setOriginalPrice(formattedPrice);
      updateFormData({originalPrice: numericValue});
    } else {
      setSellingPrice(formattedPrice);
      updateFormData({sellingPrice: numericValue});
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <Heading3>Course Pricing</Heading3>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <CommonSelect
            value={currency}
            onChange={(value) => {
              setCurrency(value);
              handleInputChange("currency", value);
            }}
            options={currencyOptions}
            placeholder="Select currency"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original price
          </label>
          <Input
            value={originalPrice}
            onChange={(e) => handlePriceChange("originalPrice", e.target.value)}
            placeholder="Enter original price"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling price
          </label>
          <Input
            value={sellingPrice}
            onChange={(e) => handlePriceChange("sellingPrice", e.target.value)}
            placeholder="Enter selling price"
            className="w-full"
          />
        </div>

        {/* Price Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Price Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Original Price:</span>
              <span className="font-medium">
                {originalPrice} {currency.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Selling Price:</span>
              <span className="font-medium text-green-600">
                {sellingPrice} {currency.toUpperCase()}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">
                  {(() => {
                    const original = parseInt(originalPrice.replace(/\./g, ""));
                    const selling = parseInt(sellingPrice.replace(/\./g, ""));
                    const discount = original - selling;
                    return discount > 0
                      ? `${discount.toLocaleString("vi-VN")} ${currency.toUpperCase()}`
                      : "0 VND";
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
