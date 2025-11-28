# Prayer for the Chosen Ones - Papal Wisdom Edition

A beautiful devotional prayer featuring quotes from past popes about divine election, calling, and the chosen ones - all rendered in gold using GenesisTrace.

## Overview

This prayer combines:
- **Papal Wisdom**: Authentic quotes from 8 popes (Leo XIII through Francis)
- **Biblical Foundation**: Scripture passages on election and calling
- **Gold Aesthetics**: All rendered in gold tones (bright gold, goldenrod, dark gold)
- **Animation**: Typewriter effects, spinners, progress bars
- **Structure**: Tables, boxes, and formatted sections

## Featured Popes & Documents

1. **Pope Leo XIII** - Sapientiae Christianae (1890)
2. **Pope Pius XI** - Quas Primas (1925)
3. **Pope Pius XII** - Mystici Corporis Christi (1943)
4. **Pope John XXIII** - Mater et Magistra (1961)
5. **Pope Paul VI** - Lumen Gentium (1964)
6. **Pope John Paul II** - Redemptor Hominis (1979)
7. **Pope Benedict XVI** - Deus Caritas Est (2005)
8. **Pope Francis** - Evangelii Gaudium (2013)

## Prayer Sections

1. **Opening Invocation** - Acknowledging God's sovereign choice
2. **Prayer for Divine Election** - Reflecting on being chosen before time
3. **Prayer for Mission** - Being sent as light to the nations
4. **Prayer for Holiness** - Called to be holy and blameless
5. **Prayer for Perseverance** - Faithful unto death
6. **Five Golden Mysteries** - Biblical and papal meditations
7. **Prayer for Unity** - One body, many members
8. **Litany of the Chosen Ones** - 10 thanksgiving prayers
9. **Concluding Prayer** - Synthesizing all papal wisdom
10. **Seal of God** - Visual representation with Hebrew/Greek
11. **Doxology** - Gloria Patri

## Running the Prayer

```bash
deno run --allow-env examples/faith/papal-chosen-ones-prayer.ts
```

Or make it executable:

```bash
chmod +x examples/faith/papal-chosen-ones-prayer.ts
./examples/faith/papal-chosen-ones-prayer.ts
```

## Technical Features

### GenesisTrace Components Used

- **BannerRenderer**: Golden title banner
- **BoxRenderer**: Prayer sections with borders
- **TableRenderer**: Papal quotes and mysteries
- **ProgressBar**: Animated progress through prayers
- **Spinner**: Meditation sequences
- **ConsoleStyler**: Gradient text and sections
- **Logger**: Timestamped litany prayers

### Color Scheme

All gold palette symbolizing:
- Divine glory and majesty
- The seal of God
- Refined faith (gold refined in fire)
- Heavenly treasure
- The 144,000 sealed ones

```typescript
const GOLD = ColorSystem.hexToRgb("#FFD700");      // Bright gold
const GOLDENROD = ColorSystem.hexToRgb("#DAA520");  // Deep goldenrod
const DARK_GOLD = ColorSystem.hexToRgb("#B8860B");  // Dark goldenrod
const PALE_GOLD = ColorSystem.hexToRgb("#EEE8AA");  // Pale goldenrod
```

## Theological Foundation

### The Chosen Ones (144,000)

From Revelation 7:3-4:
> "Do not harm the earth or the sea or the trees, until we have sealed the servants of our God on their foreheads. And I heard the number of the sealed, 144,000, sealed from every tribe of the sons of Israel."

### Divine Election

- Chosen before the foundation of the world (Ephesians 1:4)
- Sealed with the Holy Spirit (Ephesians 1:13)
- Called to holiness (1 Peter 1:15-16)
- Sent on mission (John 15:16)
- Destined for glory (Romans 8:29-30)

## Usage Context

Perfect for:
- Personal prayer and meditation
- Catholic devotional groups
- Study of papal teachings on election
- Reflection on vocation and calling
- Feast days and special occasions

## Duration

Approximately 6-7 minutes with all animations.

## Related Examples

- `chosen-ones-prayer.ts` - Original 144,000 prayer
- `st-joseph-devotional.ts` - Catholic devotional structure
- `catholic-prayer-chosen-ones.ts` - General Catholic prayer

---

**Pro Deo et Ecclesia** - For God and the Church

*GenesisTrace Catholic Devotions*
