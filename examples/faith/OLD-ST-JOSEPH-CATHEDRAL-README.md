# Old St. Joseph Cathedral - Oklahoma City
## Real-Time Dashboard

### Overview

This is a comprehensive real-time dashboard for Old St. Joseph Cathedral in Oklahoma City, built using the GenesisTrace library. It monitors and displays live data about all aspects of cathedral life, from Mass attendance to sacramental celebrations to volunteer activities.

### Features

#### 📊 **Real-Time Monitoring**
- **Holy Mass Schedule & Attendance** - Track all daily and Sunday Masses with live attendance counts
- **Livestream Viewership** - Monitor online participation across all liturgies
- **Sacramental Life** - View Baptisms, Confirmations, Marriages, Reconciliation, and more
- **Prayer Intentions** - Track community prayer requests from multiple sources
- **Volunteer Ministries** - Monitor active volunteers and service hours
- **Stewardship & Donations** - Real-time donation tracking with distribution analytics
- **Cathedral Events** - Live updates on parish activities and programs

#### 🎨 **Catholic Liturgical Colors**

The dashboard uses authentic Catholic liturgical colors to create a sacred atmosphere:

- **Purple/Violet** (`#663399`) - Advent, Lent, Penance
- **Gold** (`#FFD700`) - Divine glory, Donations, Celebrations
- **White** (`#FFFFFF`) - Purity, Easter, Christmas
- **Red** (`#DC143C`) - Holy Spirit, Martyrs, Pentecost
- **Green** (`#228B22`) - Ordinary Time, Growth, Hope
- **Blue** (`#4169E1`) - Blessed Virgin Mary, Heaven
- **Rose** (`#FF69B4`) - Gaudete Sunday (Advent 3), Laetare Sunday (Lent 4)

#### 📿 **Papal Wisdom**

The dashboard displays rotating quotes from recent popes, including:

- **Pope Francis** - Current Holy Father
- **Pope Benedict XVI** - Pope Emeritus
- **Pope St. John Paul II** - The Great
- **Pope Paul VI** - Vatican II era

### Catholic Data Tracked

#### Sacraments
- **Baptism** - New life in Christ through the waters of Baptism
- **Confirmation** - Receiving the gifts of the Holy Spirit
- **Holy Eucharist** - First Communion celebrations
- **Reconciliation** - The Sacrament of Confession
- **Matrimony** - Holy unions blessed by God
- **Anointing of the Sick** - Healing and comfort for the ill

#### Prayer Intentions
- **Personal** - Individual spiritual needs
- **Community** - Local church intentions
- **Global** - Worldwide Catholic concerns
- **Deceased** - For the faithful departed
- **Healing** - Physical and spiritual restoration
- **Thanksgiving** - Gratitude for God's blessings

#### Volunteer Service Areas
- **Liturgy** - Eucharistic Ministers, Lectors, Choir, Altar Servers
- **Education** - CCD Teachers, RCIA, Youth Ministry
- **Outreach** - St. Vincent de Paul, Food Pantry, Mission Work
- **Maintenance** - Facilities care and upkeep
- **Administration** - Parish office support

### Running the Dashboard

#### Quick Start

```bash
# Make executable
chmod +x examples/faith/old-st-joseph-cathedral-okc.ts

# Run the dashboard
deno run --allow-env --allow-read --allow-write examples/faith/old-st-joseph-cathedral-okc.ts
```

Or use the shorthand:

```bash
./examples/faith/old-st-joseph-cathedral-okc.ts
```

#### Permissions Required

- `--allow-env` - For reading environment configuration
- `--allow-read` - For reading configuration files
- `--allow-write` - For logging operations

### Dashboard Sections

#### 1. **Header & Metrics Bar**
Displays:
- Current date and time
- Rotating papal quote
- Key metrics: Mass attendance, livestream viewers, active prayer intentions, donations today

#### 2. **Holy Mass Schedule**
Shows all scheduled Masses with:
- Time and Mass type (Daily, Sunday, Vigil, Holy Day)
- Celebrant name
- Language (English, Spanish, Latin)
- Attendance vs. expected attendance
- Livestream viewer count
- Music ministry
- Sacraments being celebrated

#### 3. **Sacramental Life**
Tracks recent and upcoming sacramental celebrations:
- Sacrament type
- Participant name(s)
- Presiding minister
- Date and time
- Status (Scheduled, In Progress, Completed)
- Family member attendance

#### 4. **Prayer Intentions**
Lists active prayer requests:
- Intention type and category
- Submission source (In-Person, Online, Phone, Prayer Box)
- Submission date/time
- Prayer status
- Anonymous flag

#### 5. **Volunteer Ministries**
Displays active volunteers:
- Volunteer name
- Ministry involvement
- Role and service area
- Monthly hours logged
- Current status

#### 6. **Stewardship & Donations**
Monitors parish giving:
- Real-time donation feed
- Donation amounts and types
- Payment methods
- Fund designations
- Visual distribution chart by donation type

#### 7. **Cathedral Events**
Shows current and upcoming activities:
- Event name and type
- Location within cathedral campus
- Start time
- Expected participants
- Coordinator
- Current status

