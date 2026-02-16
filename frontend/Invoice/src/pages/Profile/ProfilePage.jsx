import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { Loader2, Mail, User, Building, Phone, MapPin } from "lucide-react";
import Button from "../../components/ui/Button";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          businessName: res.data.businessName || "",
          address: res.data.address || "",
          phone: res.data.phone || "",
        });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, formData);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-slate-200">
        Profile Settings
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl border border-zinc-700 space-y-8"
      >
        {/* Email */}
        <div>
          <label className="block text-sm text-slate-200 mb-2">
            Email Address
          </label>
          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3">
            <Mail className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-transparent py-2 text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm text-slate-200 mb-2">Full Name</label>
          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3">
            <User className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent py-2 text-slate-300 outline-none"
            />
          </div>
        </div>

        {/* Business Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-1">
            Business Information
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            This will be used to pre-fill the "Bill From" section of your
            invoices
          </p>

          {/* Business Name */}
          <div className="mb-4">
            <label className="block text-sm text-slate-200 mb-2">
              Business Name
            </label>
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3">
              <Building className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full bg-transparent py-2 text-slate-300 outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm text-slate-200 mb-2">Address</label>
            <div className="flex items-start bg-zinc-800 border border-zinc-700 rounded-lg px-3">
              <MapPin className="w-4 h-4 text-slate-400 mr-2 mt-3" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full bg-transparent py-2 text-slate-300 outline-none resize-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Phone</label>
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3">
              <Phone className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent py-2 text-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            {saving ? "Saving..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
