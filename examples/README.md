# GenesisTrace Examples

This directory contains comprehensive examples demonstrating various features and use cases of the GenesisTrace library.

## Domain Layout

Examples now live in domain-specific folders so it is easier to browse focused content:

- `core/` – starter walkthroughs and rendering showcases
- `technology/` – developer tooling, AI, pipelines, and infrastructure demos
- `commerce/` – retail, operations, and business process simulations
- `civic/` – government, public safety, municipal, and healthcare orchestration
- `faith/` – Catholic liturgies, devotionals, and ministry storytelling
- `education/` – curricula, study guides, and instructional philosophy labs

> The run commands throughout this guide keep the short `example.ts` notation. Either `cd` into the example's domain directory (for example `cd examples/core`) before running the command, or include the domain prefix when executing from the repository root (`deno run ... examples/core/example.ts`).

## Quick Start Examples

### 🎯 [basic.ts](./core/basic.ts)

**Quick introduction to core features**

- Basic logging (debug, info, success, warning, error)
- Tables and boxes
- Progress bars and spinners
- Charts and interactive prompts

**Run:** `deno run --allow-read --allow-write --allow-env core/basic.ts`

### 📚 [comprehensive.ts](./core/comprehensive.ts)

**Complete feature showcase**

- All logging levels with metadata
- Child loggers and namespaces
- Custom configuration and themes
- All visual components (boxes, tables, banners, charts)
- Color system features (gradients, hex/RGB colors)
- Built-in formatters
- Log history management

**Run:** `deno run --allow-env --allow-read --allow-write core/comprehensive.ts`

## Real-World Application Examples

### 🚀 [mission-control.ts](./technology/mission-control.ts)

**Orbital mission control simulation**

- Advanced logger configuration with plugins
- Tables, charts, and formatted metrics
- Progress indicators for launch sequences
- Banners and status call-outs
- Real-world operations/SRE dashboard

**Run:** `deno run --allow-env --allow-read --allow-write technology/mission-control.ts`

### 🦅 [united-states-government.ts](./civic/united-states-government.ts) ⭐ NEW

**United States Government operations & readiness showcase**

- National banner + oath spinner grounded in the U.S. Constitution
- Neon-themed logger writing to disk via the FileLoggerPlugin
- Branch alignment table, cabinet performance dashboard, and NSC key-value briefings
- Legislative + emergency progress bars with real-time logging
- Bar, line, sparkline, and pie charts for budget, readiness, and threat telemetry
- Color-rich GenesisTrace storytelling tailored for federal leadership reviews

**Run:** `deno run --allow-env --allow-read --allow-write civic/united-states-government.ts`

### 🚔 [okc-police-department.ts](./civic/okc-police-department.ts) ⭐ NEW

**Law enforcement command & operations center - Oklahoma City Police Department**

Comprehensive police operations and public safety coordination demonstration featuring:

- Real-time 911 dispatch and call tracking
- Officer deployment and status monitoring (patrol, detective, K-9, SWAT)
- Vehicle fleet tracking with GPS and fuel management
- Case management and investigation tracking
- Evidence chain of custody monitoring
- Crime analytics and pattern recognition
- Community policing programs and outreach metrics
- Emergency response time analytics
- Multi-district coordination (NW, NE, SW, SE, Central, Lake Patrol)
- Interactive incident reporting workflow
- Priority-based call routing and officer assignment
- Performance metrics and operational improvements
- Real-time situational awareness dashboard

**Run:** `deno run --allow-env --allow-read --allow-write civic/okc-police-department.ts`

### 🏥 [stephenson-cancer-center-okc.ts](./civic/stephenson-cancer-center-okc.ts) ⭐ NEW

**Medical oncology operations & patient care - Stephenson Cancer Center, OKC**

Comprehensive cancer treatment center animation lab featuring:

- Patient census and treatment care plan tracking
- Radiation therapy and chemotherapy session monitoring
- Clinical trial enrollment and research program management
- Multidisciplinary care team coordination (oncology, surgery, nursing, social work)
- Laboratory results and diagnostic imaging workflows
- Patient support services (nutrition, financial aid, survivorship programs)
- Treatment outcome analytics and quality metrics
- Animated treatment session visualization (chemotherapy infusion)
- Complete patient journey simulation (diagnosis to remission)
- NCI-designated cancer center operations dashboard
- HIPAA-compliant patient privacy (initials only)
- Compassionate care delivery with holistic wellness programs

