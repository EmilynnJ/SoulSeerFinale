SoulSeer
Initial Launch Build Guide
Pay-Per-Minute Readings & Community
ACommunity of Gifted Psychics
SCOPE: This guide covers the initial public launch of SoulSeer. All features not listed here — live
streaming, marketplace/shop, virtual gifting, scheduled bookings, and direct messaging — are deferred
to a future build phase.
****DISREGARD MENTIONOFABLYUSE!!
!***READING SYSTEMWILLUSEAGORASDK’S,RTMP,WS,ANDVERCELCRON,PLUSSTRIPEFOR
PAYPERMINUTEBILLING!!!!
PREMIUMMESSAGINGNEEDSTOBEINCLUDEDINTHISBUILD:CLIENTCAN
MESSAGEANYREADERFORFREEOUTSIDEOFSESSIONS. HOWEVER,READER
DETERMINES IFTHEIRRESPONSEWILLBEFREEORACHARGEFORCLIENTTOBE
ABLETOREAD.IFCHARGE,CLIENTMUSTHAVEADEQUATEFUNDSINTHEIR
ACCOUNTTOBEABLETOOPENANDREADRESPONSE,ASTHISISPERCEIVEDBY
READERASINADDITIONORFOLLOWUPTOREADING**
1. Purpose &Vision
SoulSeer is a premium platform connecting spiritual readers with clients seeking guidance. The
app embodies a mystical yet professional atmosphere while providing robust functionality for
seamless spiritual consultations. All design elements should prioritize intuitive user experience
alongside the ethereal aesthetic.
This initial launch focuses exclusively on the two core pillars that deliver immediate value:
• Pay-per-minutelive readings (chat, voice, and video) via Agora
• Communityhub—publicforumandlinkstotheSoulSeerDiscordand
Facebook community group
2. Technology Stack
⚠️Every integration listed here is required. Do not substitute alternatives.
2.1CoreFramework
Layer Technology Purpose
Frontend React(Vite) UI—monorepoclient
Backend Node.js+Express APIserver—monoreposerver
Language TypeScript(strict) Bothclientandserver
Architecture Monorepo Sharedtypesvia/sharedpackage
2.2RequiredIntegrations
Service Provider Use
Authentication Auth0 Alluserauth—social+emaillogin
Real-TimeComms Agora Chat,voice,andvideoreadingsessions
Database Neon(Postgres) AllpersistentdataviaDrizzleORM
Payments Stripe Balancetop-ups,readerpayoutsviaStripeConnect
FileStorage CloudinaryorS3 Readerprofileimagesuploadedbyadmin
⚠️AgorahandlesALLreal-timecommunicationforreadings.Donotimplementcustom
WebRTCorWebSocket-basedreadingsessions.
3.Theme&DesignSystem
3.1Aesthetic
Celestial,mystical,andethereal.Dark-modedefault.Thedesignmustfeelpremiumand
spiritual—notgeneric.Everyscreenshouldfeelcohesive.
3.2ColorPalette
Role Color Hex
Primary/Headings MysticalPink #FF69B4
Accent Gold #D4AF37
Background DeepBlack/DarkNavy #0A0A0F
Surface / Cards
Body Text (dark bg)
Body Text (light bg)
3.3 Typography
Dark Purple-Black
White
Black
• Headings:Alex Brush font, pink (#FF69B4)
• Bodytext:Playfair Display
#13111A
#FFFFFF
#000000
• UIelements(buttons, labels, nav): consistent with above — never mix in system fonts
• Accessibility: all text must meet WCAG AA contrast ratios
3.4 Visual Elements
• Cosmic/celestial design elements: stars, moons, constellation patterns used as decorative
accents
• Smooth,subtle animations on transitions and interactive elements — animations must
not hinder usability
• Goldaccentsused sparingly for emphasis and borders
• Backgroundimage: https://i.postimg.cc/sXdsKGTK/DALL-E-2025-06-06-14-36-29
Avivid-ethereal-background-image-designed-for-a-psychic-reading-app.webp
• Heroimage:https://i.postimg.cc/tRLSgCPb/HERO-IMAGE-1.jpg
• Founderimage:https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg
3.5 Mobile-First Requirement
⚠️The app MUSTbefully responsive and mobile-friendly. This is non-negotiable. Test every
screen at 375px, 768px, and 1280px breakpoints.
4. Navigation Structure (Initial Launch)
Only these pages exist in the initial launch. All other pages from the full build guide are
deferred.
Route
Page
Access
/
Home
Public
/readers
/readers/:id
/about
Browse Readers
Reader Profile
About SoulSeer
Public
Public
Public
/community
/login
/dashboard
/reading/:id
/help
Community Hub
Login / Sign Up
Public
Public (unauthed only)
Role Dashboard
Authenticated
Live Reading Session
Authenticated (participants only)
Help / FAQ
Public
⚠️Routes for /shop, /live, /messages, /gifts are NOT built in this phase. Do not scaffold them.
5. User Roles &Accounts
5.1 Role Definitions
Role
How Created
Capabilities
Client
Reader
Self-register via Auth0
Admin creates only
Browse readers, fund balance, start readings, post in
forum, rate readings
Manage ownprofile/rates, toggle availability, accept
readings, view earnings
Admin
Manual DB seed
Full platform control — user management, reader
creation, transaction oversight
⚠️Reader accounts can ONLY be created by an admin through the admin dashboard. Readers
cannot self-register.
5.2 Auth0 Configuration
• UseAuth0Universal Login for all client authentication
• Socialproviders: Google and Apple (required for App Store compliance)
• Email/password login also enabled
• JWTtokensusedforall APIauthentication — validate on every protected route
• Auth0userID(sub)stored in DB andused as the link between Auth0 and internal user
record
• Rolestoredin the internal database, not in Auth0 metadata
• Onfirstlogin, create internal user record if one does not exist
• Readersloginvia Auth0 using credentials created by admin — admin sets their initial
password and provides it to them
6. HomePage
6.1 Layout (top to bottom)
• Header:'SoulSeer' in Alex Brush font, pink, centered
• Heroimagedirectly below header
• Tagline: 'A Community of Gifted Psychics' in Playfair Display, centered
• Currently online readers grid — shows live availability, per-minute rates, and reading
types offered
• Newsletter signup input field with submit button
• Communitylinks: buttons to Facebook group and Discord server (open in new tab)
6.2 Online Readers Display
• Fetchanddisplay all readers where isOnline = true
• Eachreadercardshows: profile photo, name, specialties, per-minute rate (per type), and
an availability badge
• 'Start Reading' button on each card — directs unauthenticated users to login first
• Real-time updates: reader online/offline status must update without full page refresh
(use polling every 30s or WebSocket broadcast)
7. Readers —Browse&Profiles
7.1 Browse Readers Page (/readers)
• Gridofallreader profiles — online readers shown first
• Filter by: specialty, reading type (chat/voice/video), and online status
• Eachcard:profile photo, name, short bio excerpt, rating, specialties, per-minute rates
per type, online badge
7.2 Reader Profile Page (/readers/:id)
• Fullbio
• Specialties and services offered
• Per-minuterate displayed separately for chat, voice, and video
• Starrating and review count
• Recentreviews from clients (reviewer name, star rating, text, date)
• 'Start Reading' buttons for each available type — requires auth and minimum balance
8. Pay-Per-Minute Reading System
⚠️Agora is used for ALL real-time communication. Do not build custom WebRTC or
WebSocket-based audio/video. Agora handles chat, voice, and video sessions.
Agora fires “1 minute elapsed” event
→hits your /api/billing/tick endpoint
→serverless function wakes up
→deducts from Neonprepaid balance
→function sleeps
*****PAY PERMINUTEGOESTHRUSTRIPEANDNEON
DBDRIZZLE.!
***NO CRONJOBS!!!!!!***
8.1 How It Works(UserFlow)
1. Client browses readers and selects one who is online.
2. Client selects reading type: chat, voice, or video.
3. System checks client has minimum $5 account balance. If not, redirect to add funds.
4. Reading request is created in DB with status 'pending'. Reader receives a notification.
5. Reader accepts the request. Both users are connected to an Agora session.
6. Server-side billing starts the moment both participants have joined the Agora channel.
7. Either party can end the session. Billing stops, final cost is deducted from client balance.
8. Client is prompted to leave a star rating and written review.
8.2 Reading Types
Type
Agora SDK
Notes
Chat
Voice
Video
Agora RTM(Real-Time
Messaging)
Agora RTC(audio only)
Agora RTC(audio + video)
Text only. Transcript saved at session end.
No video stream. Mute button required.
Both parties have camera. Mute and camera toggle
required.
8.3 Agora Integration Requirements
• AgoraAppIDstoredinserver environment variable — never exposed to client
• Servergenerates a short-lived Agora token per session using Agora Token Builder
• Tokenendpoint: POST/api/readings/:id/agora-token — authenticated, participants only
• Eachreadingsession gets a unique Agora channel name (e.g., reading_[readingId])
• Clientfetches token from server before joining Agora channel
• Tokenexpiry: 3600seconds (1 hour) — sufficient for any single session
8.4 Server-Side Billing
⚠️Billing MUST be server-side. Never trust the client to report session duration.
• Whenbothparticipants join Agora and call POST /api/readings/:id/start, server records
startedAt timestamp
• Server-side billing timer fires every 60 seconds
• Eachtick: deduct pricePerMinute from client balance, credit reader 70%, platform keeps
30%
• Beforeeachdeduction: check client has sufficient balance
• Ifbalance is insufficient: immediately end session, notify both parties via WebSocket
push, finalize reading record
• Sessionend: record duration, totalCost, completedAt. Mark paymentStatus = 'paid'.
• Preventrace conditions: use database transactions for balance deduction + credit in a
single atomic operation
8.5 Disconnection & Grace Period
• Ifeither participant disconnects unexpectedly: pause billing timer, start a 2-minute grace
period
• Ifthedisconnected user reconnects within 2 minutes: resume session, restart billing
• Ifgraceperiod expires and both not reconnected: end session and finalize billing for time
actually connected
• Notifytheother participant when their session partner disconnects
• Readergoingofflinemid-session:treatedasdisconnect,graceperiodapplies
8.6ReadingDatabaseSchema
Field Type Notes
id integerPK Auto-increment
readerId integerFK Referencesusers
clientId integerFK Referencesusers
type enum 'chat'|'voice'|'video'
status enum 'pending'|'accepted'|'in_progress'|'completed'|
'cancelled'
pricePerMinute integer Incents
startedAt timestamp Whenbillingbegan
completedAt timestamp Whensessionended
duration integer Billedminutes
totalPrice integer Incents—finalbilledamount
paymentStatus enum 'pending'|'paid'|'refunded'
chatTranscript jsonb Chatsessionsonly—arrayofmessages
rating integer 1–5,nullable
review text Clientreview,nullable
8.7ReadingSessionUI
• Showreal-timeelapsedtimecounter(MM:SS)
• Showrunningcostcounterupdatingeverysecond(e.g.,'$2.47')
• Showclient'sremainingbalance
• 'EndSession'button—confirmswithuserbeforeending
• Lowbalancewarningwhenremainingbalancefallsbelow2minutesofsessioncost
• Chatsessions:messageinput,scrollablemessagehistory,timestamps
• Voicesessions:mute/unmutebutton,endcallbutton,participantindicators
• Videosessions:localandremotevideo,muteaudio,togglecamera,endcall
8.8 Post-Session
• Immediatelyafter session ends: show session summary (duration, total cost)
• Promptclient to rate 1–5 stars and leave a written review — can be skipped but shown
once
• Chattranscript stored in DB and viewable by both parties in their reading history
9. Dashboards
9.1 Client Dashboard
• Accountbalance —prominently displayed with 'Add Funds' button
• Readinghistory —list of completed readings with reader name, date, duration, cost, and
their review
• Upcoming/active readings — any pending or in-progress sessions
• Transaction history — itemized list of balance top-ups and reading charges
9.2 Reader Dashboard
• Online/offline toggle — clearly visible, easy to switch
• Per-minuterate settings — set individually for chat, voice, and video
• Earningssummary—today's earnings, total pending payout balance, historical earnings
• Sessionhistory — list of completed readings with client (shown as 'Client #[id]' for
privacy), date, duration, earnings
• Reviewsreceived — star ratings and written reviews from clients
9.3 Admin Dashboard
⚠️This is the control hub. Build it completely and securely.
• Userlist —all clients and readers, with account details and balance
• Createreader —formwith: full name, email, username, bio, specialties, per-type rates,
profile image upload, generate initial password
• Editreader —updateanyreader profile field including profile image
• Allreadings —searchable list of all sessions with status, participants, duration, revenue
• Transaction ledger — all balance top-ups and reading charges platform-wide
• Manualbalanceadjustment — add or deduct balance from any user account with reason
logged
• Forummoderation—viewanddeleteanyforum post or comment
10. CommunityHub(/community)
The Community page serves two purposes: linking users to the SoulSeer off-platform
communities, and providing an on-platform public forum for connection and discussion.
10.1 Community Links
• Prominentbutton: 'Join our Facebook Group' — links to SoulSeer Facebook community
(opens new tab)
• Prominentbutton: 'Join our Discord Server' — links to SoulSeer Discord (opens new tab)
• Briefdescription of each community and what members can expect
• Thesesamelinksappear on the homepage
10.2 Public Forum
• Anyonecanreadposts—nologinrequired to browse
• Loginrequired to post or comment
• Postshave: title, body text, author display name, timestamp, comment count
• Commentsarethreadedonelevel deep (replies to posts, not to other comments)
• Pagination: 10 posts per page, ordered newest first
• Categories: General, Readings, Spiritual Growth, Ask a Reader, Announcements
• Announcementscategory: only admins can create posts, everyone can comment
10.3 Forum Moderation
• Anyusercanflagapost or commentasinappropriate
• Flaggedcontent goes to an admin review queue in the admin dashboard
• Admincandeleteanypostor comment
• Noautomatedcontentscanning required in this phase — manual moderation only
11. Payment &BalanceSystem
⚠️Clients prepay by adding funds to their account balance. They only spend what they use,
calculated as minutes × reader's per-minute rate.
11.1 Adding Funds (Stripe)
• StripePayment Element used for card collection — PCI compliant, no raw card data
touches server
• Presetamountsoffered: $10, $25, $50, $100 — plus a custom amount input
• Minimumtop-up:$5
• OnStripepayment_intent.succeeded webhook: credit user's accountBalance in DB
• Stripewebhookendpoint must verify signature using Stripe-Signature header — never
skip this
• Balancestored in cents (integer) in DB — never store as float
11.2 Revenue Split
• 70%ofeachreading's cost goes to the reader's accountBalance
• 30%isretainedbythe platform
• Splitcalculated and applied server-side at each billing tick and at session close
• Useintegermathonly —Math.floor(amount * 0.70) for reader share
11.3 Reader Payouts (Stripe Connect)
• EachreaderhasaStripe Connect Express account created when admin creates their
profile
• Admintriggers payouts manually via admin dashboard (automated scheduling is a future
phase feature)
• Payoutthreshold: reader must have $15 or more in accountBalance to be paid out
• Onpayout:transfer reader's accountBalance to their Stripe Connect account, reset
accountBalance to 0
• StripeConnect onboarding link generated and sent to reader after account creation
11.4 Financial Security
• Allbalance operations use DB transactions — never update two balances in separate
queries
• Everyfinancial operation is logged with: userId, type, amount, timestamp, readingId (if
applicable)
• Double-deduction prevention: check reading status before processing payment — do not
process if already marked 'paid'
• Refundcapability in admin dashboard for disputed sessions
12. API Route Reference
All routes prefixed with /api. All routes except those marked Public require a valid Auth0 JWT
in the Authorization header.
12.1 Auth
Method Route
Access
Purpose
POST
/api/auth/sync
Authenticated
Sync Auth0 user to internal DB on first
login
GET /api/auth/me Authenticated Returncurrentuserprofile
12.2Users&Readers
Method Route Access Purpose
GET /api/readers Public Allreaderprofiles
GET /api/readers/online Public Onlinereadersonly
GET /api/readers/:id Public Singlereaderprofile
PATCH /api/readers/status Reader Toggleonline/offline
PATCH /api/readers/pricing Reader Updateper-typerates
PATCH /api/readers/profile Reader Updatebioandspecialties
GET /api/user/balance Authenticated Currentuserbalance
12.3Readings
Method Route Access Purpose
POST /api/readings/on-demand Client Createreadingrequest
POST /api/readings/:id/accept Reader Readeracceptsrequest
POST /api/readings/:id/agoratoken Participant GetAgoraRTC/RTMtoken
POST /api/readings/:id/start Participant Markbothjoined,startbilling
POST /api/readings/:id/end Participant Endsession,finalizebilling
POST /api/readings/:id/rate Client Submitratingandreview
GET /api/readings/client Client Client'sreadinghistory
GET /api/readings/reader Reader Reader'ssessionhistory
GET /api/readings/:id Participant Singlereadingdetail
12.4Payments
Method Route Access Purpose
POST
/api/payments/createintent
Authenticated CreateStripePaymentIntentfortop-up
POST /api/webhooks/stripe Public(Stripe
only)
Handlepayment_intent.succeeded
GET /api/transactions Authenticated User'stransactionhistory
12.5CommunityForum
Method Route Access Purpose
GET /api/forum/posts Public Paginatedpostlist
POST /api/forum/posts Authenticated Createpost
GET /api/forum/posts/:id Public Singlepostwithcomments
POST /api/forum/posts/:id/comments Authenticated Addcomment
POST /api/forum/posts/:id/flag Authenticated Flagpost
DELETE /api/forum/posts/:id Admin Deletepost
DELETE /api/forum/comments/:id Admin Deletecomment
12.6Admin
Method Route Access Purpose
GET /api/admin/users Admin Allusers
POST /api/admin/readers Admin Createreaderaccount
PATCH /api/admin/readers/:id Admin Editreaderprofile
GET /api/admin/readings Admin Allreadingsplatform-wide
GET /api/admin/transactions Admin Fulltransactionledger
POST /api/admin/balance-adjust Admin Manualbalanceadjustment
POST /api/admin/payouts/:readerId Admin Triggerreaderpayout
GET /api/admin/forum/flagged Admin Flaggedcontentqueue
13. Database Schema Overview
Database: Neon (serverless Postgres). ORM: Drizzle. All schema defined in /shared/schema.ts.
13.1 Core Tables
• users—id,auth0Id, email, username, fullName, role, bio, specialties, profileImage,
pricingChat, pricingVoice, pricingVideo, accountBalance, isOnline, stripeAccountId,
stripeCustomerId, createdAt
• readings —seeSection 8.6 for full schema
• transactions — id, userId, type ('top_up' | 'reading_charge' | 'payout' | 'adjustment'),
amount, balanceBefore, balanceAfter, readingId (nullable), stripeId (nullable), note,
createdAt
• forum_posts—id,userId, title, content, category, flagCount, createdAt
• forum_comments—id,postId, userId, content, flagCount, createdAt
• forum_flags —id, postId (nullable), commentId (nullable), reporterId, reason,
reviewedAt (nullable)
13.2 Drizzle ORM Rules
• Allmonetaryvalues stored as integers (cents) — never DECIMAL or FLOAT
• Alltimestamps stored as timestamp with timezone
• Foreignkeysdefined with .references() — enforce referential integrity
• UseDrizzletransactions (db.transaction()) for any operation that touches two or more
tables
14. Security Requirements
⚠️These are non-negotiable. Every item on this list must be implemented before launch.
14.1 Authentication & Authorization
• Allprotected routes validate the Auth0 JWT on every request — no exceptions
• Rolecheckedserver-side on every admin and reader route — never trust role from client
• Readingsession routes verify the requesting user is an actual participant (clientId or
readerId)
• Agoratokenendpoint verifies reading exists and user is a participant before issuing
token
14.2 Input Validation
• AllAPIrequest bodies validated with Zod schemas before processing
• Numericinputssanitized — check for NaN, negative values, unreasonably large values
• Stringinputs sanitized — max length enforced, HTML stripped where applicable
• Fileuploads (reader images via admin): type check (jpeg/png/webp only), size limit 5MB
14.3 Payment Security
• Stripewebhookendpoint verifies Stripe-Signature header on every request — use
stripe.webhooks.constructEvent()
• Nevercredit balance from client-reported amounts — only from verified Stripe webhook
events
• Balancedeductions use DB transactions to prevent race conditions and double charges
• Logeveryfinancial operation for audit trail
14.4 API Hardening
• Ratelimiting on all public endpoints using express-rate-limit
• Stricter rate limits on auth, payment, and reading creation endpoints
• Helmet.js for HTTPsecurity headers on all routes
• CORSconfiguredtoallow only your frontend domain
• Nosensitive data (passwords, Stripe keys, Agora secrets) ever logged or returned in API
responses
• Environmentvariables for all secrets — never hardcoded
14.5 Data Privacy
• Passwords: readers log in via Auth0 — no passwords stored in your DB
• Clientandreader identities in shared reading history shown with display names, not
email addresses
• GDPR/CCPA:includeaprivacy policy page (static) and honor account deletion requests
15. Error Handling & Reliability
15.1 Server Error Handling
• GlobalExpress error handler catches all unhandled errors and returns structured JSON
• Neverexposestack traces or internal error messages to the client in production
• Allasyncroute handlers wrapped in try/catch — no unhandled promise rejections
• Billing timer errors must be caught and logged — a billing failure must not silently lose
money
15.2 Client Error Handling
• Toastnotifications for all user-facing errors with clear, plain-language messages
• Agoraconnection errors show a reconnection attempt UI, not a blank screen
• Lowbalancedetected before session start — show top-up prompt, never let session start
with insufficient funds
• Ifsession fails to start after reader accepts, reading status resets to 'cancelled' and client
is notified
15.3 Logging
• Allserver errors logged with: timestamp, route, userId (if authenticated), error message
• Allfinancial operations logged with full details
• Useastructured logging library (pino or winston) — not raw console.log in production
16. Implementation Order
⚠️Complete each phase fully before moving to the next. Do not scaffold future features.
1. Coreinfrastructure — monorepo setup, TypeScript config, Neon DB connection, Drizzle
schema, environment variables
2. Auth0integration — login, logout, JWT validation middleware, user sync on first login,
role enforcement
3. Usersystem —reader profiles, admin dashboard reader creation with image upload,
online/offline toggle, pricing
4. Stripe payment integration — balance top-up flow, webhook handler with signature
verification, transaction logging
5. Agoraintegration — token generation server, Agora RTC/RTM client setup, channel
join/leave
6. Reading system —on-demand request flow, server-side billing, grace period disconnect
handling, session UI for chat/voice/video
7. Post-session — rating and review submission, transcript storage and display, session
summaries
8. Client and reader dashboards — balance display, reading history, earnings, review
history
9. Communityhub—forum(posts, comments, pagination, categories, flagging),
community links to Discord and Facebook
10. Admin dashboard completion — full transaction ledger, payout trigger, forum
moderation, manual balance adjustment
11. Homepage—online readers display, newsletter signup, community links, hero image,
full design polish
12. Security hardening — rate limiting, Helmet.js, CORS, full input validation audit,
penetration test key flows
13. QA—test all user flows, edge cases (low balance, disconnect, billing errors), mobile
responsiveness across devices
17. About Page (Verbatim Content)
⚠️Use the exact text below on the About page. Do not paraphrase or rewrite.
At SoulSeer, we are dedicated to providing ethical, compassionate, and judgment-free
spiritual guidance. Our mission is twofold: to offer clients genuine, heart-centered readings
and to uphold fair, ethical standards for our readers.
Founded by psychic medium Emilynn, SoulSeer was created as a response to the corporate
greed that dominates many psychic platforms. Unlike other apps, our readers keep the
majority of what they earn and play an active role in shaping the platform.
SoulSeer is more than just an app — it's a soul tribe. A community of gifted psychics united by
our life's calling: to guide, heal, and empower those who seek clarity on their journey. •
Founder image: https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg
18. Deferred to Future Build Phase
The following features from the full SoulSeer build guide are explicitly NOT part of this launch.
Do not build, scaffold, or create placeholder routes for any of these.
• Livestreaming and virtual gifting
• Marketplace and shop (physical and digital products)
• Scheduled/booked readings (fixed-price, calendar-based)
• Directmessaging between users
• Automatedreader payout scheduling (manual only in this phase)
• Pushnotifications
• Emailmarketing integration
• PWA/offlinefunctionality
• Availability calendar for readers
• Socialsharing features
⚠️The codebase must be built with modular architecture so these features can be added
cleanly in the next phase without requiring a rewrite of core systems.