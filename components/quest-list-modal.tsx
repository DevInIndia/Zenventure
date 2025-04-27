"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter } from "lucide-react";
import { QuestSelectionCard } from "@/components/quest-selection-card";
import { NewQuestModal } from "@/components/new-quest-modal";
import type { Quest } from "@/lib/types";

interface QuestListModalProps {
  availableQuests: Quest[];
  onAddQuests: (quests: Quest[]) => void;
  onCreateQuest: (quest: Omit<Quest, "id">) => void;
}

export function QuestListModal({
  availableQuests,
  onAddQuests,
  onCreateQuest,
}: QuestListModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("browse");

  const toggleQuest = (questId: string) => {
    if (selectedQuests.includes(questId)) {
      setSelectedQuests(selectedQuests.filter((id) => id !== questId));
    } else {
      setSelectedQuests([...selectedQuests, questId]);
    }
  };

  const handleAddQuests = () => {
    const selected = availableQuests.filter((quest) =>
      selectedQuests.includes(quest.id)
    );
    onAddQuests(selected);
    setOpen(false);
    setSelectedQuests([]);
  };

  // Filter quests based on search term
  const filteredQuests = availableQuests.filter(
    (quest) =>
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group quests by category
  const groupedQuests = filteredQuests.reduce((acc, quest) => {
    if (!acc[quest.category]) {
      acc[quest.category] = [];
    }
    acc[quest.category].push(quest);
    return acc;
  }, {} as Record<string, Quest[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]">
          <Plus className="h-4 w-4 mr-2" />
          NEW QUEST
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#352f44] border-4 border-black text-[#dbd8e3] sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-[#f9c80e]">Add New Quests</DialogTitle>
          <DialogDescription className="text-[#dbd8e3]">
            Browse available quests or create your own custom quest.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="browse"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 bg-[#5c5470] border-2 border-black p-0">
            <TabsTrigger
              value="browse"
              className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none border-r-2 border-black"
            >
              BROWSE QUESTS
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none"
            >
              CREATE CUSTOM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search quests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#5c5470] border-[#dbd8e3] text-[#dbd8e3]"
              />
              <Button
                variant="outline"
                size="icon"
                className="bg-[#5c5470] border-[#dbd8e3]"
              >
                <Filter className="h-4 w-4 text-[#dbd8e3]" />
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2">
              {Object.entries(groupedQuests).length > 0 ? (
                Object.entries(groupedQuests).map(([category, quests]) => (
                  <div key={category} className="mb-4">
                    <h3 className="text-[#f9c80e] uppercase mb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quests.map((quest) => (
                        <QuestSelectionCard
                          key={quest.id}
                          quest={quest}
                          isSelected={selectedQuests.includes(quest.id)}
                          onToggle={() => toggleQuest(quest.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#dbd8e3]">
                    No quests found. Try a different search term or create a
                    custom quest.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-[#dbd8e3]">
                <span className="text-[#f9c80e]">{selectedQuests.length}</span>{" "}
                quests selected
              </div>
              <Button
                className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]"
                disabled={selectedQuests.length === 0}
                onClick={handleAddQuests}
              >
                ADD SELECTED
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <div className="bg-[#5c5470] p-4 rounded-md border-2 border-[#dbd8e3]">
              <h3 className="text-[#f9c80e] mb-4">Create Your Custom Quest</h3>
              <p className="text-[#dbd8e3] mb-4">
                Design your own quest with a custom title, description, and time
                limit. The AI will evaluate and assign XP based on difficulty.
              </p>
              <div className="flex justify-center">
                <NewQuestModal
                  onCreateQuest={(quest) => {
                    onCreateQuest(quest);
                    setOpen(false);
                  }}
                >
                  <Button className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]">
                    <Plus className="h-4 w-4 mr-2" />
                    CREATE CUSTOM QUEST
                  </Button>
                </NewQuestModal>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-[#5c5470] border-[#dbd8e3] text-[#dbd8e3]"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
