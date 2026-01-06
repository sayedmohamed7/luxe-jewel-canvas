import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

// Comprehensive translations for the luxury jewelry site
export const translations: Translations = {
  // Navigation
  "nav.collections": { en: "Collections", ar: "المجموعات" },
  "nav.rings": { en: "Rings", ar: "الخواتم" },
  "nav.necklaces": { en: "Necklaces", ar: "القلائد" },
  "nav.bracelets": { en: "Bracelets", ar: "الأساور" },
  "nav.earrings": { en: "Earrings", ar: "الأقراط" },
  "nav.ourStory": { en: "Our Story", ar: "قصتنا" },
  "nav.contact": { en: "Contact", ar: "اتصل بنا" },
  "nav.currency": { en: "Currency", ar: "العملة" },
  "nav.language": { en: "Language", ar: "اللغة" },
  "nav.login": { en: "Login", ar: "تسجيل الدخول" },
  "nav.register": { en: "Register", ar: "إنشاء حساب" },

  // Hero Section
  "hero.subtitle": { en: "The New Collection", ar: "المجموعة الجديدة" },
  "hero.title1": { en: "Eternal", ar: "سحر" },
  "hero.title2": { en: "Radiance", ar: "أبدي" },
  "hero.description": {
    en: "Discover our latest collection, where timeless elegance meets contemporary design.",
    ar: "اكتشفي مجموعتنا الأحدث، حيث تلتقي الأناقة الخالدة بالتصميم العصري."
  },
  "hero.cta": { en: "Explore Collection", ar: "استكشفي المجموعة" },

  // Featured Products
  "featured.subtitle": { en: "Curated Selection", ar: "اختيار منتقى" },
  "featured.title": { en: "Bestselling Pieces", ar: "القطع الأكثر مبيعاً" },
  "featured.viewAll": { en: "View All Collections", ar: "عرض جميع المجموعات" },

  // Collection Banner
  "collection.subtitle": { en: "Signature Collection", ar: "المجموعة المميزة" },
  "collection.title1": { en: "The Art of", ar: "فن" },
  "collection.title2": { en: "Wearing Gold", ar: "ارتداء الذهب" },
  "collection.description": {
    en: "Each piece is a testament to the enduring allure of gold, meticulously crafted by master artisans.",
    ar: "كل قطعة هي شهادة على سحر الذهب الدائم، مصنوعة بدقة متناهية على يد حرفيين بارعين."
  },
  "collection.cta": { en: "Discover More", ar: "اكتشفي المزيد" },

  // Categories
  "categories.subtitle": { en: "Browse By", ar: "تصفحي حسب" },
  "categories.title": { en: "Categories", ar: "الفئات" },

  // Craftsmanship
  "craft.subtitle": { en: "Our Heritage", ar: "تراثنا" },
  "craft.title1": { en: "Crafted with", ar: "صُنع" },
  "craft.title2": { en: "Passion", ar: "بشغف" },
  "craft.description1": {
    en: "For over three decades, Le Bijou Boutique has been creating exceptional jewelry that transcends time. Our master artisans combine centuries-old techniques with contemporary design to craft pieces that become cherished heirlooms.",
    ar: "على مدى أكثر من ثلاثة عقود، تصنع لو بيجو بوتيك مجوهرات استثنائية تتجاوز حدود الزمن. يجمع حرفيونا البارعون بين التقنيات العريقة والتصميم المعاصر لصنع قطع تصبح إرثاً عائلياً عزيزاً."
  },
  "craft.description2": {
    en: "Every gemstone is hand-selected, every setting precision-crafted, and every piece finished to perfection.",
    ar: "كل حجر كريم مختار بعناية، كل إطار مصنوع بدقة متناهية، وكل قطعة منجزة بإتقان تام."
  },
  "craft.cta": { en: "Our Story", ar: "قصتنا" },

  // Trust Indicators
  "trust.delivery.title": { en: "Complimentary Delivery", ar: "توصيل مجاني" },
  "trust.delivery.desc": { en: "Free shipping across the UAE on all orders", ar: "شحن مجاني في جميع أنحاء الإمارات على كافة الطلبات" },
  "trust.warranty.title": { en: "Lifetime Warranty", ar: "ضمان مدى الحياة" },
  "trust.warranty.desc": { en: "Every piece is backed by our quality guarantee", ar: "كل قطعة مدعومة بضمان الجودة الخاص بنا" },
  "trust.returns.title": { en: "30-Day Returns", ar: "إرجاع خلال ٣٠ يوماً" },
  "trust.returns.desc": { en: "Hassle-free returns within 30 days of purchase", ar: "إرجاع سهل خلال ٣٠ يوماً من الشراء" },

  // Product Actions
  "product.addToBag": { en: "Add to Bag", ar: "أضيفي إلى الحقيبة" },
  "product.addToWishlist": { en: "Add to Wishlist", ar: "أضيفي إلى المفضلة" },
  "product.inWishlist": { en: "In Wishlist", ar: "في المفضلة" },
  "product.viewDetails": { en: "View Details", ar: "عرض التفاصيل" },
  "product.quickView": { en: "Quick View", ar: "عرض سريع" },
  "product.addedToBag": { en: "Added to bag", ar: "أُضيفت إلى الحقيبة" },
  "product.addedToBagDesc": { en: "has been added to your shopping bag.", ar: "تمت إضافتها إلى حقيبة التسوق الخاصة بكِ." },

  // Collections Page
  "collections.subtitle": { en: "Explore", ar: "استكشفي" },
  "collections.title": { en: "Collections", ar: "المجموعات" },
  "collections.description": {
    en: "Discover our curated selection of exceptional jewelry, each piece a testament to timeless elegance.",
    ar: "اكتشفي مجموعتنا المختارة من المجوهرات الاستثنائية، كل قطعة شهادة على الأناقة الخالدة."
  },
  "collections.pieces": { en: "pieces", ar: "قطع" },
  "collections.all": { en: "All", ar: "الكل" },
  "collections.noResults": { en: "No pieces found", ar: "لم يتم العثور على قطع" },
  "collections.noResultsDesc": { en: "Try adjusting your filters to discover more.", ar: "جربي تعديل الفلاتر للاكتشاف المزيد." },

  // Sort Options
  "sort.featured": { en: "Featured", ar: "المميزة" },
  "sort.priceAsc": { en: "Price: Low to High", ar: "السعر: من الأقل للأعلى" },
  "sort.priceDesc": { en: "Price: High to Low", ar: "السعر: من الأعلى للأقل" },
  "sort.newest": { en: "Newest", ar: "الأحدث" },

  // Footer
  "footer.newsletter.title": { en: "Join Our World", ar: "انضمي إلى عالمنا" },
  "footer.newsletter.desc": {
    en: "Subscribe for exclusive access to new collections, private events, and personalized offers.",
    ar: "اشتركي للوصول الحصري إلى المجموعات الجديدة والفعاليات الخاصة والعروض المخصصة."
  },
  "footer.newsletter.placeholder": { en: "Enter your email", ar: "أدخلي بريدكِ الإلكتروني" },
  "footer.newsletter.button": { en: "Subscribe", ar: "اشتراك" },
  "footer.shop": { en: "Shop", ar: "تسوقي" },
  "footer.about": { en: "About", ar: "عنا" },
  "footer.aboutUs": { en: "About Us", ar: "من نحن" },
  "footer.craftsmanship": { en: "Craftsmanship", ar: "الحرفية" },
  "footer.sustainability": { en: "Sustainability", ar: "الاستدامة" },
  "footer.careers": { en: "Careers", ar: "الوظائف" },
  "footer.support": { en: "Support", ar: "الدعم" },
  "footer.shipping": { en: "Shipping", ar: "الشحن" },
  "footer.returns": { en: "Returns", ar: "الإرجاع" },
  "footer.faq": { en: "FAQ", ar: "الأسئلة الشائعة" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.terms": { en: "Terms of Service", ar: "شروط الخدمة" },

  // Cart
  "cart.title": { en: "Shopping Bag", ar: "حقيبة التسوق" },
  "cart.empty": { en: "Your bag is empty", ar: "حقيبتكِ فارغة" },
  "cart.emptyDesc": { en: "Discover our collections and add something beautiful.", ar: "اكتشفي مجموعاتنا وأضيفي شيئاً جميلاً." },
  "cart.continueShopping": { en: "Continue Shopping", ar: "متابعة التسوق" },
  "cart.subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "cart.shipping": { en: "Shipping", ar: "الشحن" },
  "cart.shippingCalc": { en: "Calculated at checkout", ar: "يُحسب عند الدفع" },
  "cart.total": { en: "Total", ar: "المجموع" },
  "cart.checkout": { en: "Proceed to Checkout", ar: "المتابعة إلى الدفع" },
  "cart.orderSummary": { en: "Order Summary", ar: "ملخص الطلب" },

  // Wishlist
  "wishlist.title": { en: "Wishlist", ar: "قائمة الأمنيات" },
  "wishlist.empty": { en: "Your wishlist is empty", ar: "قائمة أمنياتكِ فارغة" },
  "wishlist.emptyDesc": { en: "Save your favorite pieces for later.", ar: "احفظي قطعكِ المفضلة للوقت اللاحق." },

  // Checkout
  "checkout.title": { en: "Checkout", ar: "الدفع" },
  "checkout.information": { en: "Information", ar: "المعلومات" },
  "checkout.shipping": { en: "Shipping", ar: "الشحن" },
  "checkout.payment": { en: "Payment", ar: "الدفع" },
  "checkout.email": { en: "Email", ar: "البريد الإلكتروني" },
  "checkout.firstName": { en: "First Name", ar: "الاسم الأول" },
  "checkout.lastName": { en: "Last Name", ar: "اسم العائلة" },
  "checkout.address": { en: "Address", ar: "العنوان" },
  "checkout.city": { en: "City", ar: "المدينة" },
  "checkout.country": { en: "Country", ar: "الدولة" },
  "checkout.phone": { en: "Phone", ar: "الهاتف" },
  "checkout.continueToShipping": { en: "Continue to Shipping", ar: "المتابعة إلى الشحن" },
  "checkout.continueToPayment": { en: "Continue to Payment", ar: "المتابعة إلى الدفع" },
  "checkout.placeOrder": { en: "Place Order", ar: "تأكيد الطلب" },
  "checkout.secure": { en: "Secure Checkout", ar: "دفع آمن" },
  "checkout.secureDesc": { en: "Your payment information is encrypted", ar: "معلومات الدفع الخاصة بكِ مشفرة" },
  "checkout.freeShipping": { en: "Free Shipping", ar: "شحن مجاني" },
  "checkout.freeShippingDesc": { en: "Complimentary delivery on all orders", ar: "توصيل مجاني على جميع الطلبات" },
  "checkout.loginRequired": { en: "Please log in to checkout", ar: "يرجى تسجيل الدخول للمتابعة" },

  // Contact
  "contact.subtitle": { en: "Get in Touch", ar: "تواصلي معنا" },
  "contact.title": { en: "Contact Us", ar: "اتصلي بنا" },
  "contact.description": {
    en: "We're here to assist you with any questions about our collections, orders, or services.",
    ar: "نحن هنا لمساعدتكِ في أي استفسارات حول مجموعاتنا أو طلباتكِ أو خدماتنا."
  },
  "contact.name": { en: "Name", ar: "الاسم" },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني" },
  "contact.subject": { en: "Subject", ar: "الموضوع" },
  "contact.message": { en: "Message", ar: "الرسالة" },
  "contact.send": { en: "Send Message", ar: "إرسال الرسالة" },
  "contact.visitUs": { en: "Visit Us", ar: "زورينا" },
  "contact.callUs": { en: "Call Us", ar: "اتصلي بنا" },
  "contact.emailUs": { en: "Email Us", ar: "راسلينا" },
  "contact.hours": { en: "Opening Hours", ar: "ساعات العمل" },
  "contact.hoursValue": { en: "Saturday - Thursday: 10am - 10pm", ar: "السبت - الخميس: ١٠ ص - ١٠ م" },

  // About
  "about.heritage.subtitle": { en: "Our Heritage", ar: "تراثنا" },
  "about.heritage.title": { en: "A Legacy of Excellence", ar: "إرث من التميز" },
  "about.values.title": { en: "Our Values", ar: "قيمنا" },
  "about.craftsmanship.title": { en: "Master Craftsmanship", ar: "إتقان الحرفة" },
  "about.quality.title": { en: "Uncompromising Quality", ar: "جودة لا تُضاهى" },
  "about.sustainability.title": { en: "Sustainable Practices", ar: "ممارسات مستدامة" },
  "about.service.title": { en: "Personalized Service", ar: "خدمة مخصصة" },

  // Auth
  "auth.welcomeBack": { en: "Welcome Back", ar: "مرحباً بعودتكِ" },
  "auth.loginSubtitle": { en: "Sign in to your account to continue", ar: "سجلي الدخول إلى حسابكِ للمتابعة" },
  "auth.registerSubtitle": { en: "Join LE BIJOU Boutique for exclusive access", ar: "انضمي إلى لو بيجو بوتيك للوصول الحصري" },
  "auth.email": { en: "Email", ar: "البريد الإلكتروني" },
  "auth.emailPlaceholder": { en: "your@email.com", ar: "بريدك@الإلكتروني.com" },
  "auth.password": { en: "Password", ar: "كلمة المرور" },
  "auth.passwordPlaceholder": { en: "Enter your password", ar: "أدخلي كلمة المرور" },
  "auth.confirmPassword": { en: "Confirm Password", ar: "تأكيد كلمة المرور" },
  "auth.confirmPasswordPlaceholder": { en: "Confirm your password", ar: "أكدي كلمة المرور" },
  "auth.firstName": { en: "First Name", ar: "الاسم الأول" },
  "auth.firstNamePlaceholder": { en: "Your first name", ar: "اسمكِ الأول" },
  "auth.lastName": { en: "Last Name", ar: "اسم العائلة" },
  "auth.lastNamePlaceholder": { en: "Your last name", ar: "اسم العائلة" },
  "auth.signIn": { en: "Sign In", ar: "تسجيل الدخول" },
  "auth.createAccount": { en: "Create Account", ar: "إنشاء حساب" },
  "auth.orContinueWith": { en: "or continue with", ar: "أو تابعي باستخدام" },
  "auth.continueWithGoogle": { en: "Continue with Google", ar: "المتابعة بحساب جوجل" },
  "auth.continueWithMicrosoft": { en: "Continue with Microsoft", ar: "المتابعة بحساب مايكروسوفت" },
  "auth.noAccount": { en: "Don't have an account?", ar: "ليس لديكِ حساب؟" },
  "auth.hasAccount": { en: "Already have an account?", ar: "لديكِ حساب بالفعل؟" },
  "auth.logout": { en: "Logout", ar: "تسجيل الخروج" },
  "auth.loginError": { en: "Invalid email or password", ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
  "auth.registerError": { en: "Unable to create account. Please try again.", ar: "تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى." },
  "auth.passwordMismatch": { en: "Passwords do not match", ar: "كلمات المرور غير متطابقة" },
  "auth.passwordTooShort": { en: "Password must be at least 8 characters", ar: "يجب أن تكون كلمة المرور ٨ أحرف على الأقل" },
  "auth.passwordRequirements": { en: "At least 8 characters", ar: "٨ أحرف على الأقل" },

  // Profile
  "profile.welcome": { en: "Welcome", ar: "مرحباً" },
  "profile.personalInfo": { en: "Personal Information", ar: "المعلومات الشخصية" },
  "profile.personalInfoDesc": { en: "Manage your personal details", ar: "إدارة بياناتكِ الشخصية" },
  "profile.myOrders": { en: "My Orders", ar: "طلباتي" },
  "profile.myOrdersDesc": { en: "Track and view your orders", ar: "تتبعي وعرض طلباتكِ" },
  "profile.wishlist": { en: "Wishlist", ar: "قائمة الأمنيات" },
  "profile.wishlistDesc": { en: "Your saved items", ar: "العناصر المحفوظة" },
  "profile.addresses": { en: "Addresses", ar: "العناوين" },
  "profile.addressesDesc": { en: "Manage your shipping addresses", ar: "إدارة عناوين الشحن" },
  "profile.reviews": { en: "My Reviews", ar: "تقييماتي" },
  "profile.reviewsDesc": { en: "Reviews you've submitted", ar: "التقييمات التي قدمتِها" },

  // Orders
  "orders.empty": { en: "You haven't placed any orders yet", ar: "لم تقومي بأي طلبات بعد" },
  "orders.startShopping": { en: "Start Shopping", ar: "ابدئي التسوق" },

  // Common
  "common.loading": { en: "Loading...", ar: "جارٍ التحميل..." },
  "common.error": { en: "Something went wrong", ar: "حدث خطأ ما" },
  "common.tryAgain": { en: "Try Again", ar: "حاولي مجدداً" },
  "common.close": { en: "Close", ar: "إغلاق" },
  "common.back": { en: "Back", ar: "رجوع" },
  "common.remove": { en: "Remove", ar: "إزالة" },
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Add/remove RTL class for styling
    if (language === "ar") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
