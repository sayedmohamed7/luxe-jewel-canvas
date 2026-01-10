import React from "react";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ChangePasswordForm, PasswordFormData } from "@/components/profile/ChangePasswordForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function ProfileSettings() {
  const { direction, language } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handlePasswordChange = async (data: PasswordFormData) => {
    // UI-only handler - would connect to API
    setIsLoading(true);
    setSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setSuccess(true);
    toast.success(
      language === "ar"
        ? "تم تغيير كلمة المرور بنجاح"
        : "Password changed successfully"
    );

    console.log("Password change data:", data);
  };

  return (
    <ProfileLayout>
      <div className="max-w-2xl mx-auto" dir={direction}>
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold">
            {language === "ar" ? "الإعدادات" : "Settings"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {language === "ar"
              ? "إدارة إعدادات حسابك"
              : "Manage your account settings"}
          </p>
        </div>

        {/* Change Password Section */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium mb-6">
            {language === "ar" ? "تغيير كلمة المرور" : "Change Password"}
          </h3>
          <ChangePasswordForm
            onSubmit={handlePasswordChange}
            isLoading={isLoading}
            success={success}
          />
        </div>
      </div>
    </ProfileLayout>
  );
}
