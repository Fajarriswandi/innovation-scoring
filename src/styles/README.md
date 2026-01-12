# Global Styles Documentation

File `globalStyles.ts` berisi semua style constants dan utilities untuk menjaga konsistensi UI di seluruh aplikasi.

## Import

```typescript
import { Colors, Spacing, Typography, BorderRadius, Shadows, GlobalStyles } from '@/styles/globalStyles';
```

## Penggunaan

### 1. Colors

```typescript
import { Colors } from '@/styles/globalStyles';

// Menggunakan langsung di style
<div style={{ color: Colors.textPrimary, backgroundColor: Colors.background }}>
  Content
</div>

// Atau dengan Ant Design
<Button style={{ backgroundColor: Colors.primary, color: Colors.textWhite }}>
  Click me
</Button>
```

### 2. Spacing

```typescript
import { Spacing } from '@/styles/globalStyles';

<div style={{ padding: Spacing.lg, margin: Spacing.md }}>
  Content
</div>
```

### 3. Typography

```typescript
import { Typography } from '@/styles/globalStyles';

<h1 style={{ 
  fontSize: Typography.xxl, 
  fontWeight: Typography.bold,
  fontFamily: Typography.fontFamily 
}}>
  Title
</h1>
```

### 4. Border Radius

```typescript
import { BorderRadius } from '@/styles/globalStyles';

<div style={{ borderRadius: BorderRadius.lg }}>
  Content
</div>
```

### 5. Shadows

```typescript
import { Shadows } from '@/styles/globalStyles';

<div style={{ boxShadow: Shadows.md }}>
  Card
</div>
```

### 6. Global Styles (Predefined Styles)

```typescript
import { GlobalStyles } from '@/styles/globalStyles';

// Card
<div style={GlobalStyles.card}>
  Card content
</div>

// Text
<p style={GlobalStyles.textPrimary}>Primary text</p>
<p style={GlobalStyles.textSecondary}>Secondary text</p>
<p style={GlobalStyles.textMuted}>Muted text</p>

// Button
<button style={GlobalStyles.buttonPrimary}>Primary Button</button>
<button style={GlobalStyles.buttonSecondary}>Secondary Button</button>

// Heading
<h1 style={GlobalStyles.heading1}>Heading 1</h1>
<h2 style={GlobalStyles.heading2}>Heading 2</h2>
<h3 style={GlobalStyles.heading3}>Heading 3</h3>
<h4 style={GlobalStyles.heading4}>Heading 4</h4>
```

### 7. Helper Functions

```typescript
import { 
  combineStyles, 
  getChannelTagStyle, 
  getRequestTagStyle,
  getChannelColor,
  getRequestColor 
} from '@/styles/globalStyles';

// Menggabungkan styles
<div style={combineStyles(GlobalStyles.card, { padding: Spacing.xl })}>
  Content
</div>

// Tag style untuk channel
<Tag style={getChannelTagStyle('Live Chat')}>
  Live Chat
</Tag>

// Tag style untuk request type
<Tag style={getRequestTagStyle('STT')}>
  STT
</Tag>

// Warna untuk channel
<Tag color={getChannelColor('Voice')}>
  Voice
</Tag>

// Warna untuk request type
<Tag color={getRequestColor('LLM')}>
  LLM
</Tag>
```

## Contoh Lengkap

### Contoh 1: Card dengan Button

```typescript
import { GlobalStyles, Spacing, Colors } from '@/styles/globalStyles';

<div style={GlobalStyles.card}>
  <h3 style={GlobalStyles.heading3}>Card Title</h3>
  <p style={GlobalStyles.textSecondary}>
    Card description
  </p>
  <button style={GlobalStyles.buttonPrimary}>
    Submit
  </button>
</div>
```

### Contoh 2: Table Row

```typescript
import { GlobalStyles, Colors } from '@/styles/globalStyles';

<tr style={GlobalStyles.tableRowEven}>
  <td style={GlobalStyles.tableHeader}>Header</td>
  <td style={GlobalStyles.textPrimary}>Content</td>
</tr>
```

### Contoh 3: Tag dengan Helper Function

```typescript
import { getChannelTagStyle, getRequestTagStyle } from '@/styles/globalStyles';

// Channel tag
<Tag style={getChannelTagStyle('Live Chat')}>
  <MessageOutlined /> Live Chat
</Tag>

// Request type tag
<Tag style={getRequestTagStyle('STT')}>
  STT
</Tag>
```

### Contoh 4: Input dengan Focus State

```typescript
import { GlobalStyles } from '@/styles/globalStyles';
import { useState } from 'react';

const [focused, setFocused] = useState(false);

<Input
  style={combineStyles(
    GlobalStyles.input,
    focused && GlobalStyles.inputFocused
  )}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
/>
```

## Daftar Lengkap Constants

### Colors
- `primary`, `primaryDark`, `primaryLight`, `primaryHover`
- `secondary`, `secondaryDark`, `secondaryLight`
- `textPrimary`, `textSecondary`, `textMuted`, `textDisabled`, `textWhite`
- `background`, `backgroundLight`, `backgroundGray`, `backgroundHover`
- `border`, `borderLight`, `borderDark`
- `success`, `successLight`, `warning`, `warningLight`, `error`, `errorLight`, `info`, `infoLight`
- `channelLiveChat`, `channelVoice`, `channelVideo`, `channelEmail`
- `requestSTT`, `requestLLM`, `requestTTS`

### Spacing
- `xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`, `xxl: 48`, `xxxl: 64`

### Typography
- Font sizes: `xs: 10`, `sm: 12`, `base: 14`, `md: 16`, `lg: 18`, `xl: 20`, `xxl: 24`, `xxxl: 28`, `huge: 32`, `massive: 48`
- Font weights: `regular: 400`, `medium: 500`, `semibold: 600`, `bold: 700`, `extrabold: 800`
- Line heights: `lineHeightTight: 1.2`, `lineHeightNormal: 1.5`, `lineHeightRelaxed: 1.75`
- Font family: `fontFamily: "'Inter', sans-serif"`

### BorderRadius
- `none: 0`, `sm: 4`, `md: 8`, `lg: 12`, `xl: 16`, `xxl: 20`, `round: 30`, `full: 9999`

### Shadows
- `sm`, `md`, `lg`, `xl`, `primary`

### Transitions
- `fast: '0.15s ease'`, `base: '0.2s ease'`, `slow: '0.3s ease'`

## Best Practices

1. **Selalu gunakan constants** dari `globalStyles.ts` untuk colors, spacing, typography
2. **Gunakan GlobalStyles** untuk style yang sudah predefined
3. **Gunakan helper functions** untuk style yang dinamis (tag, channel, dll)
4. **Kombinasikan styles** dengan `combineStyles()` jika perlu
5. **Konsisten** - Gunakan style yang sama untuk elemen yang sama di seluruh aplikasi

## Catatan

- Semua style sudah type-safe dengan TypeScript
- Style bisa dikombinasikan dengan inline styles Ant Design
- Untuk dark mode, gunakan `DarkColors` yang sudah tersedia
- Helper functions memudahkan penggunaan style yang dinamis
