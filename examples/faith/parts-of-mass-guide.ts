#!/usr/bin/env -S deno run --allow-env

/**
 * Visual Guide to the Parts of Catholic Mass
 *
 * This interactive guide demonstrates the structure and flow of the Catholic Mass,
 * with detailed explanations of each part and their spiritual significance.
 */

import { GenesisTrace } from "../../mod.ts";

const trace = new GenesisTrace("Parts of Catholic Mass - Visual Guide");

// Introduction
trace.step("Introduction to the Holy Mass", {
  description: "The Mass is the central act of Catholic worship, divided into four main parts",
  visual: {
    type: "header",
    content: `
╔══════════════════════════════════════════════════════════════╗
║                    THE HOLY MASS                             ║
║                  Structure & Meaning                         ║
╚══════════════════════════════════════════════════════════════╝

The Mass follows a sacred pattern established by Christ at the Last Supper
and refined through 2,000 years of Catholic tradition.

Four Main Parts:
  1. Introductory Rites
  2. Liturgy of the Word
  3. Liturgy of the Eucharist
  4. Concluding Rites
    `
  }
});

// PART 1: INTRODUCTORY RITES
trace.step("Part 1: Introductory Rites", {
  description: "Opening prayers and preparation to celebrate Mass",
  visual: {
    type: "section",
    content: `
╔══════════════════════════════════════════════════════════════╗
║               INTRODUCTORY RITES                             ║
║           Gathering the Community                            ║
╚══════════════════════════════════════════════════════════════╝

Purpose: To help the faithful come together as one and prepare
         to hear God's Word and celebrate the Eucharist
    `
  }
});

trace.step("1a. Entrance Procession & Song", {
  description: "The priest and ministers process to the altar while the congregation sings",
  visual: {
    type: "detail",
    content: `
    🎵 ENTRANCE SONG
    ────────────────────────────────────────
    • Priest and ministers enter in procession
    • Assembly stands and sings
    • Symbolizes our journey toward God
    • Creates unity among the faithful

    As the priest reaches the altar, he venerates it
    with a kiss, honoring it as the center of worship.
    `
  },
  metadata: {
    duration: "2-3 minutes",
    posture: "Standing",
    participation: "Singing"
  }
});

trace.step("1b. Sign of the Cross & Greeting", {
  description: "We begin in the name of the Trinity",
  visual: {
    type: "detail",
    content: `
    ✝️  SIGN OF THE CROSS
    ────────────────────────────────────────
    Priest: "In the name of the Father, and of the Son,
             and of the Holy Spirit."
    People: "Amen."

    Priest: "The Lord be with you."
    People: "And with your spirit."

    Meaning: We acknowledge God's presence and invoke
             the Holy Trinity to begin this sacred action.
    `
  },
  metadata: {
    posture: "Standing",
    response: "Required"
  }
});

trace.step("1c. Penitential Act", {
  description: "Acknowledging our sinfulness and asking for God's mercy",
  visual: {
    type: "detail",
    content: `
    🙏 PENITENTIAL ACT (Confiteor)
    ────────────────────────────────────────
    "I confess to almighty God
    and to you, my brothers and sisters,
    that I have greatly sinned,
    in my thoughts and in my words,
    in what I have done and in what I have failed to do,
    through my fault, through my fault,
    through my most grievous fault;
    therefore I ask blessed Mary ever-Virgin,
    all the Angels and Saints,
    and you, my brothers and sisters,
    to pray for me to the Lord our God."

    Followed by:
    "Lord, have mercy."  / "Kyrie, eleison."
    "Christ, have mercy." / "Christe, eleison."
    "Lord, have mercy."  / "Kyrie, eleison."
    `
  },
  metadata: {
    posture: "Standing",
    purpose: "Purification of heart"
  }
});

trace.step("1d. Gloria", {
  description: "Ancient hymn of praise (omitted during Advent and Lent)",
  visual: {
    type: "detail",
    content: `
    🎶 GLORIA
    ────────────────────────────────────────
    "Glory to God in the highest,
    and on earth peace to people of good will.
    We praise you, we bless you,
    we adore you, we glorify you,
    we give you thanks for your great glory,
    Lord God, heavenly King,
    O God, almighty Father..."

    This ancient hymn dates back to the 2nd century
    and expresses the Church's praise and thanksgiving.
    `
  },
  metadata: {
    posture: "Standing",
    omitted: "Advent, Lent"
  }
});

