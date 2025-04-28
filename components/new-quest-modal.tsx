"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Quest } from "@/lib/types";

interface NewQuestModalProps {
  // onCreateQuest: (quest: Omit<Quest, "id" | "createdBy" | "createdAt">) => void;
  onCreateQuest: (quest: Omit<Quest, "id">) => void;
  children?: React.ReactNode;
}

export function NewQuestModal({ onCreateQuest, children }: NewQuestModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "productivity" | "fitness" | "mindfulness"
  >("productivity");
  const [estimatedTime, setEstimatedTime] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would use Gemini API to evaluate the quest and assign points
      // For now, we'll use a simple formula based on time and category
      const basePoints = Math.max(
        5,
        Math.min(50, Number.parseInt(estimatedTime) || 0)
      );
      const categoryMultiplier =
        category === "fitness" ? 1.2 : category === "mindfulness" ? 1.1 : 1.0;
      const xpReward = Math.round(basePoints * categoryMultiplier);

      // Create the new quest
      // const newQuest: Omit<Quest, "id" | "createdBy" | "createdAt"> = {
      const newQuest: Omit<Quest, "id"> = {
        title,
        description,
        category,
        difficulty:
          estimatedTime && Number.parseInt(estimatedTime) > 45
            ? "hard"
            : Number.parseInt(estimatedTime) > 20
            ? "medium"
            : "easy",
        xpReward,
        estimatedTime: Number.parseInt(estimatedTime) || 0,
        // pointsReward: 0,
        createdBy: "user",
        createdAt: new Date(),
        pointsReward: Math.round(basePoints * categoryMultiplier * 0.5), // Half of XP for points
      };

      onCreateQuest(newQuest);
      setOpen(false);

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("productivity");
      setEstimatedTime("30");
    } catch (error) {
      console.error("Error creating quest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]">
            <Plus className="h-4 w-4 mr-2" />
            NEW QUEST
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#352f44] border-4 border-black text-[#dbd8e3] sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[#f9c80e]">
              Create New Quest
            </DialogTitle>
            <DialogDescription className="text-[#dbd8e3]">
              Add a new quest to your adventure. The AI will evaluate and assign
              XP based on difficulty.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3 bg-[#5c5470] border-[#dbd8e3] text-[#dbd8e3]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 bg-[#5c5470] border-[#dbd8e3] text-[#dbd8e3]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(
                    value as "productivity" | "fitness" | "mindfulness"
                  )
                }
              >
                <SelectTrigger className="col-span-3 bg-[#5c5470] border-[#dbd8e3] text-[#dbd8e3]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#352f44] border-[#dbd8e3] text-[#dbd8e3]">
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time (minutes)
              </Label>
              <Input
                id="time"
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="col-span-3 bg-[#5c5470] border-[#dbd8e3] text-[#dbd8e3]"
                min="0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Quest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
