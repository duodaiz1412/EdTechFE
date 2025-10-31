import {useState, useEffect} from "react";
import {
  Heading2,
  Heading3,
  BodyRegular,
  CaptionRegular,
} from "@/components/Typography";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {
  InstructorService,
  ICreatePayOSConfigRequest,
  IPayOSConfigResponse,
  IUpdatePayOSConfigRequest,
} from "@/lib/services/instructor.services";
import {toast} from "@/hooks/use-toast";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {
  Eye,
  EyeOff,
  CreditCard,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function SetPayment() {
  const [currentConfig, setCurrentConfig] =
    useState<IPayOSConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showChecksumKey, setShowChecksumKey] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<ICreatePayOSConfigRequest>({
    clientId: "",
    apiKey: "",
    checksumKey: "",
    accountNumber: "",
  });

  // Load current PayOS config
  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    setIsLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        setError("Unable to get authentication token");
        return;
      }

      const response = await InstructorService.getMyPayOSConfig(accessToken);
      setCurrentConfig(response.data);
    } catch (error: any) {
      // Don't show error if no config exists
      if (error.response?.status !== 404) {
        setError("Unable to load current PayOS configuration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ICreatePayOSConfigRequest,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    setShowForm(true);
    setFormData({
      clientId: "",
      apiKey: "",
      checksumKey: "",
      accountNumber: "",
    });
    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    if (!currentConfig) return;

    setIsEditing(true);
    setShowForm(true);
    setFormData({
      clientId: currentConfig.clientId,
      apiKey: "", // Don't show old API key because of security
      checksumKey: "", // Don't show old checksum key because of security
      accountNumber: currentConfig.accountNumber,
    });
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormData({
      clientId: "",
      apiKey: "",
      checksumKey: "",
      accountNumber: "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!isEditing) {
      if (
        !formData.clientId ||
        !formData.apiKey ||
        !formData.checksumKey ||
        !formData.accountNumber
      ) {
        setError("Please fill in all required information");
        return;
      }
    } else {
      // Editing: clientId and accountNumber required; apiKey/checksumKey optional
      if (!formData.clientId || !formData.accountNumber) {
        setError(
          "Please fill in required fields: Client ID and Account Number",
        );
        return;
      }
    }

    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        setError("Unable to get authentication token");
        return;
      }

      let response;
      if (isEditing && currentConfig) {
        const updatePayload: IUpdatePayOSConfigRequest = {};
        // always allow updating these two
        if (formData.clientId) updatePayload.clientId = formData.clientId;
        if (formData.accountNumber)
          updatePayload.accountNumber = formData.accountNumber;
        // only send secrets if user typed something
        if (formData.apiKey) updatePayload.apiKey = formData.apiKey;
        if (formData.checksumKey)
          updatePayload.checksumKey = formData.checksumKey;

        response = await InstructorService.updatePayOSConfig(
          currentConfig.id,
          updatePayload,
          accessToken,
        );
      } else {
        response = await InstructorService.createPayOSConfig(
          formData,
          accessToken,
        );
      }
      setCurrentConfig(response.data);
      setSuccess(
        isEditing
          ? "PayOS configuration updated successfully!"
          : "PayOS configuration created successfully!",
      );

      toast({
        title: isEditing
          ? "PayOS updated successfully"
          : "PayOS configuration created",
        description: isEditing
          ? "Your payment configuration has been updated."
          : "A new PayOS payment configuration has been created.",
      });

      // Hide form and reset
      setShowForm(false);
      setIsEditing(false);
      setFormData({
        clientId: "",
        apiKey: "",
        checksumKey: "",
        accountNumber: "",
      });
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "An error occurred while creating PayOS configuration",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <Heading2 className="mb-2">Payment Settings</Heading2>
        <BodyRegular className="text-gray-600">
          Manage PayOS configuration to receive payments from students
        </BodyRegular>
      </div>

      {/* Current PayOS Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <Heading3>Current PayOS Configuration</Heading3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
            <span className="ml-2">Loading...</span>
          </div>
        ) : currentConfig ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <CaptionRegular className="text-green-600 font-medium">
                  PayOS configuration has been set up
                </CaptionRegular>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                leftIcon={<Settings className="w-4 h-4" />}
              >
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CaptionRegular className="text-gray-500 mb-1">
                  Client ID (PayOS)
                </CaptionRegular>
                <BodyRegular className="font-mono bg-gray-50 p-2 rounded border">
                  {currentConfig.clientId}
                </BodyRegular>
              </div>

              <div>
                <CaptionRegular className="text-gray-500 mb-1">
                  Account Number (User ID)
                </CaptionRegular>
                <BodyRegular className="font-mono bg-gray-50 p-2 rounded border">
                  {currentConfig.accountNumber}
                </BodyRegular>
              </div>

              <div>
                <CaptionRegular className="text-gray-500 mb-1">
                  Status
                </CaptionRegular>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${currentConfig.isActive ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <CaptionRegular
                    className={
                      currentConfig.isActive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {currentConfig.isActive ? "Active" : "Inactive"}
                  </CaptionRegular>
                </div>
              </div>

              <div>
                <CaptionRegular className="text-gray-500 mb-1">
                  Created Date
                </CaptionRegular>
                <BodyRegular className="bg-gray-50 p-2 rounded border">
                  {new Date(currentConfig.createdAt).toLocaleDateString(
                    "en-US",
                  )}
                </BodyRegular>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <CaptionRegular className="text-amber-600">
                No PayOS configuration found. Please create a new configuration.
              </CaptionRegular>
            </div>
            <Button
              onClick={handleCreateNew}
              leftIcon={<Settings className="w-4 h-4" />}
            >
              Create New Configuration
            </Button>
          </div>
        )}
      </div>

      {/* PayOS Configuration Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <Heading3>
                {isEditing
                  ? "Edit PayOS Configuration"
                  : "Create New PayOS Configuration"}
              </Heading3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Client ID"
              isRequired
              placeholder="Enter PayOS Client ID"
              value={formData.clientId}
              onChange={(e) => handleInputChange("clientId", e.target.value)}
              helperText="Client ID from PayOS dashboard"
            />

            <Input
              label="Account Number"
              isRequired
              placeholder={"Enter bank account number"}
              value={formData.accountNumber}
              onChange={(e) =>
                handleInputChange("accountNumber", e.target.value)
              }
              helperText="Bank account number for receiving payments"
            />

            <Input
              label="API Key"
              isRequired
              type={showApiKey ? "text" : "password"}
              placeholder={
                isEditing
                  ? "Enter new API Key (leave blank if no change)"
                  : "Enter API Key from PayOS"
              }
              value={formData.apiKey}
              onChange={(e) => handleInputChange("apiKey", e.target.value)}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="hover:text-gray-600"
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4 align-middle text-center" />
                  ) : (
                    <Eye className="w-4 h-4 align-middle text-center" />
                  )}
                </button>
              }
              helperText={
                isEditing
                  ? "Secure API Key from PayOS (leave blank if no change)"
                  : "Secure API Key from PayOS"
              }
            />

            <Input
              label="Checksum Key"
              isRequired
              type={showChecksumKey ? "text" : "password"}
              placeholder={
                isEditing
                  ? "Enter new Checksum Key (leave blank if no change)"
                  : "Enter Checksum Key from PayOS"
              }
              value={formData.checksumKey}
              onChange={(e) => handleInputChange("checksumKey", e.target.value)}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowChecksumKey(!showChecksumKey)}
                  className="hover:text-gray-600"
                >
                  {showChecksumKey ? (
                    <EyeOff className="w-4 h-4 align-middle text-center" />
                  ) : (
                    <Eye className="w-4 h-4 align-middle text-center" />
                  )}
                </button>
              }
              helperText={
                isEditing
                  ? "Checksum Key for authentication from PayOS (leave blank if no change)"
                  : "Checksum Key for authentication from PayOS"
              }
            />

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <CaptionRegular className="text-red-600">
                  {error}
                </CaptionRegular>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <CaptionRegular className="text-green-600">
                  {success}
                </CaptionRegular>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                loading={isCreating}
                disabled={
                  isEditing
                    ? !formData.clientId || !formData.accountNumber
                    : !formData.clientId ||
                      !formData.apiKey ||
                      !formData.checksumKey ||
                      !formData.accountNumber
                }
                className="flex-1 md:flex-none"
              >
                {isCreating
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Configuration"
                    : "Create PayOS Configuration"}
              </Button>

              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Information Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <Heading3 className="text-blue-800 mb-3">
          Important Information
        </Heading3>
        <div className="space-y-2 text-blue-700">
          <BodyRegular>
            • PayOS information is encrypted and absolutely secure
          </BodyRegular>
          <BodyRegular>
            • Only one PayOS configuration can be active at a time
          </BodyRegular>
          <BodyRegular>
            • Contact PayOS to get Client ID, API Key and Checksum Key
          </BodyRegular>
          <BodyRegular>
            • Account Number is your bank account number
          </BodyRegular>
          <BodyRegular>
            • After setup, students can pay directly for your courses
          </BodyRegular>
        </div>
      </div>
    </div>
  );
}