trace.step("1e. Collect (Opening Prayer)", {
  description: "The priest collects our prayers and offers them to God",
  visual: {
    type: "detail",
    content: `
    📿 COLLECT
    ────────────────────────────────────────
    Priest: "Let us pray..."
    [Brief silence for personal prayer]

    The priest then prays the Collect, which varies
    according to the feast or season.

    People: "Amen."

    This prayer "collects" the intentions of all present
    and concludes the Introductory Rites.
    `
  },
  metadata: {
    posture: "Standing",
    silence: "Brief pause for prayer"
  }
});

// PART 2: LITURGY OF THE WORD
trace.step("Part 2: Liturgy of the Word", {
  description: "God speaks to His people through Scripture",
  visual: {
    type: "section",
    content: `
╔══════════════════════════════════════════════════════════════╗
║              LITURGY OF THE WORD                             ║
║            God Speaks to His People                          ║
╚══════════════════════════════════════════════════════════════╝

Purpose: To nourish us with God's Word from Sacred Scripture
         "Man shall not live by bread alone, but by every word
         that comes from the mouth of God" (Matthew 4:4)
    `
  }
});

trace.step("2a. First Reading", {
  description: "Usually from the Old Testament (or Acts during Easter)",
  visual: {
    type: "detail",
    content: `
    📖 FIRST READING
    ────────────────────────────────────────
    Reader: "A reading from the Book of [...]"

    [The reading is proclaimed]

    Reader: "The word of the Lord."
    People: "Thanks be to God."

    • Usually from Old Testament prophets or history
    • During Easter season: from Acts of the Apostles
    • Chosen to complement the Gospel reading
    `
  },
  metadata: {
    posture: "Seated",
    attention: "Active listening"
  }
});

trace.step("2b. Responsorial Psalm", {
  description: "Sung or recited response to the First Reading",
  visual: {
    type: "detail",
    content: `
    🎵 RESPONSORIAL PSALM
    ────────────────────────────────────────
    Cantor/Reader: [Sings/reads psalm verse]
    People: [Sing/respond with refrain]

    Example:
    Cantor: "The Lord is my shepherd; there is nothing I shall want."
    People: "The Lord is my shepherd; there is nothing I shall want."

    The psalm is our prayerful response to God's Word,
    using the same prayers Jesus himself prayed.
    `
  },
  metadata: {
    posture: "Seated",
    participation: "Singing/responding"
  }
});

trace.step("2c. Second Reading", {
  description: "From the New Testament letters or Revelation",
  visual: {
    type: "detail",
    content: `
    📖 SECOND READING
    ────────────────────────────────────────
    Reader: "A reading from the Letter of Saint Paul to [...]"
            or "A reading from the Book of Revelation"

    [The reading is proclaimed]

    Reader: "The word of the Lord."
    People: "Thanks be to God."

    • From the Epistles or Book of Revelation
    • Contains apostolic teaching and wisdom
    • Omitted on weekdays (only Sundays & Solemnities)
    `
  },
  metadata: {
    posture: "Seated",
    frequency: "Sundays and Solemnities only"
  }
});

trace.step("2d. Gospel Acclamation", {
  description: "Standing to welcome Christ in the Gospel",
  visual: {
    type: "detail",
    content: `
    🎺 GOSPEL ACCLAMATION
    ────────────────────────────────────────
    [Assembly stands]

    People: "Alleluia, alleluia, alleluia!"
            (or during Lent: another acclamation)

    Cantor: [Verse from Scripture]
    People: "Alleluia, alleluia, alleluia!"

    We stand out of respect, as Christ himself
    is about to speak to us through the Gospel.
    The priest/deacon may incense the Gospel Book.
    `
  },
  metadata: {
    posture: "Standing",
    significance: "Christ is present in the Gospel"
  }
});