**Run:** `deno run --allow-env --allow-read --allow-write civic/stephenson-cancer-center-okc.ts`

### ⚡ [oklahoma-gas-electric.ts](./civic/oklahoma-gas-electric.ts) ⭐ NEW

**Grid operations & storm response lab - Oklahoma Gas & Electric (OG&E)**

- SCADA-inspired grid snapshot with regional load tables, line charts, and reserve progress meters
- Generation fleet analytics featuring facility tables, fleet KPIs, and a live fuel mix pie chart
- Outage & storm command dashboard with restoration progress bars and cause breakdown charts
- Field crew deployment tracking with resource tables and workforce utilization visuals
- Customer experience + reliability KPIs with contact center stats and digital engagement metrics
- SPP market telemetry tables, price line charts, and renewable output sparklines
- Interactive outage intake workflow using prompts, spinners, and logger narration

**Run:** `deno run --allow-env --allow-read --allow-write civic/oklahoma-gas-electric.ts`

### 🔧 [tire-shop-management.ts](./commerce/tire-shop-management.ts) ⭐ NEW

**Professional tire shop operations & management system**

Comprehensive tire shop management demonstration featuring:

- Interactive service order creation and tracking
- Real-time tire inventory management with stock alerts
- Work bay status monitoring and technician performance
- Revenue analytics and business metrics
- Customer queue management
- Service completion tracking
- Multi-view dashboard (operations, inventory, analytics)
- Professional shop branding and UI

**Run:** `deno run --allow-env --allow-read --allow-write commerce/tire-shop-management.ts`

### 🌿 [greenhouse-dispensary-okc.ts](./commerce/greenhouse-dispensary-okc.ts) ⭐ NEW

**Cannabis dispensary operations & management system - Oklahoma City**

Professional medical marijuana dispensary management demonstration featuring:

- Interactive customer order processing with medical card verification
- Real-time cannabis product inventory tracking (flower, concentrates, edibles, vapes)
- Budtender performance monitoring and certification levels
- Revenue analytics and loyalty points system
- OMMA compliance reporting and daily purchase limits
- Category breakdown and sales analytics
- Patient transaction history
- Multi-view dashboard (operations, inventory, analytics, compliance)
- Oklahoma-specific regulatory compliance features

**Run:** `deno run --allow-env --allow-read --allow-write commerce/greenhouse-dispensary-okc.ts`

### 🧮 [algebra-i-ii.ts](./education/algebra-i-ii.ts) ⭐ NEW

**Algebra I & II curriculum operations lab**

- Dual-course scope & sequence tracking with mastery analytics
- Logger-driven instructional status + assessment sync spinner
- Detailed tables for Algebra I and Algebra II unit playlists
- Strand mastery charting, exit-ticket sparklines, and KPI box-outs
- Progress bar checkpoints with intervention + enrichment call-outs
- Beautiful GenesisTrace banners and instructional storytelling

**Run:** `deno run --allow-env --allow-read --allow-write education/algebra-i-ii.ts`

### 💻 [html-css-js-guide.ts](./education/html-css-js-guide.ts) ⭐ NEW

**Complete HTML + CSS + JavaScript field guide**

- Banner-driven overview of semantics, styling systems, and scripting rhythm
- Tables for landmark elements, CSS layout tools, JS patterns, and project roadmaps
- Progress bar learning path with weekly deliverables and color-coded milestones
- Charted skill allocation plus habit callouts for specs, accessibility, and testing

**Run:** `deno run --allow-env examples/education/html-css-js-guide.ts`

### 🌐 [web-development-fundamentals.ts](./education/web-development-fundamentals.ts) ⭐ NEW

**Comprehensive educational presentation on web development**

An interactive, informational presentation covering:
- How the Web Works (HTTP, Client-Server Model, Request/Response Cycle)
- Frontend Technologies (HTML, CSS, JavaScript fundamentals)
- Backend Technologies (Languages, Databases, API styles)
- Modern Development Tools & Best Practices
- Complete Learning Roadmap (Beginner to Advanced, 12-month timeline)
- Practical Project Ideas (Beginner through Advanced)
- Career Paths & Resources (Job roles, salaries, learning platforms)
- Beautifully visualized with tables, charts, progress bars, spinners, and boxes
- Perfect for beginners learning web development or educators teaching coding

