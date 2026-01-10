import React, { useState } from "react";
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ChangePasswordFormProps {
  onSubmit?: (data: PasswordFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const passwordRequirements = [
  { id: "length", label: "At least 8 characters", labelAr: "على الأقل 8 أحرف", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", labelAr: "حرف كبير واحد", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", labelAr: "حرف صغير واحد", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number", labelAr: "رقم واحد", test: (p: string) => /\d/.test(p) },
  { id: "special", label: "One special character", labelAr: "رمز خاص واحد", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function ChangePasswordForm({
  onSubmit,
  isLoading = false,
  error = null,
  success = false,
}: ChangePasswordFormProps) {
  const { direction, language } = useLanguage();
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const allRequirementsMet = passwordRequirements.every((req) => req.test(formData.newPassword));
  const isValid =
    formData.currentPassword.length > 0 &&
    allRequirementsMet &&
    passwordsMatch &&
    formData.confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={direction}>
      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 text-green-600 border border-green-200">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            {language === "ar"
              ? "تم تغيير كلمة المرور بنجاح"
              : "Password changed successfully"}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">
          {language === "ar" ? "كلمة المرور الحالية" : "Current Password"}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("currentPassword")}
            className="pl-10 pr-10"
            placeholder={language === "ar" ? "أدخل كلمة المرور الحالية" : "Enter current password"}
            disabled={isLoading}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">
          {language === "ar" ? "كلمة المرور الجديدة" : "New Password"}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("newPassword")}
            className="pl-10 pr-10"
            placeholder={language === "ar" ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
            disabled={isLoading}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Password Requirements */}
        {touched.newPassword && formData.newPassword.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-muted-foreground">
              {language === "ar" ? "متطلبات كلمة المرور:" : "Password requirements:"}
            </p>
            <ul className="space-y-1">
              {passwordRequirements.map((req) => {
                const passed = req.test(formData.newPassword);
                return (
                  <li
                    key={req.id}
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors",
                      passed ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    <CheckCircle2
                      className={cn(
                        "h-4 w-4",
                        passed ? "text-green-600" : "text-muted-foreground/40"
                      )}
                    />
                    {language === "ar" ? req.labelAr : req.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          {language === "ar" ? "تأكيد كلمة المرور" : "Confirm New Password"}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("confirmPassword")}
            className={cn(
              "pl-10 pr-10",
              touched.confirmPassword &&
                formData.confirmPassword.length > 0 &&
                !passwordsMatch &&
                "border-destructive focus-visible:ring-destructive"
            )}
            placeholder={language === "ar" ? "أعد إدخال كلمة المرور الجديدة" : "Re-enter new password"}
            disabled={isLoading}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {touched.confirmPassword && formData.confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-sm text-destructive">
            {language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match"}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {language === "ar" ? "جارٍ التحديث..." : "Updating..."}
          </>
        ) : language === "ar" ? (
          "تغيير كلمة المرور"
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
}