trace.step("2e. Gospel Reading", {
  description: "The words and deeds of Jesus Christ",
  visual: {
    type: "detail",
    content: `
    ✨ GOSPEL READING
    ────────────────────────────────────────
    Priest/Deacon: "The Lord be with you."
    People: "And with your spirit."

    Priest/Deacon: "A reading from the holy Gospel according to [...]"
    People: "Glory to you, O Lord."
    [Making small sign of cross on forehead, lips, and heart]

    [The Gospel is proclaimed]

    Priest/Deacon: "The Gospel of the Lord."
    People: "Praise to you, Lord Jesus Christ."

    The Gospel is the high point of the Liturgy of the Word.
    `
  },
  metadata: {
    posture: "Standing",
    gesture: "Sign of cross on forehead, lips, heart"
  }
});

trace.step("2f. Homily", {
  description: "The priest or deacon explains and applies God's Word",
  visual: {
    type: "detail",
    content: `
    💭 HOMILY
    ────────────────────────────────────────
    The priest or deacon:
    • Explains the Scripture readings
    • Connects them to our daily lives
    • Offers spiritual guidance and exhortation
    • Helps us understand how to live the Gospel

    Duration: Typically 8-15 minutes

    Followed by a brief period of silence for reflection.
    `
  },
  metadata: {
    posture: "Seated",
    required: "Sundays and Holy Days"
  }
});

trace.step("2g. Profession of Faith (Creed)", {
  description: "We profess what we believe (Sundays and Solemnities)",
  visual: {
    type: "detail",
    content: `
    📜 NICENE CREED
    ────────────────────────────────────────
    "I believe in one God,
    the Father almighty,
    maker of heaven and earth,
    of all things visible and invisible.

    I believe in one Lord Jesus Christ,
    the Only Begotten Son of God,
    born of the Father before all ages..."

    [Continue with full Creed]

    At the words "and by the Holy Spirit was incarnate
    of the Virgin Mary, and became man" — we bow.

    Alternative: Apostles' Creed (especially with children)
    `
  },
  metadata: {
    posture: "Standing",
    gesture: "Bow at the Incarnation"
  }
});

trace.step("2h. Universal Prayer (Prayer of the Faithful)", {
  description: "We pray for the needs of the Church and the world",
  visual: {
    type: "detail",
    content: `
    🌍 PRAYER OF THE FAITHFUL
    ────────────────────────────────────────
    Priest: "Let us pray for the needs of the Church
             and the world..."

    Reader: "For the Church... let us pray to the Lord."
    People: "Lord, hear our prayer."

    Reader: "For our civil leaders... let us pray to the Lord."
    People: "Lord, hear our prayer."

    [Additional petitions for various needs]

    Priest: [Concluding prayer]
    People: "Amen."

    We exercise our baptismal priesthood by interceding
    for the whole world.
    `
  },
  metadata: {
    posture: "Standing",
    participation: "Response to each petition"
  }
});

// PART 3: LITURGY OF THE EUCHARIST
trace.step("Part 3: Liturgy of the Eucharist", {
  description: "The source and summit of Christian life",
  visual: {
    type: "section",
    content: `
╔══════════════════════════════════════════════════════════════╗
║           LITURGY OF THE EUCHARIST                           ║
║     The Sacrifice of Christ Made Present                     ║
╚══════════════════════════════════════════════════════════════╝

Purpose: To make present Christ's sacrifice on Calvary and
         to receive Him in Holy Communion

"Do this in memory of me." — Jesus at the Last Supper
    `
  }
});

trace.step("3a. Preparation of the Gifts", {
  description: "Bread, wine, and our offerings are brought to the altar",
  visual: {
    type: "detail",
    content: `
    🍞🍷 PREPARATION OF THE GIFTS
    ────────────────────────────────────────
    • Gifts of bread and wine are brought forward
    • Collection is taken up for the poor and the Church
    • Altar is prepared by the priest and servers

    Priest: "Blessed are you, Lord God of all creation,
             for through your goodness we have received
             the bread we offer you:
             fruit of the earth and work of human hands,
             it will become for us the bread of life."

    People: "Blessed be God for ever."

    [Similar prayer over the wine]

    The priest may incense the gifts and the altar.
    `
  },
  metadata: {
    posture: "Seated, then standing",
    symbolism: "Offering our lives to God"
  }
});

