
import { UserModel } from "../../models/user.model";
import { RecipeModel } from "../../models/recipe.model";
import { BugReportModel } from "../../models/bug-report.model";

export const getDashboardStats = async () => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalRecipes = await RecipeModel.countDocuments();
        // Proxy for active sessions: Users active (updated) in the last hour
        const activeSessions = await UserModel.countDocuments({
            updatedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
        });
        const openBugReports = await BugReportModel.countDocuments({ status: "open" });

        return {
            totalUsers,
            totalRecipes,
            activeSessions,
            openBugReports
        };
    } catch (error) {
        throw error;
    }
};

export const getUserGrowthStats = async () => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const growthData = await UserModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Create a map of existing data
        const dataMap = new Map<string, number>();
        growthData.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            dataMap.set(key, item.count);
        });

        // Generate last 6 months list with 0 as default
        const formattedData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const year = d.getFullYear();
            const month = d.getMonth() + 1; // 1-indexed for matching what mongo returns
            const key = `${year}-${month}`;

            formattedData.push({
                name: d.toLocaleString('default', { month: 'short' }),
                total: dataMap.get(key) || 0
            });
        }

        return formattedData;
    } catch (error) {
        throw error;
    }
};

export const getRecentActivity = async () => {
    try {
        const LIMIT = 5;

        const latestRecipes = await RecipeModel.find()
            .sort({ createdAt: -1 })
            .limit(LIMIT)
            .select("recipeName generatedBy createdAt");

        const latestUsers = await UserModel.find()
            .sort({ createdAt: -1 })
            .limit(LIMIT)
            .select("fullName createdAt");

        const latestBugs = await BugReportModel.find()
            .sort({ createdAt: -1 })
            .limit(LIMIT)
            .select("problemType reportedBy createdAt reportDescription");

        // Helper to fetch user names for IDs if needed (Recipe and BugReport store generatedBy/reportedBy as UID strings usually, assuming they match UID in User model or are just strings)
        // Ideally we should lookup the user details. For now, assuming generatedBy/reportedBy might be the UID.
        // Let's quickly try to resolve names if they are UIDs.
        // Note: In current User model, `uid` is a string (probably Firebase UID or similar).
        // `generatedBy` in Recipe is String. 
        // We might need to fetch user details for these UIDs.
        // For simplicity/performance in this turn, I will just map them. IF `generatedBy` is a name, great. If UID, I might need a lookup.
        // Looking at User model: `uid`, `fullName`.
        // Looking at Recipe model: `generatedBy` (String).
        // I will assume for now we might need to populate or just show the ID if name resolution is complex here.
        // Wait, I can do a quick Promise.all to map them if I cared about "real" names. 
        // Let's assume for `UseModel` references, we want the name.

        // Actually, let's just format what we have. If `generatedBy` is a UID, the frontend will show a UID which is ugly.
        // Let's try to fetch user names for recipes and bugs.

        const userIdsToFetch = new Set<string>();
        const emailsToFetch = new Set<string>();

        latestRecipes.forEach(r => userIdsToFetch.add(r.generatedBy));

        latestBugs.forEach(b => {
            // Check if reportedBy looks like an email
            if (b.reportedBy.includes('@')) {
                emailsToFetch.add(b.reportedBy);
            } else {
                userIdsToFetch.add(b.reportedBy);
            }
        });

        const usersMap = new Map<string, { name: string, email: string }>();

        if (userIdsToFetch.size > 0 || emailsToFetch.size > 0) {
            const query = {
                $or: [
                    { uid: { $in: Array.from(userIdsToFetch) } },
                    { email: { $in: Array.from(emailsToFetch) } }
                ]
            };

            const users = await UserModel.find(query).select("uid email fullName");
            users.forEach(u => {
                const userData = { name: u.fullName, email: u.email };
                usersMap.set(u.uid, userData);
                usersMap.set(u.email, userData);
            });
        }

        const formattedActivities = [
            ...latestRecipes.map(r => ({
                user: usersMap.get(r.generatedBy)?.name || "Unknown User",
                action: "Created a new recipe",
                type: "recipe",
                date: r.createdAt,
                details: r.recipeName
            })),
            ...latestUsers.map(u => ({
                user: u.fullName,
                action: "Joined the platform",
                type: "user",
                date: u.createdAt
            })),
            ...latestBugs.map(b => {
                const userInfo = usersMap.get(b.reportedBy);
                // Should show email if found, or reportedBy if it looks like an email but not in DB (unlikely if authorized)
                // The user specifically asked for "proper gmail", so let's default to showing email if available/applicable
                // But typically name is better. If the user expects email, maybe they want email in the UI.
                // However, "unknown user... instead of proper gmail" implies "Unknown User" is bad, "gmail" is good.
                // We will try to show Name (Email) or just Name.
                // Let's stick to Name for now, but ensure we actually FIND the user.
                // If the user expects to see the email in the "user" field of the activity, we can put it there.
                // But 'dashboard' usually shows names.
                // If "unknown user", it means match failed.
                // If I fix the match, I show "Name".

                // If reportedBy IS the email, and we found the user, we have the name.
                // If reportedBy IS the email, and we DIDN'T find the user (maybe deleted?), we can fallback to `b.reportedBy`.

                return {
                    user: userInfo ? userInfo.name : (b.reportedBy.includes('@') ? b.reportedBy : "Unknown User"),
                    action: "Reported a bug",
                    type: "bug",
                    date: b.createdAt,
                    details: b.problemType
                };
            })
        ];

        // Sort combined list and take top LIMIT items
        const sortedActivities = formattedActivities.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        }).slice(0, 10);

        return sortedActivities;
    } catch (error) {
        throw error;
    }
};