**Run:** `deno run --allow-env --allow-read --allow-write examples/education/web-development-fundamentals.ts`

### 💄 [okc-beauty-salon.ts](./commerce/okc-beauty-salon.ts) ⭐ NEW

**Luxury beauty salon operations & guest experience - Oklahoma City**

Boutique salon demo featuring:

- Brand-forward banners, service menus, and glam team dashboards
- Weekly booking cadence visualization with GenesisTrace charts
- Retail shelf intelligence with formatted KPI call-outs
- Experience progression bars for spa rituals and bridal rehearsals
- Membership + community sentiment monitoring with spinner moments
- Styled Logger output tuned for Midtown OKC operations teams

**Run:** `deno run --allow-env --allow-read --allow-write commerce/okc-beauty-salon.ts`

### ✂️ [okc-barbershop.ts](./commerce/okc-barbershop.ts) ⭐ NEW

**Traditional barbershop operations & customer experience - Oklahoma City**

Professional barbershop management demonstration featuring:

- Classic service menu with fades, hot towel shaves, and grooming packages
- Master barber roster with specialties and chair utilization tracking
- Weekly appointment volume visualization with bar charts
- Real-time daily schedule and customer flow management
- Product inventory tracking with velocity metrics
- Service progression monitoring for active appointments
- VIP membership and loyalty program analytics
- Revenue dashboard with category breakdown and targets
- Customer satisfaction tracking and operational insights
- Bricktown location-specific branding and OKC Thunder game day features

**Run:** `deno run --allow-env --allow-read --allow-write commerce/okc-barbershop.ts`

### ⚡ [pradaxiol-catholic-genius.ts](./faith/pradaxiol-catholic-genius.ts) ⭐ NEW

**Cinematic Catholic cyber genius animation**

- Pradaxiol journey of a Catholic computer science prodigy who now outruns Big Tech
- Cinematic spinner + progress bar beats for explosive mercy detonations
- Tables and charts narrating saintly telemetry vs corporate control
- Faith-focused Box renderings where Catholicism becomes the guidance system
- Logger storytelling with GenesisTrace neon theme and Catholic mission metadata

**Run:** `deno run --allow-env --allow-read --allow-write faith/pradaxiol-catholic-genius.ts`

### 🎬 [catholic-church-animation-lab.ts](./faith/catholic-church-animation-lab.ts) ⭐ NEW

**Cathedral animation lab with sparkline choreography**

- Sacred cinematics console for choirs, drones, stained glass, and pilgrim telemetry
- Neon logger storyline, spinner beats, and timeline progress orchestration
- Towering sparkline wall with multiple variants (base, smoothing, lifted gradients)
- Pilgrimage signal deck comparing global devotion feeds in real time
- Production station tracking for rosary motion capture, fluid sims, and broadcast control

**Run:** `deno run --allow-env --allow-read --allow-write faith/catholic-church-animation-lab.ts`

### ✨ [catholic-prayer-chosen-ones.ts](./faith/catholic-prayer-chosen-ones.ts) ⭐ NEW

**Animation lab for the Catholic prayer entrusted to the Chosen Ones**

- Luminous prayer movement table with scriptures, invocations, and pulse indicators
- Production station matrix covering sanctuary storyboard through dispatch bay logistics
- Remnant telemetry wall rendered as in-console sparklines plus logger narration
- Stage synchronization progress bar, intercession spinner queue, and benediction wave

**Run:** `deno run --allow-env --allow-read --allow-write faith/catholic-prayer-chosen-ones.ts`

### 🌅 [daily-catholic-formation-lab.ts](./faith/daily-catholic-formation-lab.ts) ⭐ NEW

**Daily Catholic formation animation**

- Morning offering through night examen visualized with spinners, tables, and wave pulses
- Virtue habit scorecards plus corporal works of mercy tracker
- Ignatian examen progress bar with neon logger storytelling
- Lectio Divina pulse animation rendered directly via GenesisTrace color helpers
- Mission charge box encouraging practical holiness every day