trace.step("3b. Invitation to Prayer", {
  description: "The priest invites us to pray together",
  visual: {
    type: "detail",
    content: `
    🙏 INVITATION TO PRAYER
    ────────────────────────────────────────
    [Assembly stands]

    Priest: "Pray, brothers and sisters,
             that my sacrifice and yours
             may be acceptable to God,
             the almighty Father."

    People: "May the Lord accept the sacrifice at your hands
             for the praise and glory of his name,
             for our good and the good of all his holy Church."

    This expresses our participation in the priest's sacrifice.
    `
  },
  metadata: {
    posture: "Standing",
    unity: "We offer sacrifice together"
  }
});

trace.step("3c. Prayer over the Offerings", {
  description: "The priest prays over the gifts",
  visual: {
    type: "detail",
    content: `
    📿 PRAYER OVER THE OFFERINGS
    ────────────────────────────────────────
    The priest prays a prayer specific to the day,
    asking God to accept these gifts.

    People: "Amen."

    This concludes the Preparation of the Gifts and
    leads us into the Eucharistic Prayer.
    `
  },
  metadata: {
    posture: "Standing"
  }
});

trace.step("3d. Eucharistic Prayer - Preface Dialogue", {
  description: "Beginning the great prayer of thanksgiving",
  visual: {
    type: "detail",
    content: `
    ✨ PREFACE DIALOGUE
    ────────────────────────────────────────
    Priest: "The Lord be with you."
    People: "And with your spirit."

    Priest: "Lift up your hearts."
    People: "We lift them up to the Lord."

    Priest: "Let us give thanks to the Lord our God."
    People: "It is right and just."

    This ancient dialogue (dating to the 3rd century)
    prepares us for the most sacred part of the Mass.
    `
  },
  metadata: {
    posture: "Standing",
    importance: "Beginning of the Eucharistic Prayer"
  }
});

trace.step("3e. Holy, Holy, Holy (Sanctus)", {
  description: "We join the angels in praising God",
  visual: {
    type: "detail",
    content: `
    👼 SANCTUS
    ────────────────────────────────────────
    "Holy, Holy, Holy Lord God of hosts.
    Heaven and earth are full of your glory.
    Hosanna in the highest.
    Blessed is he who comes in the name of the Lord.
    Hosanna in the highest."

    From Isaiah 6:3 and Matthew 21:9
    We join the angels and saints in praising God.

    [Some people kneel after the Sanctus]
    `
  },
  metadata: {
    posture: "Standing, then kneeling",
    biblical: "Isaiah 6:3, Matthew 21:9"
  }
});

trace.step("3f. Consecration", {
  description: "The most sacred moment: bread and wine become Christ's Body and Blood",
  visual: {
    type: "detail",
    content: `
    ⛪ CONSECRATION
    ────────────────────────────────────────
    [The priest, acting in the person of Christ, prays:]

    Over the bread:
    "TAKE THIS, ALL OF YOU, AND EAT OF IT,
    FOR THIS IS MY BODY,
    WHICH WILL BE GIVEN UP FOR YOU."

    [The priest genuflects. The host is elevated.]

    Over the wine:
    "TAKE THIS, ALL OF YOU, AND DRINK FROM IT,
    FOR THIS IS THE CHALICE OF MY BLOOD,
    THE BLOOD OF THE NEW AND ETERNAL COVENANT,
    WHICH WILL BE POURED OUT FOR YOU AND FOR MANY
    FOR THE FORGIVENESS OF SINS.
    DO THIS IN MEMORY OF ME."

    [The priest genuflects. The chalice is elevated.]

    By the power of the Holy Spirit, the bread and wine
    become the Body and Blood of Christ.
    `
  },
  metadata: {
    posture: "Kneeling",
    significance: "Transubstantiation occurs",
    gesture: "Look upon the Host and Chalice"
  }
});

trace.step("3g. Mystery of Faith", {
  description: "Proclaiming Christ's death and resurrection",
  visual: {
    type: "detail",
    content: `
    ✝️ MYSTERY OF FAITH
    ────────────────────────────────────────
    Priest: "The mystery of faith."

    People (one of several acclamations):

    "We proclaim your Death, O Lord,
    and profess your Resurrection
    until you come again."

    OR

    "When we eat this Bread and drink this Cup,
    we proclaim your Death, O Lord,
    until you come again."

    This acclamation expresses our faith in Christ's
    Paschal Mystery: His Death, Resurrection, and
    promised return in glory.
    `
  },
  metadata: {
    posture: "Kneeling",
    proclamation: "Our faith response"
  }
});

