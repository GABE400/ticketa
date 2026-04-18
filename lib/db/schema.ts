import { pgTable, text, timestamp, boolean, integer, decimal, pgEnum, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["buyer", "organizer", "admin"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "failed"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["active", "used", "cancelled"]);

// --- Better-auth standard tables ---

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	role: text("role").$type<"buyer" | "organizer" | "admin">().default("buyer"),
	payoutMethod: text("payout_method"), // mobile_money, bank_transfer
	payoutDetails: jsonb("payout_details").$type<{
		method: "mobile_money" | "bank_transfer",
		provider?: "airtel" | "mtn" | "zamtel",
		phone?: string,
		bankName?: string,
		accName?: string,
		accNumber?: string
	}>(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

// --- Ticketing SaaS Specific Tables ---

export const events = pgTable("events", {
	id: text("id").primaryKey(),
	organizerId: text("organizer_id")
		.notNull()
		.references(() => user.id),
	title: text("title").notNull(),
	description: text("description"),
	location: text("location").notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	imageUrl: text("image_url"),
	galleryImages: jsonb("gallery_images").default([]).$type<string[]>(),
	socialLinks: jsonb("social_links").default({}).$type<{ instagram?: string, x?: string, tikTok?: string, website?: string }>(),
	locationLat: doublePrecision("location_lat"),
	locationLng: doublePrecision("location_lng"),
	category: text("category").notNull(),
	status: text("status").default("published"), // draft, published, cancelled, ended
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticketTypes = pgTable("ticket_types", {
	id: text("id").primaryKey(),
	eventId: text("event_id")
		.notNull()
		.references(() => events.id, { onDelete: "cascade" }),
	name: text("name").notNull(), // e.g., VIP, Regular
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
	capacity: integer("capacity").notNull(),
	sold: integer("sold").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
	id: text("id").primaryKey(),
	ticketTypeId: text("ticket_type_id")
		.notNull()
		.references(() => ticketTypes.id),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	qrData: text("qr_data").notNull(), // The secure token for on-the-fly QR generation
	status: text("status").default("active").notNull(), // active, used, cancelled
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	// Financial Breakdown
	subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(), // Base tickets cost
	serviceFee: decimal("service_fee", { precision: 10, scale: 2 }).default("0.00").notNull(), // Platform cut (buyer)
	commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).default("0.00").notNull(), // Organizer commission
	netAmount: decimal("net_amount", { precision: 10, scale: 2 }).default("0.00").notNull(), // Organizer payout
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // Total paid by buyer (subtotal + serviceFee)
	
	status: text("status").default("pending").notNull(), 
	ticketTypeId: text("ticket_type_id")
		.references(() => ticketTypes.id),
	quantity: integer("quantity").default(1),
	pesapalOrderTrackingId: text("pesapal_tracking_id"),
	payoutStatus: text("payout_status").default("pending").notNull(), // pending, completed
	payoutDate: timestamp("payout_date"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
	id: text("id").primaryKey().default("global"),
	demoVideoUrl: text("demo_video_url"),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Relations ---

export const userRelations = relations(user, ({ many }) => ({
	events: many(events),
	tickets: many(tickets),
	orders: many(orders),
}));

export const eventRelations = relations(events, ({ one, many }) => ({
	organizer: one(user, {
		fields: [events.organizerId],
		references: [user.id],
	}),
	ticketTypes: many(ticketTypes),
}));

export const ticketTypeRelations = relations(ticketTypes, ({ one, many }) => ({
	event: one(events, {
		fields: [ticketTypes.eventId],
		references: [events.id],
	}),
	tickets: many(tickets),
}));

export const ticketRelations = relations(tickets, ({ one }) => ({
	ticketType: one(ticketTypes, {
		fields: [tickets.ticketTypeId],
		references: [ticketTypes.id],
	}),
	buyer: one(user, {
		fields: [tickets.userId],
		references: [user.id],
	}),
}));

export const orderRelations = relations(orders, ({ one }) => ({
	buyer: one(user, {
		fields: [orders.userId],
		references: [user.id],
	}),
	ticketType: one(ticketTypes, {
		fields: [orders.ticketTypeId],
		references: [ticketTypes.id],
	}),
}));
