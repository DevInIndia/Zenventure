"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { doc, getDoc,setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          // User exists, go directly to dashboard
          router.push("/dashboard");
        } else {
          // User doesn't exist, create a new document
          await setDoc(userDocRef, {
            email: user.email,
            name: user.displayName || "",
            createdAt: new Date(),
            // add any other default fields you want
          });
          router.push("/onboarding");
        }
      }
    });
  
    return () => unsubscribe();
  }, [router]);
  

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithPopup(auth, googleProvider);
      // Redirect will happen automatically via the onAuthStateChanged listener
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#222034] bg-[url('/placeholder.svg?height=800&width=800')] bg-repeat">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="pixel-card bg-[#352f44] text-[#f0ece2] border-[#dbd8e3]">
          <CardHeader className="text-center border-b-4 border-[#5c5470] pb-4">
            <CardTitle className="text-xl text-[#f9c80e] mb-2">
              ZENVENTURES
            </CardTitle>
            <p className="text-[#f0ece2] text-sm">JOIN THE ADVENTURE</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-[#dbd8e3]">Sign in to start your journey</p>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full pixel-button bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <GoogleIcon />
                {isLoading ? "SIGNING IN..." : "SIGN IN WITH GOOGLE"}
              </Button>

              {error && (
                <p className="text-[#f86624] text-center text-sm">{error}</p>
              )}

              <div className="text-center mt-6">
                <p className="text-[#dbd8e3] text-xs">
                  By signing in, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