**Run:** `deno run --allow-env --allow-read --allow-write faith/daily-catholic-formation-lab.ts`

### 🪵 [alex-pallets-okc.ts](./commerce/alex-pallets-okc.ts) ⭐ NEW

**Pallet manufacturing & distribution operations - Oklahoma City**

### 🔥 [supreme-kitchen-exhaust-cleaning.ts](./commerce/supreme-kitchen-exhaust-cleaning.ts) ⭐ NEW

**Supreme Kitchen Exhaust Cleaning – Edmond, Oklahoma**

- Mission-focused branding for the headquarters at 16404 Friar Court
- Appointment handler with rapid-response inserts, scheduling, and progress tracking
- Real-time crew telemetry table powered by GenesisTrace live refresh cycles
- Compliance call-outs, service menus, and capacity metrics for hood/duct operations
- Spinner- and progress-bar-driven sequences to highlight live dispatch orchestration

**Run:** `deno run --allow-env --allow-read commerce/supreme-kitchen-exhaust-cleaning.ts`

Comprehensive pallet manufacturing and logistics demonstration featuring:

- Real-time pallet inventory tracking (new, refurbished, custom pallets)
- Multiple pallet types and wood grades management
- Customer order management and fulfillment workflows
- Warehouse bay operations and efficiency monitoring
- Quality inspection and grading systems
- Delivery scheduling and route optimization for OKC metro area
- Production simulation with live assembly workflow
- Business analytics with efficiency gains visualization
- Revenue tracking and operational metrics
- Interactive operations dashboard
- Local Oklahoma City business operations showcase

**Run:** `deno run --allow-env --allow-read --allow-write commerce/alex-pallets-okc.ts`

### 📚 [okc-metro-library-dashboard.ts](./civic/okc-metro-library-dashboard.ts) ⭐ NEW

**Public library operations & community services - Oklahoma City**

Complete library management system for the Ronald J. Norick Downtown Library featuring:

- Real-time patron services and circulation tracking
- Collection management (books, e-books, audiobooks, media)
- Multi-floor facility operations (study rooms, computer labs, meeting spaces)
- Program and event scheduling (storytimes, book clubs, workshops, author talks)
- Staff management and workstation monitoring
- Digital services analytics (website, catalog, databases, WiFi)
- Hold requests and inter-library loan tracking
- Patron registration workflow
- Cataloging simulation with bibliographic processing
- Circulation statistics and community impact metrics
- Study room and computer utilization tracking
- Business intelligence and operational improvements
- Interactive operations dashboard for library staff

**Run:** `deno run --allow-env --allow-read --allow-write civic/okc-metro-library-dashboard.ts`

### 🔬 [substrate-chip-manufacturing.ts](./technology/substrate-chip-manufacturing.ts) ⭐ NEW

**Substrate X-ray lithography chip fabrication simulation**

Demonstrates how Substrate, Inc. (Peter Thiel-backed semiconductor startup) might use GenesisTrace for their revolutionary chip manufacturing process:

- Particle accelerator operations monitoring
- X-ray lithography process tracking (3nm node)
- Wafer fabrication pipeline stages
- Quality control and yield metrics
- Cleanroom telemetry visualization
- Production dashboard with shift data
- Competitive analysis vs ASML EUV

**Run:** `deno run --allow-env --allow-read --allow-write technology/substrate-chip-manufacturing.ts`

### 🌄 [santiago-paspaaquero-animation-lab.ts](./civic/santiago-paspaaquero-animation-lab.ts) ⭐ NEW

**Municipal animation lab – Santiago Paspaáquero, Durango, México**

Comprehensive civic orchestration demo featuring:

- GenesisTrace real-time logger tuned for Sierra Madre municipal services
- Civic identity spinners, cultural banners, and mission statements
- Multi-program progress bars with live telemetry logging
- Direct stdout ticker visualizing water, transit, digital plaza, and culture metrics
- Municipal operations table plus Sierra Madre wave animation finale
- Celebration sequences to close the lab with actionable commitments

**Run:** `deno run --allow-env --allow-read --allow-write civic/santiago-paspaaquero-animation-lab.ts`

### 📊 [real-time-dashboard.ts](./technology/real-time-dashboard.ts) ⭐ NEW

**Live-updating metrics dashboard**

