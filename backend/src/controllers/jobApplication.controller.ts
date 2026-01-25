import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const {
      company,
      position,
      location,
      type,
      status,
      salary,
      url,
      dateApplied,
      notes,
      jobId,
    } = req.body;

    const application = await prisma.jobApplication.create({
      data: {
        userId,
        company,
        position,
        location,
        type,
        status: status || "applied",
        salary,
        url,
        dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
        notes,
        jobId,
      },
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const applications = await prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { id } = req.params;
    const updates = req.body;

    // Verify ownership
    const existing = await prisma.jobApplication.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (updates.dateApplied) {
      updates.dateApplied = new Date(updates.dateApplied);
    }

    const application = await prisma.jobApplication.update({
      where: { id },
      data: updates,
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error("Update Application Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.jobApplication.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    await prisma.jobApplication.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Application deleted" });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
