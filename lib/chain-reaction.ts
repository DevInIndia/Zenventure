// Chain Reaction Rewards System
// Based on the "CHAIN REACTION" REWARDS from the bonus tracks

export interface ChainActivity {
  id: string;
  name: string;
  points: number;
  completed: boolean;
  timestamp?: Date;
}

export interface ChainReaction {
  id: string;
  name: string;
  description: string;
  activities: ChainActivity[];
  bonusPoints: number;
  isActive: boolean;
  completedAt?: Date;
}

export class ChainReactionSystem {
  private chains: ChainReaction[] = [];

  constructor(initialChains: ChainReaction[] = []) {
    this.chains = initialChains;
  }

  // Get all chains
  getChains(): ChainReaction[] {
    return this.chains;
  }

  // Get active chains
  getActiveChains(): ChainReaction[] {
    return this.chains.filter((chain) => chain.isActive);
  }

  // Get completed chains
  getCompletedChains(): ChainReaction[] {
    return this.chains.filter((chain) => !chain.isActive && chain.completedAt);
  }

  // Add a new chain
  addChain(chain: Omit<ChainReaction, "id">): ChainReaction {
    const newChain: ChainReaction = {
      ...chain,
      id: crypto.randomUUID(),
    };

    this.chains.push(newChain);
    return newChain;
  }

  // Complete an activity in a chain
  completeActivity(
    chainId: string,
    activityId: string
  ): {
    success: boolean;
    points: number;
    chainCompleted: boolean;
    totalPoints: number;
  } {
    const chain = this.chains.find((c) => c.id === chainId);

    if (!chain || !chain.isActive) {
      return {
        success: false,
        points: 0,
        chainCompleted: false,
        totalPoints: 0,
      };
    }

    const activity = chain.activities.find((a) => a.id === activityId);

    if (!activity || activity.completed) {
      return {
        success: false,
        points: 0,
        chainCompleted: false,
        totalPoints: 0,
      };
    }

    // Mark activity as completed
    activity.completed = true;
    activity.timestamp = new Date();

    // Check if all activities in the chain are completed
    const allCompleted = chain.activities.every((a) => a.completed);
    let totalPoints = activity.points;

    if (allCompleted) {
      // Add bonus points for completing the entire chain
      totalPoints += chain.bonusPoints;
      chain.isActive = false;
      chain.completedAt = new Date();

      return {
        success: true,
        points: activity.points,
        chainCompleted: true,
        totalPoints,
      };
    }

    return {
      success: true,
      points: activity.points,
      chainCompleted: false,
      totalPoints: activity.points,
    };
  }

  // Calculate total points for a chain
  calculateChainPoints(chainId: string): number {
    const chain = this.chains.find((c) => c.id === chainId);

    if (!chain) return 0;

    const activityPoints = chain.activities.reduce((sum, activity) => {
      return activity.completed ? sum + activity.points : sum;
    }, 0);

    // Add bonus points only if all activities are completed
    const allCompleted = chain.activities.every((a) => a.completed);
    const bonusPoints = allCompleted ? chain.bonusPoints : 0;

    return activityPoints + bonusPoints;
  }

  // Reset a chain (mark all activities as not completed)
  resetChain(chainId: string): boolean {
    const chain = this.chains.find((c) => c.id === chainId);

    if (!chain) return false;

    chain.activities.forEach((activity) => {
      activity.completed = false;
      activity.timestamp = undefined;
    });

    chain.isActive = true;
    chain.completedAt = undefined;

    return true;
  }

  // Create a morning victory chain (from the bonus tracks image)
  static createMorningVictoryChain(): ChainReaction {
    return {
      id: crypto.randomUUID(),
      name: "Morning Victory",
      description: "Start your day with a powerful morning routine",
      activities: [
        {
          id: crypto.randomUUID(),
          name: "Wake up 7 AM",
          points: 3,
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          name: "Exercise",
          points: 4,
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          name: "Healthy breakfast",
          points: 3,
          completed: false,
        },
      ],
      bonusPoints: 3,
      isActive: true,
    };
  }

  // Create default chains
  static createDefaultChains(): ChainReaction[] {
    return [
      ChainReactionSystem.createMorningVictoryChain(),
      {
        id: crypto.randomUUID(),
        name: "Evening Wind Down",
        description: "End your day with a relaxing routine",
        activities: [
          {
            id: crypto.randomUUID(),
            name: "No screens after 9 PM",
            points: 2,
            completed: false,
          },
          {
            id: crypto.randomUUID(),
            name: "Read for 20 minutes",
            points: 3,
            completed: false,
          },
          {
            id: crypto.randomUUID(),
            name: "Meditate before sleep",
            points: 4,
            completed: false,
          },
        ],
        bonusPoints: 3,
        isActive: true,
      },
      {
        id: crypto.randomUUID(),
        name: "Productivity Boost",
        description: "Maximize your productivity",
        activities: [
          {
            id: crypto.randomUUID(),
            name: "Plan your day",
            points: 2,
            completed: false,
          },
          {
            id: crypto.randomUUID(),
            name: "Deep work session",
            points: 5,
            completed: false,
          },
          {
            id: crypto.randomUUID(),
            name: "Review accomplishments",
            points: 2,
            completed: false,
          },
        ],
        bonusPoints: 3,
        isActive: true,
      },
    ];
  }
}
