import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-24">
        <div className="luxury-container">
          <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center">
            Shopping Bag
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-8">
                Your shopping bag is empty
              </p>
              <Button asChild variant="luxury">
                <Link to="/collections">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="border-b border-border pb-4 mb-6 hidden md:grid grid-cols-12 gap-4 text-xs tracking-widest uppercase text-muted-foreground">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-6 border-b border-border"
                    >
                      {/* Product */}
                      <div className="md:col-span-6 flex gap-4">
                        <div className="w-24 h-32 bg-champagne shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <h3 className="font-serif text-lg mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground md:hidden">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex items-center justify-start md:justify-center">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="hidden md:flex md:col-span-2 items-center justify-end text-sm">
                        {formatPrice(item.price)}
                      </div>

                      {/* Total */}
                      <div className="hidden md:flex md:col-span-2 items-center justify-end font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-secondary p-8 sticky top-28">
                  <h2 className="font-serif text-xl mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-primary">Complimentary</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between font-serif text-lg">
                      <span>Total</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  <Button variant="luxury" size="xl" className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