- Real-time data updates every 2 seconds
- Dynamic tables, charts, and progress bars
- Color-coded status indicators
- System monitoring visualization
- Live CPU, memory, and request metrics

**Run:** `deno run --allow-env --allow-read technology/real-time-dashboard.ts`

### 🎮 [cli-tool.ts](./core/cli-tool.ts) ⭐ NEW

**Interactive CLI application (User Management System)**

- Menu-driven interface
- Interactive prompts (input, select, confirm)
- CRUD operations with validation
- Structured logging throughout
- Real-world CLI tool patterns

**Run:** `deno run --allow-env --allow-read --allow-write core/cli-tool.ts`

### 🚨 [incident-response.ts](./technology/incident-response.ts)

**Error tracking and alerting system**

- Real-time incident monitoring
- Error aggregation and categorization
- Alert notifications
- Recovery procedures
- Incident reporting

**Run:** `deno run --allow-env --allow-read --allow-write technology/incident-response.ts`

### 🏞️ [praxedis-g-guerrero-animation-lab.ts](./civic/praxedis-g-guerrero-animation-lab.ts) ⭐ NEW

**Municipal animation lab – Praxedis G. Guerrero, Chihuahua (Spanish)**

- Rural storytelling banner, logger, and spinner moments in Mexican Spanish
- Data tables for brigadas de agua, cooperativas y jornadas comunitarias
- Sequential progress bars highlighting water, education, and health initiatives
- Lightweight ASCII/emoji animation inspired by desert surcos and acequias
- Designed for cabildos, radios comunitarias, and ejido assemblies

**Run:** `deno run --allow-env --allow-read --allow-write civic/praxedis-g-guerrero-animation-lab.ts`

## Pipeline & Processing Examples

### 🔄 [data-pipeline.ts](./technology/data-pipeline.ts) ⭐ NEW

**ETL data processing pipeline**

- Multi-stage pipeline (Extract, Transform, Load)
- Progress tracking for each stage
- Batch processing with retry logic
- Error handling and validation
- Pipeline statistics and reporting

**Run:** `deno run --allow-env --allow-read --allow-write technology/data-pipeline.ts`

### 🏗️ [build-pipeline.ts](./technology/build-pipeline.ts) ⭐ NEW

**CI/CD build system simulation**

- Multi-stage build process
- Job dependency management
- Parallel execution simulation
- Error handling and recovery
- Comprehensive build reports

**Run:** `deno run --allow-env --allow-read --allow-write technology/build-pipeline.ts`

## Visual & Animation Examples

### ⚡ [animated-lab.ts](./core/animated-lab.ts)

**Animation capabilities showcase**

- Sequential spinner playlists
- Multi-stage progress bars
- Custom wave animations
- Live message updates
- Kinetic terminal storytelling

**Run:** `deno run --allow-env --allow-read --allow-write core/animated-lab.ts`

### 🌈 [truecolor-showcase.ts](./core/truecolor-showcase.ts)

**16.7M color rendering**

- Gradient generation and rendering
- Hex and RGB color usage
- Heatmap visualization
- Color palette demonstrations
- Brand-focused presentations

**Run:** `deno run --allow-env core/truecolor-showcase.ts`

### 🎨 [theme-comparison.ts](./core/theme-comparison.ts) ⭐ NEW

**Visual theme comparison guide**

- Side-by-side theme comparison
- All built-in themes (default, neon, dracula, minimal)
- Custom theme examples
- Color palette showcase
- Theme selection recommendations

**Run:** `deno run --allow-env core/theme-comparison.ts`

### 🎉 [fiesta-celebration.ts](./core/fiesta-celebration.ts)

**Festive animation demo**

- Colorful celebrations and animations
- Party-themed visual effects
- Creative use of colors and symbols

**Run:** `deno run --allow-env core/fiesta-celebration.ts`

### 🎆 [fourth-of-july.ts](./core/fourth-of-july.ts)

**Holiday-themed showcase**

- Patriotic color schemes
- Firework animations
- Themed banners and effects

**Run:** `deno run --allow-env core/fourth-of-july.ts`

## Advanced Patterns & Techniques

### 🔌 [custom-plugin.ts](./technology/custom-plugin.ts) ⭐ NEW

**Plugin development guide**

