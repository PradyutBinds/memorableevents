import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminGetSettings, useUpdateSettings, getAdminGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Globe, Phone, MapPin, Users, Palette, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Social Media", icon: Users },
  { id: "hero", label: "Hero Content", icon: Palette },
];

export default function Settings() {
  const { data: settings, isLoading } = useAdminGetSettings();
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    siteName: "",
    tagline: "",
    aboutText: "",
    address: "",
    phone: "",
    email: "",
    whatsapp: "",
    facebook: "",
    heroHeadline: "",
    heroSubheadline: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName || "",
        tagline: settings.tagline || "",
        aboutText: settings.aboutText || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        whatsapp: settings.whatsapp || "",
        facebook: settings.facebook || "",
        heroHeadline: settings.heroHeadline || "",
        heroSubheadline: settings.heroSubheadline || "",
      });
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings.mutate({ data: form }, {
      onSuccess: () => {
        toast({ title: "Settings saved", description: "Your changes are now live on the site." });
        queryClient.invalidateQueries({ queryKey: getAdminGetSettingsQueryKey() });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save settings. Please try again.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your public-facing content and contact information</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="rounded-none h-10 px-6 uppercase tracking-widest text-xs gap-2"
          >
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Tab Sidebar */}
          <div className="w-48 shrink-0 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl p-8 space-y-6"
            >
              {activeTab === "general" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">General Settings</h2>
                    <p className="text-sm text-muted-foreground">Basic information about your business.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Site Name</Label>
                      <Input
                        value={form.siteName}
                        onChange={e => handleChange("siteName", e.target.value)}
                        placeholder="Memorable Events"
                        className="rounded-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">Appears in the browser tab and navigation.</p>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Tagline</Label>
                      <Input
                        value={form.tagline}
                        onChange={e => handleChange("tagline", e.target.value)}
                        placeholder="Orchestrating elite weddings and events in the Himalayas"
                        className="rounded-none"
                      />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">About Text</Label>
                      <Textarea
                        value={form.aboutText}
                        onChange={e => handleChange("aboutText", e.target.value)}
                        placeholder="Tell your story…"
                        className="rounded-none min-h-[140px] resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">Shown in the homepage "Our Story" section.</p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "contact" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Contact Information</h2>
                    <p className="text-sm text-muted-foreground">Your address, phone, and email shown across the site.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                        <MapPin className="w-3.5 h-3.5 inline mr-1" />Address
                      </Label>
                      <Textarea
                        value={form.address}
                        onChange={e => handleChange("address", e.target.value)}
                        placeholder="Old Bus Stand Rd, Krishna Nagar, Shimla, Himachal Pradesh 171001"
                        className="rounded-none min-h-[80px] resize-none"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                          <Phone className="w-3.5 h-3.5 inline mr-1" />Phone Number
                        </Label>
                        <Input
                          value={form.phone}
                          onChange={e => handleChange("phone", e.target.value)}
                          placeholder="9816585535"
                          className="rounded-none"
                        />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">WhatsApp Number</Label>
                        <Input
                          value={form.whatsapp}
                          onChange={e => handleChange("whatsapp", e.target.value)}
                          placeholder="9816585535"
                          className="rounded-none"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Email Address</Label>
                      <Input
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                        placeholder="info@universalagencies.in"
                        className="rounded-none"
                        type="email"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "social" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Social Media</h2>
                    <p className="text-sm text-muted-foreground">Your social profiles — linked in the footer and contact page.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Facebook URL</Label>
                      <Input
                        value={form.facebook}
                        onChange={e => handleChange("facebook", e.target.value)}
                        placeholder="https://facebook.com/universalagencies"
                        className="rounded-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "hero" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Hero Content</h2>
                    <p className="text-sm text-muted-foreground">The headline and subheadline shown on the homepage hero section.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Hero Headline</Label>
                      <Input
                        value={form.heroHeadline}
                        onChange={e => handleChange("heroHeadline", e.target.value)}
                        placeholder="Your Dream Event, Perfectly Orchestrated"
                        className="rounded-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">Keep it short and impactful — this is the first thing visitors see.</p>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Hero Subheadline</Label>
                      <Textarea
                        value={form.heroSubheadline}
                        onChange={e => handleChange("heroSubheadline", e.target.value)}
                        placeholder="From intimate mountain weddings to grand corporate galas…"
                        className="rounded-none min-h-[100px] resize-none"
                      />
                    </div>
                    <div className="p-4 bg-muted/40 border border-border rounded-lg">
                      <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-widest">Live Preview</p>
                      <div className="bg-secondary/80 p-6 rounded-md">
                        <p className="text-primary text-xs uppercase tracking-widest mb-2">Shimla's Premier Event Architects</p>
                        <h3 className="text-white font-serif text-2xl mb-2">{form.heroHeadline || "Your Dream Event, Perfectly Orchestrated"}</h3>
                        <p className="text-white/70 text-sm">{form.heroSubheadline || "From intimate mountain weddings to grand corporate galas…"}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Save Button (bottom) */}
        <div className="flex justify-end border-t border-border pt-6">
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            size="lg"
            className="rounded-none px-10 h-12 uppercase tracking-widest text-sm gap-2"
          >
            {updateSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