#### 8. **Live Notifications**
Real-time alerts about:
- New sacramental celebrations
- Significant donations
- Prayer intention updates
- Special liturgical moments
- Parish announcements

### Color-Coded Information

The dashboard uses liturgical colors throughout to enhance readability and create a sacred atmosphere:

- **Sacraments** - Purple (sacred mystery)
- **Mass Types** - White (purity of worship)
- **Prayer Intentions** - Blue (heavenly intercession)
- **Donations** - Gold (divine treasure)
- **Volunteers** - Green (growth in service)
- **Events** - Various colors by type
- **Celebrations** - Gold and white (joy)
- **Status Indicators** - Traffic light system (green/gold/red)

### Real-Time Features

The dashboard automatically simulates real-time activity:

- **Every 18 seconds** - Livestream viewer counts update
- **Every 25 seconds** - New prayer intentions may arrive
- **Every 30 seconds** - Donations may be recorded
- **Every 45 seconds** - Sacramental celebrations may be announced
- **Every 8 seconds** - Full dashboard refresh

### Special Catholic Elements

#### Latin Phrases
- **"Ad Maiorem Dei Gloriam"** - For the Greater Glory of God (Jesuit motto)
- **"Ora pro nobis"** - Pray for us (Litany response)

#### Sacred Symbols
- **✟** - Latin Cross (Christian faith)
- **✝** - Orthodox Cross
- **†** - Christian Cross
- **✞** - Cross variant
- **✨** - Divine celebration
- **⚠** - Important notices

#### Liturgical Vocabulary
- Uses authentic Catholic terminology
- References actual parish ministries
- Follows liturgical calendar awareness
- Incorporates sacramental language

### Historical Context

**Old St. Joseph Cathedral** has been the mother church of the Archdiocese of Oklahoma City since 1905. It serves as the spiritual heart for thousands of Catholic families in the Oklahoma City metro area. The cathedral is known for:

- Rich liturgical tradition
- Vibrant multicultural community (English and Spanish Masses)
- Strong emphasis on the sacramental life
- Active volunteer ministries
- Commitment to social justice and charity
- Historic architecture and sacred art

### Technical Details

#### Data Models
- `MassSchedule` - Mass times, celebrants, attendance
- `Sacrament` - Sacramental celebrations and participants
- `PrayerIntention` - Community prayer requests
- `VolunteerActivity` - Ministry service tracking
- `DonationRecord` - Stewardship and giving
- `CathedralEvent` - Parish activities and programs
- `LiveMetrics` - Aggregate statistics
- `Alert` - Real-time notifications

#### Architecture
- Real-time data engine with event simulation
- Observer pattern for live updates
- Automatic dashboard refresh every 8 seconds
- Graceful shutdown handling with blessing message

### Customization

You can customize the dashboard by modifying:

1. **Colors** - Adjust the `CatholicColors` object for different liturgical seasons
2. **Papal Quotes** - Add more quotes to the `papalQuotes` array
3. **Refresh Rate** - Change the `setInterval` timing in the `start()` method
4. **Data Initialization** - Modify the `initializeData()` method for your parish data
5. **Simulation Rates** - Adjust real-time activity intervals

### Integration Notes

This dashboard is designed as a demonstration and simulation. For a production environment, you would:

1. Connect to a real parish management system database
2. Integrate with Mass attendance tracking systems
3. Connect to online donation platforms
4. Link with livestreaming analytics
5. Interface with volunteer scheduling software
6. Connect to prayer request submission forms

### Ministry Applications

This dashboard can be adapted for:

- **Parish Administration** - Monitor daily operations
- **Stewardship Campaigns** - Track giving in real-time
- **Volunteer Coordination** - Manage ministry participation
- **Livestream Operations** - Monitor online engagement
- **Prayer Ministry** - Track and fulfill prayer intentions
- **Sacramental Records** - Document celebrations
- **Event Management** - Coordinate parish activities

### Spiritual Context

> "The Eucharist is the heart of the Church."
> — Pope Benedict XVI

This dashboard reflects the reality that a Catholic parish is far more than an organization—it is a living Body of Christ, engaged in worship, service, and mission. Every metric represents real souls being touched by God's grace:

- Mass attendance = souls fed by the Eucharist
- Prayer intentions = hearts lifted to God
- Volunteers = hands and feet of Christ
- Donations = treasure laid up in heaven
- Sacraments = Christ working through His Church

### Future Enhancements

Potential additions could include:

- Confession times and availability
- Adoration chapel sign-up
- Saint feast day calendar
- Liturgical season indicators
- Scripture readings of the day
- Bishop's messages and homilies
- Photo gallery of recent events
- Multi-language support expansion
- Mobile app integration
- SMS/email alert system

### Support & Contact

For questions about this dashboard:
- See the main GenesisTrace documentation
- Review other examples in the `examples/` directory
- Check the parish website for Old St. Joseph Cathedral OKC

---

## Ad Maiorem Dei Gloriam ✟

*For the Greater Glory of God*

---

**Built with:**
- GenesisTrace - Professional Terminal Logging & Formatting
- Deno Runtime
- Catholic Faith & Tradition
- Love for the Church