trace.step("3h. Remainder of Eucharistic Prayer", {
  description: "Prayers of offering and intercession",
  visual: {
    type: "detail",
    content: `
    📿 EUCHARISTIC PRAYER CONTINUES
    ────────────────────────────────────────
    The priest continues praying:

    • Offering the sacrifice to the Father
    • Invoking the Holy Spirit
    • Interceding for the Church, Pope, and bishops
    • Remembering the saints
    • Praying for the living and the dead

    Concluding with the Great Doxology:

    Priest: "Through him, and with him, and in him,
             O God, almighty Father,
             in the unity of the Holy Spirit,
             all glory and honor is yours,
             for ever and ever."

    People: "Amen!" (The Great Amen)
    `
  },
  metadata: {
    posture: "Kneeling, standing for Great Amen",
    climax: "The Great Amen"
  }
});

trace.step("3i. The Lord's Prayer", {
  description: "We pray as Jesus taught us",
  visual: {
    type: "detail",
    content: `
    🙏 THE LORD'S PRAYER
    ────────────────────────────────────────
    [Assembly stands]

    Priest: "At the Savior's command and formed by divine teaching,
             we dare to say:"

    All: "Our Father, who art in heaven,
          hallowed be thy name;
          thy kingdom come,
          thy will be done
          on earth as it is in heaven.
          Give us this day our daily bread,
          and forgive us our trespasses,
          as we forgive those who trespass against us;
          and lead us not into temptation,
          but deliver us from evil."

    Priest: "Deliver us, Lord, we pray, from every evil..."
    People: "For the kingdom, the power and the glory are yours
             now and for ever."
    `
  },
  metadata: {
    posture: "Standing",
    taught: "By Jesus himself (Matthew 6:9-13)"
  }
});

trace.step("3j. Sign of Peace", {
  description: "Exchanging peace before receiving Communion",
  visual: {
    type: "detail",
    content: `
    ✌️ SIGN OF PEACE
    ────────────────────────────────────────
    Priest: "Lord Jesus Christ... grant us peace."
    People: "Amen."

    Priest: "The peace of the Lord be with you always."
    People: "And with your spirit."

    Priest/Deacon: "Let us offer each other the sign of peace."

    [People exchange a sign of peace with those nearby]
    "Peace be with you."

    This expresses our communion with one another
    before receiving the Eucharist.
    `
  },
  metadata: {
    posture: "Standing",
    gesture: "Handshake, embrace, or bow"
  }
});

trace.step("3k. Lamb of God (Agnus Dei)", {
  description: "Invoking Christ as we prepare for Communion",
  visual: {
    type: "detail",
    content: `
    🐑 AGNUS DEI
    ────────────────────────────────────────
    [The priest breaks the consecrated Host]

    People: "Lamb of God, you take away the sins of the world,
             have mercy on us.
             Lamb of God, you take away the sins of the world,
             have mercy on us.
             Lamb of God, you take away the sins of the world,
             grant us peace."

    From John 1:29 - John the Baptist's words when
    he saw Jesus: "Behold, the Lamb of God, who takes
    away the sin of the world!"

    [People kneel if not already kneeling]
    `
  },
  metadata: {
    posture: "Kneeling",
    biblical: "John 1:29",
    action: "Breaking of the Host"
  }
});

trace.step("3l. Communion Rite - Invitation", {
  description: "The priest invites us to receive the Lord",
  visual: {
    type: "detail",
    content: `
    ✨ BEHOLD THE LAMB OF GOD
    ────────────────────────────────────────
    [The priest elevates the Host]

    Priest: "Behold the Lamb of God,
             behold him who takes away the sins of the world.
             Blessed are those called to the supper of the Lamb."

    People: "Lord, I am not worthy
             that you should enter under my roof,
             but only say the word
             and my soul shall be healed."

    (From the Roman centurion in Matthew 8:8)

    We express our unworthiness and faith in Christ's
    healing power.
    `
  },
  metadata: {
    posture: "Kneeling",
    biblical: "Matthew 8:8",
    preparation: "Act of humility"
  }
});

