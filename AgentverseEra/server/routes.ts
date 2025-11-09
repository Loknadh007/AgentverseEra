import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { callEmpathyAgent, callDiagnosticAgent, callExecutionAgent } from "./ai-agents";
import { insertMessageSchema, insertBugReportSchema, insertHypothesisSchema, insertActivityEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/conversations", async (req, res) => {
    try {
      const conversation = await storage.createConversation({ status: "active" });
      
      const welcomeMessage = await storage.createMessage({
        conversationId: conversation.id,
        agent: "empathy",
        content: "💙 Welcome to Agentverse! I'm the Empathy Agent, here to help you debug your code. Tell me about the issue you're facing, and I'll coordinate with the Diagnostic and Execution agents to find a solution.",
        isUser: 0,
        metadata: null,
      });
      
      res.json({ conversation, welcomeMessage });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      const userMessage = await storage.createMessage({
        conversationId: id,
        agent: "empathy",
        content,
        isUser: 1,
        metadata: null,
      });

      await storage.createActivityEntry({
        conversationId: id,
        agent: "Empathy Agent",
        action: "Analyzing user sentiment...",
        status: "running",
      });

      const empathyResult = await callEmpathyAgent(content);
      
      const empathyMessage = await storage.createMessage({
        conversationId: id,
        agent: "empathy",
        content: empathyResult.response,
        isUser: 0,
        metadata: null,
      });

      await storage.createActivityEntry({
        conversationId: id,
        agent: "Empathy Agent",
        action: "Bug report card generated",
        status: "success",
      });

      const bugReport = await storage.createBugReport({
        conversationId: id,
        severity: empathyResult.bugReport.severity,
        category: empathyResult.bugReport.category,
        description: empathyResult.bugReport.description,
        affectedFiles: empathyResult.bugReport.affected_files,
        userSentiment: empathyResult.bugReport.user_sentiment,
      });

      await storage.createActivityEntry({
        conversationId: id,
        agent: "Diagnostic Agent",
        action: "Analyzing code patterns...",
        status: "running",
      });

      const diagnosticResult = await callDiagnosticAgent(empathyResult.bugReport);
      
      const diagnosticMessage = await storage.createMessage({
        conversationId: id,
        agent: "diagnostic",
        content: diagnosticResult.response,
        isUser: 0,
        metadata: null,
      });

      await storage.createActivityEntry({
        conversationId: id,
        agent: "Diagnostic Agent",
        action: "Hypotheses generated",
        status: "success",
      });

      const hypotheses = await storage.createHypotheses(
        diagnosticResult.hypotheses.map((h) => ({
          conversationId: id,
          rank: h.id,
          title: h.title,
          confidence: h.confidence,
          details: h.details,
        }))
      );

      await storage.createActivityEntry({
        conversationId: id,
        agent: "Execution Agent",
        action: "Preparing code fix...",
        status: "running",
      });

      const executionResult = await callExecutionAgent(diagnosticResult.nextAction, empathyResult.bugReport);
      
      const executionMessage = await storage.createMessage({
        conversationId: id,
        agent: "execution",
        content: executionResult.response,
        isUser: 0,
        metadata: { codeDiff: executionResult.codeDiff },
      });

      for (const step of executionResult.activitySteps) {
        await storage.createActivityEntry({
          conversationId: id,
          agent: "Execution Agent",
          action: step,
          status: "success",
        });
      }

      await storage.createActivityEntry({
        conversationId: id,
        agent: "Execution Agent",
        action: executionResult.finalStatus,
        status: executionResult.finalStatus.includes("GREEN") ? "success" : "error",
      });

      res.json({
        userMessage,
        empathyMessage,
        bugReport,
        diagnosticMessage,
        hypotheses,
        executionMessage,
        codeDiff: executionResult.codeDiff,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const conversation = await storage.getConversation(id);
      const messages = await storage.getMessagesByConversation(id);
      const bugReport = await storage.getBugReportByConversation(id);
      const hypotheses = await storage.getHypothesesByConversation(id);
      const activityLog = await storage.getActivityEntriesByConversation(id);

      res.json({
        conversation,
        messages,
        bugReport,
        hypotheses,
        activityLog,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
