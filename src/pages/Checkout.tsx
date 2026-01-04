import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/Logo";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  CreditCard, 
  Lock, 
  Truck, 
  Shield,
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

type CheckoutStep = "information" | "shipping" | "payment";

export default function Checkout() {
  const { items: cart, cartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "information", label: "Information" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const shipping = 0; // Complimentary shipping
  const total = cartTotal + shipping;

  const handleContinue = () => {
    if (currentStep === "information") {
      setCompletedSteps([...completedSteps, "information"]);
      setCurrentStep("shipping");
    } else if (currentStep === "shipping") {
      setCompletedSteps([...completedSteps, "shipping"]);
      setCurrentStep("payment");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24 text-center">
          <div className="luxury-container">
            <Logo size="lg" className="mx-auto mb-6 text-primary" />
            <h1 className="font-serif text-4xl mb-4">Your Bag is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some beautiful pieces to begin checkout.
            </p>
            <Button asChild variant="luxury">
              <Link to="/collections">Explore Collections</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-24">
        <div className="luxury-container">
          {/* Checkout Header */}
          <div className="text-center mb-12">
            <Logo size="md" className="mx-auto mb-4 text-primary" />
            <h1 className="font-serif text-3xl md:text-4xl mb-2">Checkout</h1>
            <p className="text-muted-foreground text-sm">
              Secure checkout powered by industry-standard encryption
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                    currentStep === step.id
                      ? "text-foreground"
                      : completedSteps.includes(step.id)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 flex items-center justify-center text-xs border transition-colors",
                      currentStep === step.id
                        ? "border-foreground bg-foreground text-background"
                        : completedSteps.includes(step.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    )}
                  >
                    {completedSteps.includes(step.id) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="hidden sm:inline tracking-wider uppercase">
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
            {/* Form Section */}
            <div>
              {currentStep === "information" && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-2xl mb-6">Contact Information</h2>
                  <div className="space-y-4 mb-8">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="mt-1.5"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="First name" className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Last name" className="mt-1.5" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+971"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <h2 className="font-serif text-2xl mb-6">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" placeholder="Street address" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                      <Input id="apartment" placeholder="Apartment, suite, etc." className="mt-1.5" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="City" className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="emirate">Emirate</Label>
                        <Input id="emirate" placeholder="Emirate" className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="postal">Postal Code</Label>
                        <Input id="postal" placeholder="Postal code" className="mt-1.5" />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="luxury"
                    size="xl"
                    className="w-full mt-8"
                    onClick={handleContinue}
                  >
                    Continue to Shipping
                  </Button>
                </div>
              )}

              {currentStep === "shipping" && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-2xl mb-6">Shipping Method</h2>
                  <div className="space-y-4">
                    <label className="block border border-primary bg-primary/5 p-4 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            defaultChecked
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium">Complimentary Express Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              2-3 business days across the UAE
                            </p>
                          </div>
                        </div>
                        <span className="text-primary font-medium">Free</span>
                      </div>
                    </label>

                    <label className="block border border-border p-4 cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input type="radio" name="shipping" className="mt-1" />
                          <div>
                            <p className="font-medium">Same Day Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              Available in Dubai & Abu Dhabi
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">{formatPrice(50)}</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>All orders include signature confirmation</span>
                  </div>

                  <Button
                    variant="luxury"
                    size="xl"
                    className="w-full mt-8"
                    onClick={handleContinue}
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {currentStep === "payment" && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-2xl mb-6">Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    <label className="block border border-primary bg-primary/5 p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" defaultChecked />
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">Credit / Debit Card</span>
                      </div>
                    </label>

                    <div className="border border-border p-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="mt-1.5"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM / YY" className="mt-1.5" />
                          </div>
                          <div>
                            <Label htmlFor="cvv">Security Code</Label>
                            <Input id="cvv" placeholder="CVV" className="mt-1.5" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="Full name" className="mt-1.5" />
                        </div>
                      </div>
                    </div>

                    <label className="block border border-border p-4 cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" />
                        <span className="font-medium">PayPal</span>
                      </div>
                    </label>

                    <label className="block border border-border p-4 cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" />
                        <span className="font-medium">Apple Pay</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>

                  <Button variant="luxury" size="xl" className="w-full">
                    Complete Order — {formatPrice(total)}
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-secondary p-6 md:p-8">
                <h3 className="font-serif text-xl mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-champagne flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-xs flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">Complimentary</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Lifetime warranty on all pieces</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