trace.step("3m. Holy Communion", {
  description: "Receiving the Body and Blood of Christ",
  visual: {
    type: "detail",
    content: `
    🕊️ HOLY COMMUNION
    ────────────────────────────────────────
    [People process to receive Communion]

    Minister: "The Body of Christ."
    Communicant: "Amen." [Receives on tongue or in hand]

    Minister: "The Blood of Christ."
    Communicant: "Amen." [Drinks from the chalice]

    Requirements to receive:
    • Baptized Catholic
    • State of grace (no mortal sin)
    • Fasted from food/drink for 1 hour
    • Believe in Christ's Real Presence

    After receiving, return to your place and pray
    in thanksgiving for this supreme gift.

    Communion Song is sung during distribution.
    `
  },
  metadata: {
    posture: "Standing in procession, kneeling/seated after",
    disposition: "State of grace required",
    reverence: "Highest reverence"
  }
});

trace.step("3n. Prayer After Communion", {
  description: "Giving thanks after receiving the Lord",
  visual: {
    type: "detail",
    content: `
    🙏 PRAYER AFTER COMMUNION
    ────────────────────────────────────────
    [Period of sacred silence or singing]

    [Assembly stands]

    Priest: "Let us pray..."
    [Priest prays a prayer specific to the day]

    People: "Amen."

    We give thanks for the gift of Christ we have received
    and ask for the grace to live out this communion.
    `
  },
  metadata: {
    posture: "Standing",
    silence: "Time for thanksgiving"
  }
});

// PART 4: CONCLUDING RITES
trace.step("Part 4: Concluding Rites", {
  description: "Being sent forth to live the Mass",
  visual: {
    type: "section",
    content: `
╔══════════════════════════════════════════════════════════════╗
║              CONCLUDING RITES                                ║
║         Go Forth to Love and Serve                           ║
╚══════════════════════════════════════════════════════════════╝

Purpose: To send us forth to bring Christ to the world

"Mass" comes from "Missa" - the Latin dismissal,
meaning "sent forth"
    `
  }
});

trace.step("4a. Announcements", {
  description: "Brief parish announcements (if needed)",
  visual: {
    type: "detail",
    content: `
    📢 ANNOUNCEMENTS
    ────────────────────────────────────────
    Brief announcements about parish life may be made:
    • Upcoming events
    • Important notices
    • Community needs

    These are kept brief and directly related to
    the parish community.
    `
  },
  metadata: {
    posture: "Standing",
    optional: "As needed"
  }
});

trace.step("4b. Greeting and Blessing", {
  description: "Final blessing from the priest",
  visual: {
    type: "detail",
    content: `
    ✋ FINAL BLESSING
    ────────────────────────────────────────
    Priest: "The Lord be with you."
    People: "And with your spirit."

    Priest: "May almighty God bless you,
             the Father, and the Son, ✝ and the Holy Spirit."
    People: "Amen."

    [Making the sign of the cross]

    On special occasions, a solemn blessing with three
    invocations may be used, each with "Amen" response.
    `
  },
  metadata: {
    posture: "Standing",
    gesture: "Sign of the cross"
  }
});

trace.step("4c. Dismissal", {
  description: "Sent forth to bring Christ to the world",
  visual: {
    type: "detail",
    content: `
    🚶 DISMISSAL
    ────────────────────────────────────────
    Priest/Deacon (one of these):

    "Go forth, the Mass is ended."
    "Go and announce the Gospel of the Lord."
    "Go in peace, glorifying the Lord by your life."
    "Go in peace."

    People: "Thanks be to God."

    [Closing hymn as priest and ministers process out]

    We are sent forth to live what we have celebrated:
    to be Christ's presence in the world, to love and
    serve others, and to proclaim the Gospel by our lives.

    The Mass is ended, but our mission begins!
    `
  },
  metadata: {
    posture: "Standing",
    participation: "Singing closing hymn",
    mission: "Living the Mass in daily life"
  }
});

