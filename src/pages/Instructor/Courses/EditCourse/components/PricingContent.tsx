import {useState} from "react";
import {Heading3} from "@/components/Typography";
import Input from "@/components/Input";
import CommonSelect from "@/components/CommonSelect";
import Button from "@/components/Button";

export default function PricingContent() {
  const [pricingData, setPricingData] = useState({
    currency: "vnd",
    originalPrice: "1.000.000",
    sellingPrice: "600.000",
  });

  const currencyOptions = [
    {value: "vnd", label: "VND"},
    {value: "usd", label: "USD"},
    {value: "eur", label: "EUR"},
    {value: "gbp", label: "GBP"},
  ];

  const handleInputChange = (field: string, value: string) => {
    setPricingData((prev) => ({...prev, [field]: value}));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    alert("Pricing saved!");
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
    handleInputChange(field, formattedPrice);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <Heading3>Course Pricing</Heading3>
        <Button
          onClick={handleSave}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          Save
        </Button>
      </div>

      <div className="max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <CommonSelect
            value={pricingData.currency}
            onChange={(value) => handleInputChange("currency", value)}
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
            value={pricingData.originalPrice}
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
            value={pricingData.sellingPrice}
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
                {pricingData.originalPrice} {pricingData.currency.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Selling Price:</span>
              <span className="font-medium text-green-600">
                {pricingData.sellingPrice} {pricingData.currency.toUpperCase()}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">
                  {(() => {
                    const original = parseInt(
                      pricingData.originalPrice.replace(/\./g, ""),
                    );
                    const selling = parseInt(
                      pricingData.sellingPrice.replace(/\./g, ""),
                    );
                    const discount = original - selling;
                    return discount > 0
                      ? `${discount.toLocaleString("vi-VN")} ${pricingData.currency.toUpperCase()}`
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
