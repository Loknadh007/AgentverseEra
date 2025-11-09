import { 
  type Conversation, 
  type Message, 
  type BugReport, 
  type Hypothesis, 
  type ActivityEntry,
  type InsertConversation,
  type InsertMessage,
  type InsertBugReport,
  type InsertHypothesis,
  type InsertActivityEntry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  
  createBugReport(report: InsertBugReport): Promise<BugReport>;
  getBugReportByConversation(conversationId: string): Promise<BugReport | undefined>;
  
  createHypotheses(hypotheses: InsertHypothesis[]): Promise<Hypothesis[]>;
  getHypothesesByConversation(conversationId: string): Promise<Hypothesis[]>;
  
  createActivityEntry(entry: InsertActivityEntry): Promise<ActivityEntry>;
  getActivityEntriesByConversation(conversationId: string): Promise<ActivityEntry[]>;
}

export class MemStorage implements IStorage {
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private bugReports: Map<string, BugReport>;
  private hypotheses: Map<string, Hypothesis>;
  private activityEntries: Map<string, ActivityEntry>;

  constructor() {
    this.conversations = new Map();
    this.messages = new Map();
    this.bugReports = new Map();
    this.hypotheses = new Map();
    this.activityEntries = new Map();
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = { 
      id,
      status: insertConversation.status || "active",
      createdAt: new Date()
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      id,
      conversationId: insertMessage.conversationId,
      agent: insertMessage.agent,
      content: insertMessage.content,
      isUser: insertMessage.isUser || 0,
      metadata: insertMessage.metadata || null,
      timestamp: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createBugReport(insertReport: InsertBugReport): Promise<BugReport> {
    const id = randomUUID();
    const report: BugReport = { 
      ...insertReport, 
      id,
      createdAt: new Date()
    };
    this.bugReports.set(id, report);
    return report;
  }

  async getBugReportByConversation(conversationId: string): Promise<BugReport | undefined> {
    return Array.from(this.bugReports.values())
      .find(report => report.conversationId === conversationId);
  }

  async createHypotheses(insertHypotheses: InsertHypothesis[]): Promise<Hypothesis[]> {
    const created: Hypothesis[] = [];
    for (const insertHypothesis of insertHypotheses) {
      const id = randomUUID();
      const hypothesis: Hypothesis = { 
        ...insertHypothesis, 
        id,
        createdAt: new Date()
      };
      this.hypotheses.set(id, hypothesis);
      created.push(hypothesis);
    }
    return created;
  }

  async getHypothesesByConversation(conversationId: string): Promise<Hypothesis[]> {
    return Array.from(this.hypotheses.values())
      .filter(h => h.conversationId === conversationId)
      .sort((a, b) => a.rank - b.rank);
  }

  async createActivityEntry(insertEntry: InsertActivityEntry): Promise<ActivityEntry> {
    const id = randomUUID();
    const entry: ActivityEntry = { 
      ...insertEntry, 
      id,
      timestamp: new Date()
    };
    this.activityEntries.set(id, entry);
    return entry;
  }

  async getActivityEntriesByConversation(conversationId: string): Promise<ActivityEntry[]> {
    return Array.from(this.activityEntries.values())
      .filter(entry => entry.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();
