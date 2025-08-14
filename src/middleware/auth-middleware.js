import { prismaClient } from "../applications/database.js";

export const authMiddleware = async (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  // Check if token exists
  if (!token) {
    res.status(401).json({ errors: "Unauthorized" }).end();
  }

  try {
    // Check if token is valid
    const user = await prismaClient.user.findFirst({
      where: {
        token,
      },
      include: {
        role: true,
        hospital: {
          select: {
            id: true,
            name: true,
            logo_path: true,
            satu_sehat_env: {
              select: {
                access_token: true,
              },
            },
          },
        },
        profile_picture: true,
      },
    });

    // If token is not valid
    if (!user) {
      res.status(401).json({ errors: "Unauthorized" }).end();
    }

    // Set user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ errors: "Internal Server Error" });
  }
};
