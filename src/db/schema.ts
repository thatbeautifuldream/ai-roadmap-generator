import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Visibility enum
export const visibilityEnum = pgEnum("Visibility", ["PRIVATE", "PUBLIC"]);

// Re-export as a TypeScript type for use in application code
export const Visibility = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
} as const;
export type Visibility = (typeof Visibility)[keyof typeof Visibility];

// Users table
export const users = pgTable("User", {
  id: text("id").primaryKey().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  imageUrl: text("imageUrl"),
  credits: integer("credits").default(5).notNull(),
});

// Roadmaps table
export const roadmaps = pgTable(
  "Roadmap",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull().unique(),
    content: text("content").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    views: integer("views").default(0).notNull(),
    searchCount: integer("searchCount").default(0).notNull(),
    visibility: visibilityEnum("visibility").default("PUBLIC").notNull(),
  },
  (table) => [index("Roadmap_title_idx").on(table.title)]
);

// SavedRoadmaps table
export const savedRoadmaps = pgTable("SavedRoadmap", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  roadmapId: text("roadmapId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// DrawerDetails table
export const drawerDetails = pgTable("DrawerDetail", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  details: text("details").notNull(),
  youtubeVideoIds: text("youtubeVideoIds").array().notNull(),
  books: text("books").notNull(),
  nodeName: text("nodeName").notNull().unique(),
  roadmapId: text("roadmapId")
    .notNull()
    .references(() => roadmaps.id, { onDelete: "cascade" }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  roadmaps: many(roadmaps),
  savedRoadmaps: many(savedRoadmaps),
}));

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  author: one(users, {
    fields: [roadmaps.userId],
    references: [users.id],
  }),
  drawerDetails: many(drawerDetails),
}));

export const savedRoadmapsRelations = relations(savedRoadmaps, ({ one }) => ({
  author: one(users, {
    fields: [savedRoadmaps.userId],
    references: [users.id],
  }),
}));

export const drawerDetailsRelations = relations(drawerDetails, ({ one }) => ({
  roadmap: one(roadmaps, {
    fields: [drawerDetails.roadmapId],
    references: [roadmaps.id],
  }),
}));
