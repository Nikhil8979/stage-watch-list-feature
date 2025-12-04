import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { error, success } from "../utils/response";
import { WatchListSchema } from "../zod/watchList";

const addItemToWatchList: RequestHandler = async (req, res) => {
  const { contentId } = req.body;
  const { id: userId } = req.user;
  const isContentExist = await prisma.content.findUnique({
    where: {
      id: contentId,
    },
    select: {
      id: true,
    },
  });
  if (!isContentExist) {
    return res.status(400).json(error({ message: "Content not found" }));
  }
  const isItemExist = await prisma.watchList.findUnique({
    where: {
      userId_contentId: {
        userId,
        contentId,
      },
    },
    select: {
      id: true,
    },
  });

  if (isItemExist) {
    return res.status(400).json(error({ message: "Item already exists" }));
  }
  const item = await prisma.watchList.create({
    data: {
      userId,
      contentId,
    },
  });
  return res.status(201).json(
    success({
      data: {
        item,
      },
      message: "Item added to watch list",
    })
  );
};

const getWatchList: RequestHandler = async (req, res) => {
  const { limit, cursor } = req.query as WatchListSchema;
  const { id: userId } = req.user;

  const watchList = await prisma.watchList.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      content: {
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          movieDetail: {
            select: {
              director: true,
              releaseDate: true,
            },
          },
          tvShowDetail: {
            select: {
              totalEpisode: true,
              episodes: {
                select: {
                  episodeNumber: true,
                  seasonNumber: true,
                  releaseDate: true,
                },
              },
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });

  return res.status(200).json(
    success({
      data: {
        items: watchList,
      },
    })
  );
};

const removeItemFromWatchList: RequestHandler = async (req, res) => {
  const { contentId } = req.body;
  const { id: userId } = req.user;
  const isContentExist = await prisma.content.findUnique({
    where: {
      id: contentId,
    },
    select: {
      id: true,
    },
  });
  if (!isContentExist) {
    return res.status(400).json(error({ message: "Content not found" }));
  }
  const item = await prisma.watchList.delete({
    where: {
      userId_contentId: {
        userId,
        contentId,
      },
    },
  });
  return res.status(200).json(
    success({
      data: {
        item,
      },
      message: "Item removed from watch list",
    })
  );
};

export { addItemToWatchList, getWatchList, removeItemFromWatchList };
