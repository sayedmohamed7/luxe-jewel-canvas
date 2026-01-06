import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, fullName);
      toast({ title: "Account created", description: "You are now logged in." });
      navigate("/");
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-24 flex items-center justify-center">
        <div className="luxury-container max-w-md w-full p-8 border border-border">
          <h1 className="font-serif text-3xl mb-6 text-center">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input 
                id="fullname" 
                type="text" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                required 
                className="bg-transparent border-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="bg-transparent border-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="bg-transparent border-foreground/20"
              />
            </div>
            <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
              {loading ? "Create Account" : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