// Summary and Conclusion
trace.step("Summary: The Flow of the Mass", {
  description: "Understanding the unity of the celebration",
  visual: {
    type: "summary",
    content: `
╔══════════════════════════════════════════════════════════════╗
║              THE MASS AS ONE SACRIFICE                       ║
╚══════════════════════════════════════════════════════════════╝

The Mass is not four separate parts, but one unified act
of worship that follows the pattern of:

1️⃣  GATHERING: We come together as God's people
              (Introductory Rites)

2️⃣  LISTENING: God speaks to us through Scripture
              (Liturgy of the Word)

3️⃣  OFFERING & RECEIVING: We offer ourselves with Christ
                         and receive Him in return
                         (Liturgy of the Eucharist)

4️⃣  SENDING: We go forth to live what we've celebrated
            (Concluding Rites)

This pattern echoes:
• The Last Supper
• The Road to Emmaus (Luke 24)
• The rhythm of Christian life: gather, listen, receive, serve

╔══════════════════════════════════════════════════════════════╗
║  "The Eucharist is the source and summit of the             ║
║   Christian life." - Vatican II, Lumen Gentium 11           ║
╚══════════════════════════════════════════════════════════════╝
    `
  }
});

trace.step("Deeper Understanding", {
  description: "Key principles to remember",
  visual: {
    type: "teaching",
    content: `
╔══════════════════════════════════════════════════════════════╗
║              KEY PRINCIPLES                                  ║
╚══════════════════════════════════════════════════════════════╝

🎯 ACTIVE PARTICIPATION
   Not passive attendance - we are participants in Christ's
   sacrifice, not spectators. Our "Amen" and responses matter.

⛪ REAL PRESENCE
   Christ is truly present - Body, Blood, Soul, and Divinity -
   in the consecrated bread and wine. This is not a symbol.

✝️  ONE SACRIFICE
   The Mass is not a re-crucifixion, but makes present the
   one sacrifice of Calvary in an unbloody manner.

👥 COMMUNAL WORSHIP
   While personal prayer is important, the Mass is the prayer
   of the whole Church, joining earth and heaven.

🕊️ SPIRIT-FILLED
   The Holy Spirit transforms the gifts and transforms us,
   making us more like Christ.

📖 WORD AND SACRAMENT
   Both the Liturgy of the Word and Liturgy of the Eucharist
   are essential - Christ comes to us in both Word and Sacrament.

🚶 MISSION
   The Mass sends us forth - we are to bring Christ's love
   to the world in our daily lives.
    `
  }
});

trace.step("Tips for Fruitful Participation", {
  description: "How to enter more deeply into the Mass",
  visual: {
    type: "practical",
    content: `
╔══════════════════════════════════════════════════════════════╗
║         LIVING THE MASS MORE FULLY                           ║
╚══════════════════════════════════════════════════════════════╝

BEFORE MASS:
  ✓ Arrive early for quiet prayer
  ✓ Review the Scripture readings beforehand
  ✓ Prepare your heart through Confession (if needed)
  ✓ Fast for one hour before Communion

DURING MASS:
  ✓ Silence your phone completely
  ✓ Sing the hymns and responses
  ✓ Listen attentively to the readings
  ✓ Pray the prayers with intention, not routine
  ✓ Make eye contact with the Host when receiving
  ✓ Stay for the entire Mass (don't leave early)

AFTER MASS:
  ✓ Spend a few minutes in thanksgiving
  ✓ Reflect on one thing from the homily or readings
  ✓ Live out what you've received
  ✓ Bring Christ's love to others

ONGOING:
  ✓ Study the Mass to understand it more deeply
  ✓ Read the lives of saints who loved the Eucharist
  ✓ Make a Holy Hour before the Blessed Sacrament
  ✓ Attend daily Mass when possible
    `
  }
});

// Final blessing
trace.step("Conclusion", {
  description: "May this guide deepen your love for the Mass",
  visual: {
    type: "closing",
    content: `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           "Do this in memory of me."                         ║
║                    - Jesus Christ                            ║
║                                                              ║
║  May your participation in the Holy Mass transform your     ║
║  life and draw you ever closer to Our Lord.                 ║
║                                                              ║
║  The Mass is the greatest prayer on earth - heaven and      ║
║  earth united in worship of the Triune God.                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

    For further study:
    • Catechism of the Catholic Church (CCC 1322-1419)
    • Pope Benedict XVI: "The Spirit of the Liturgy"
    • Scott Hahn: "The Lamb's Supper"
    • "General Instruction of the Roman Missal" (GIRM)

    May the Lord bless you and keep you. ✝️
    `
  }
});

// Export the trace
trace.export("parts-of-mass-guide-output.json");
console.log("\n✅ Mass guide complete! Check parts-of-mass-guide-output.json for the structured output.");
