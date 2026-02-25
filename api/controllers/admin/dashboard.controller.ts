
import { Request, Response } from "express";
import {
    getDashboardStats,
    getUserGrowthStats,
    getRecentActivity
} from "../../services/admin/dashboard.service";

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getDashboardStats();
        const growth = await getUserGrowthStats();
        const activity = await getRecentActivity();

        res.status(200).json({
            stats,
            growth,
            activity
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};