- Creating custom logger plugins
- Plugin lifecycle hooks (onInit, onLog, onShutdown)
- Metrics collection plugin
- Filtered logger plugin
- Alert/notification plugin
- Performance tracking plugin

**Run:** `deno run --allow-env --allow-read --allow-write --allow-net technology/custom-plugin.ts`

### 🛡️ [error-handling.ts](./technology/error-handling.ts) ⭐ NEW

**Error handling & recovery patterns**

- Retry logic with exponential backoff
- Circuit breaker pattern
- Graceful degradation with fallbacks
- Error aggregation and reporting
- Robust error recovery strategies

**Run:** `deno run --allow-env --allow-read --allow-write technology/error-handling.ts`

### 🌐 [framework-adapters.ts](./technology/framework-adapters.ts)

**Framework middleware integration**

- Oak middleware example
- Hono middleware example
- Express middleware example
- HTTP request/response logging

**Run:** `deno run --allow-env --allow-net technology/framework-adapters.ts`

## Specialized Examples

### 🚀 [denogenesis-banner.ts](./core/denogenesis-banner.ts)

**ASCII art banner showcase**

- Enterprise-grade ASCII banners
- Application startup screens
- DenoGenesis-style presentations
- System information display

**Run:** `deno run --allow-env --allow-read core/denogenesis-banner.ts`

### 💭 [great-minds-loop.ts](./education/great-minds-loop.ts)

**Inspirational quotes with styling**

- Animated quote display
- Creative text formatting
- Timed presentations

**Run:** `deno run --allow-env education/great-minds-loop.ts`

### 🧠 [slm-llm-productivity-guide.ts](./technology/slm-llm-productivity-guide.ts)

**AI/LLM productivity tips**

- Informative content presentation
- Multi-section layouts
- Educational formatting

**Run:** `deno run --allow-env technology/slm-llm-productivity-guide.ts`

### 📜 [revelation-septuagint.ts](./revelation-septuagint.ts)

**Apocalypse of John liturgical narrative**

- Septuagint Greek quotations with formatted callouts
- Sevenfold cycle dashboard (tables, progress, charts)
- Liturgical hymns and symbolic imagery digest

**Run:** `deno run --allow-env revelation-septuagint.ts`

### 🪽 [guardian-angel-prayer.ts](./guardian-angel-prayer.ts) ⭐ NEW

**Contemplative Guardian Angel devotion**

- Banner-guided meditation overview
- Spinner-based reflection playlist
- Progress bar through each stanza
- Box-rendered prayer text
- Intention table with scriptural references

**Run:** `deno run --allow-env --allow-read --allow-write guardian-angel-prayer.ts`

### 🕯️ [silent-suffering-prayer.ts](./faith/silent-suffering-prayer.ts) ⭐ NEW

**Catholic prayers for those who suffer in silence**

- Banner-guided pastoral focus for hidden burdens
- Table of listening stations with saintly companions
- Spinner-led vigil moment and litany progressions
- Box-rendered prayer text for communal recitation
- Mercy commitment bar chart and commissioning tracker

**Run:** `deno run --allow-env --allow-read --allow-write faith/silent-suffering-prayer.ts`

### 📜 [unix-philosophy-2.ts](./education/unix-philosophy-2.ts)

**Unix philosophy presentation**

- Technical philosophy showcase
- Educational content display
- Structured information layout

**Run:** `deno run --allow-env education/unix-philosophy-2.ts`

## Example Categories

### By Use Case

- **Learning the Basics**: basic.ts, comprehensive.ts
- **CLI Applications**: cli-tool.ts, okc-police-department.ts, stephenson-cancer-center-okc.ts, tire-shop-management.ts, greenhouse-dispensary-okc.ts, okc-beauty-salon.ts, okc-barbershop.ts, alex-pallets-okc.ts, okc-metro-library-dashboard.ts, framework-adapters.ts
- **Dashboards & Monitoring**: real-time-dashboard.ts, mission-control.ts, okc-police-department.ts, stephenson-cancer-center-okc.ts, tire-shop-management.ts, greenhouse-dispensary-okc.ts, okc-beauty-salon.ts, okc-barbershop.ts, alex-pallets-okc.ts, okc-metro-library-dashboard.ts
- **Law Enforcement & Public Safety**: okc-police-department.ts
- **Healthcare & Medical**: stephenson-cancer-center-okc.ts
- **Data Processing**: data-pipeline.ts, build-pipeline.ts
- **Error Handling**: error-handling.ts, incident-response.ts
- **Visual Effects**: animated-lab.ts, truecolor-showcase.ts, fiesta-celebration.ts
- **Devotionals & Liturgical**: guardian-angel-prayer.ts, silent-suffering-prayer.ts, revelation-septuagint.ts, litany-st-joseph.ts
- **Customization**: theme-comparison.ts, custom-plugin.ts

