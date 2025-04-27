"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Gift, Clock, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getUserProfile,
  getAvailableRewards,
  redeemReward,
} from "@/lib/firestore";
import type { UserProfile, Reward } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingScreen } from "@/components/loading-screen";

export default function RewardsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const profile = await getUserProfile();

          if (profile) {
            setUserProfile(profile);

            // Get available rewards
            const availableRewards = await getAvailableRewards();
            setRewards(availableRewards);

            setIsLoading(false);
          } else {
            // User doesn't have a profile, redirect to onboarding
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setIsLoading(false);
        }
      } else {
        // User is not signed in, redirect to auth page
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleRedeemReward = async () => {
    if (!userProfile || !selectedReward || isRedeeming) return;

    setIsRedeeming(true);

    try {
      const result = await redeemReward(selectedReward.id);

      // Update user profile points
      setUserProfile({
        ...userProfile,
        points: result.remainingPoints,
        redeemedRewards: [
          ...(userProfile.redeemedRewards || []),
          selectedReward,
        ],
      });

      // Update rewards
      setRewards(
        rewards.map((reward) =>
          reward.id === selectedReward.id
            ? { ...reward, available: false }
            : {
                ...reward,
                available:
                  reward.available &&
                  result.remainingPoints >= reward.pointsCost,
              }
        )
      );

      setRedeemSuccess(true);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      setRedeemSuccess(false);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleSelectReward = (reward: Reward) => {
    if (!userProfile || userProfile.points < reward.pointsCost) return;

    setSelectedReward(reward);
    setShowConfirmDialog(true);
    setRedeemSuccess(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Group rewards by category
  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  return (
    <div className="min-h-screen flex flex-col bg-[#222034] text-[#f0ece2]">
      {userProfile && (
        <TopBar
          xp={userProfile.xp}
          points={userProfile.points}
          streak={userProfile.currentStreak}
          mood={userProfile.mood}
          health={userProfile.health}
          mana={userProfile.mana}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-[url('/placeholder.svg?height=800&width=800')] bg-repeat">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pixel-card bg-[#352f44] p-4 mb-6 flex items-center justify-between">
              <h1 className="text-xl text-[#f9c80e]">REWARD SHOP</h1>
              {userProfile && (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[#f9c80e]" />
                  <span className="text-[#f9c80e] font-bold">
                    {userProfile.points} POINTS
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {Object.entries(groupedRewards).map(
                ([category, categoryRewards]) => (
                  <div key={category} className="space-y-4">
                    <h2 className="text-lg text-[#f9c80e] uppercase border-b-2 border-[#5c5470] pb-2">
                      {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                      Rewards
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryRewards.map((reward) => (
                        <RewardCard
                          key={reward.id}
                          reward={reward}
                          userPoints={userProfile?.points || 0}
                          onSelect={handleSelectReward}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}

              {Object.keys(groupedRewards).length === 0 && (
                <div className="text-center p-8 pixel-card bg-[#352f44]">
                  <h2 className="text-xl text-[#f9c80e] mb-2">
                    NO REWARDS AVAILABLE
                  </h2>
                  <p className="text-[#dbd8e3] text-sm">
                    Complete quests and earn points to unlock rewards!
                  </p>
                  <div className="mt-4 text-4xl">🎁</div>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-[#352f44] border-4 border-black text-[#dbd8e3]">
          <DialogHeader>
            <DialogTitle className="text-[#f9c80e]">
              {redeemSuccess ? "Reward Redeemed!" : "Confirm Redemption"}
            </DialogTitle>
            <DialogDescription className="text-[#dbd8e3]">
              {redeemSuccess
                ? "You've successfully redeemed your reward. Enjoy!"
                : `Are you sure you want to redeem ${selectedReward?.title} for ${selectedReward?.pointsCost} points?`}
            </DialogDescription>
          </DialogHeader>

          {selectedReward && !redeemSuccess && (
            <div className="flex items-center justify-center p-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{selectedReward.icon}</div>
                <h3 className="text-[#f9c80e] mb-1">{selectedReward.title}</h3>
                <p className="text-sm text-[#dbd8e3] mb-2">
                  {selectedReward.description}
                </p>
                <Badge className="bg-[#f86624] text-black">
                  {selectedReward.pointsCost} POINTS
                </Badge>
              </div>
            </div>
          )}

          {redeemSuccess && (
            <div className="flex items-center justify-center p-4">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-[#dbd8e3]">
                  Reward has been added to your account!
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {redeemSuccess ? (
              <Button
                className="pixel-button bg-[#43aa8b] text-black hover:bg-[#3a9579]"
                onClick={() => setShowConfirmDialog(false)}
              >
                CLOSE
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="bg-[#5c5470] border-[#dbd8e3] text-[#dbd8e3]"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isRedeeming}
                >
                  CANCEL
                </Button>
                <Button
                  className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]"
                  onClick={handleRedeemReward}
                  disabled={isRedeeming}
                >
                  {isRedeeming ? "REDEEMING..." : "REDEEM REWARD"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onSelect: (reward: Reward) => void;
}

function RewardCard({ reward, userPoints, onSelect }: RewardCardProps) {
  const canAfford = userPoints >= reward.pointsCost;

  return (
    <motion.div
      whileHover={{ scale: canAfford ? 1.02 : 1 }}
      whileTap={{ scale: canAfford ? 0.98 : 1 }}
    >
      <Card
        className={`overflow-hidden border-4 ${
          !reward.available
            ? "border-[#5c5470] bg-[#352f44]/50 opacity-60"
            : canAfford
            ? "border-[#f9c80e] bg-[#352f44] cursor-pointer"
            : "border-[#5c5470] bg-[#352f44]"
        }`}
        onClick={() => reward.available && canAfford && onSelect(reward)}
      >
        <CardContent className="p-4 relative">
          <div className="absolute top-2 right-2">
            {!reward.available && <Clock className="h-5 w-5 text-[#5c5470]" />}
            {reward.available && !canAfford && (
              <AlertCircle className="h-5 w-5 text-[#f86624]" />
            )}
            {reward.available && canAfford && (
              <Gift className="h-5 w-5 text-[#43aa8b]" />
            )}
          </div>

          <div className="flex flex-col items-center text-center mb-4">
            <div className="text-4xl mb-2">{reward.icon}</div>
            <h3 className="font-semibold text-sm mb-1 text-[#f9c80e]">
              {reward.title}
            </h3>
            <p className="text-xs text-[#dbd8e3] mb-2">{reward.description}</p>
          </div>

          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`${
                canAfford
                  ? "bg-[#f9c80e] text-black"
                  : "bg-[#5c5470] text-[#dbd8e3]"
              } border-2 border-black`}
            >
              {reward.pointsCost} POINTS
            </Badge>
          </div>

          {!reward.available && (
            <div className="absolute inset-0 bg-[#222034]/70 flex items-center justify-center">
              <span className="text-[#dbd8e3] font-bold">REDEEMED</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