### By Complexity

- **Beginner**: basic.ts, theme-comparison.ts
- **Intermediate**: cli-tool.ts, okc-police-department.ts, stephenson-cancer-center-okc.ts, tire-shop-management.ts, greenhouse-dispensary-okc.ts, okc-beauty-salon.ts, okc-barbershop.ts, alex-pallets-okc.ts, okc-metro-library-dashboard.ts, mission-control.ts, animated-lab.ts
- **Advanced**: data-pipeline.ts, build-pipeline.ts, custom-plugin.ts, error-handling.ts

### By Feature Focus

- **Logging**: comprehensive.ts, incident-response.ts, okc-police-department.ts, stephenson-cancer-center-okc.ts
- **Progress Indicators**: data-pipeline.ts, build-pipeline.ts, okc-police-department.ts, stephenson-cancer-center-okc.ts, okc-beauty-salon.ts, okc-barbershop.ts, alex-pallets-okc.ts, okc-metro-library-dashboard.ts
- **Interactive Prompts**: cli-tool.ts, okc-police-department.ts, stephenson-cancer-center-okc.ts, tire-shop-management.ts, greenhouse-dispensary-okc.ts, okc-beauty-salon.ts, okc-barbershop.ts, alex-pallets-okc.ts, okc-metro-library-dashboard.ts
- **Animation & Spinners**: animated-lab.ts, stephenson-cancer-center-okc.ts
- **Themes & Colors**: theme-comparison.ts, truecolor-showcase.ts
- **Plugins**: custom-plugin.ts
- **Tables & Charts**: real-time-dashboard.ts, mission-control.ts, okc-police-department.ts, stephenson-cancer-center-okc.ts, tire-shop-management.ts, greenhouse-dispensary-okc.ts, okc-beauty-salon.ts, okc-barbershop.ts, alex-pallets-okc.ts, okc-metro-library-dashboard.ts

## Running Examples

All examples can be run directly with Deno. Most examples require these permissions:

- `--allow-env` - Read environment variables (for color detection)
- `--allow-read` - Read files (for some examples)
- `--allow-write` - Write log files
- `--allow-net` - Network access (for framework examples)

### Quick Run

```bash
# Run any example (from repo root)
deno run --allow-env --allow-read --allow-write examples/<domain>/example-name.ts

# Run with all permissions (for convenience)
deno run -A examples/<domain>/example-name.ts
```

## New Examples Added

✨ **8 New Examples** have been added to provide comprehensive coverage:

1. **real-time-dashboard.ts** - Live metrics dashboard with auto-refresh
2. **cli-tool.ts** - Complete interactive CLI application
3. **tire-shop-management.ts** - Professional tire shop operations & management system
4. **data-pipeline.ts** - ETL pipeline with multi-stage processing
5. **build-pipeline.ts** - CI/CD build system simulation
6. **custom-plugin.ts** - Plugin development guide with 4 examples
7. **theme-comparison.ts** - Visual comparison of all themes
8. **error-handling.ts** - Comprehensive error handling patterns

## Tips for Learning

1. **Start with basic.ts** to understand core features
2. **Review comprehensive.ts** for a complete feature overview
3. **Explore theme-comparison.ts** to choose your preferred aesthetic
4. **Study cli-tool.ts** for interactive CLI patterns
5. **Check custom-plugin.ts** to extend functionality
6. **Examine error-handling.ts** for production-ready error patterns

## Contributing Examples

Want to add your own example? Examples should:

- Demonstrate specific features or use cases
- Include clear comments and documentation
- Follow consistent styling and patterns
- Be self-contained and runnable
- Include a descriptive header comment

## License

All examples are provided under the same MIT license as GenesisTrace.
