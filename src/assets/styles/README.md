# Global Styles Documentation

File ini berisi dokumentasi untuk sistem styling global yang digunakan di seluruh aplikasi untuk menjaga konsistensi.

## Struktur File

```
src/assets/styles/
├── _variables.scss      # Variables (colors, spacing, dll)
├── _mixins.scss         # Mixins yang bisa digunakan
├── _global-styles.scss  # Global styles & utilities (BARU)
└── global.scss          # File utama yang di-import
```

## Cara Penggunaan

### 1. CSS Variables

Gunakan CSS variables untuk colors, spacing, dan lainnya:

```tsx
<div style={{ 
  color: 'var(--color-text-primary)',
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--radius-md)'
}}>
  Content
</div>
```

### 2. Utility Classes

Gunakan utility classes yang sudah tersedia:

```tsx
// Typography
<div className="text-primary font-semibold text-lg">
  Title
</div>

// Spacing
<div className="p-md m-lg">
  Content
</div>

// Colors
<span className="text-success">Success message</span>
```

### 3. Component Classes

Gunakan component classes untuk styling komponen:

```tsx
// Table
<tr className="table-row-even">...</tr>

// Card
<div className="card-base">...</div>
<div className="card-hover">...</div>

// Button
<button className="btn-primary">Click me</button>

// Tag/Badge
<span className="tag-channel-live-chat">Live Chat</span>
<span className="tag-request-stt">STT</span>
```

## Daftar Utility Classes

### Typography

- `.text-primary`, `.text-secondary`, `.text-muted`, `.text-disabled`
- `.text-success`, `.text-warning`, `.text-error`, `.text-info`
- `.text-xs`, `.text-sm`, `.text-base`, `.text-md`, `.text-lg`, `.text-xl`, `.text-2xl`, `.text-3xl`
- `.font-normal`, `.font-medium`, `.font-semibold`, `.font-bold`, `.font-extrabold`
- `.uppercase`

### Spacing

- `.m-0`, `.m-xs`, `.m-sm`, `.m-md`, `.m-lg`, `.m-xl`
- `.mt-0`, `.mr-0`, `.mb-0`, `.ml-0`
- `.p-0`, `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl`

### Border Radius

- `.rounded-sm`, `.rounded-md`, `.rounded-lg`, `.rounded-xl`, `.rounded-full`

### Shadows

- `.shadow-sm`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`

### Component Classes

- `.table-header` - Header tabel
- `.table-row-even` - Baris tabel genap
- `.table-row-odd` - Baris tabel ganjil
- `.card-base` - Card dasar
- `.card-hover` - Card dengan efek hover
- `.btn-primary` - Button primary
- `.btn-secondary` - Button secondary
- `.tag-base` - Tag dasar
- `.tag-channel-live-chat`, `.tag-channel-voice`, `.tag-channel-video`, `.tag-channel-email`
- `.tag-request-stt`, `.tag-request-llm`, `.tag-request-tts`
- `.input-base` - Input dasar
- `.drawer-content` - Content drawer
- `.drawer-section` - Section dalam drawer
- `.pagination-container` - Container pagination
- `.pagination-info` - Info pagination

### Utilities

- `.hide-scrollbar` - Sembunyikan scrollbar
- `.custom-scrollbar` - Custom scrollbar styling
- `.fade-in` - Animasi fade in
- `.slide-up` - Animasi slide up
- `.hide-mobile` - Sembunyikan di mobile
- `.hide-desktop` - Sembunyikan di desktop

## CSS Variables

### Colors

```css
--color-primary: #40ACE2
--color-text-primary: #1e293b
--color-bg-primary: #ffffff
--color-border: #e5e7eb
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
--color-info: #3b82f6
```

### Spacing

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### Border Radius

```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px
```

### Typography

```css
--font-family-base: 'Inter', sans-serif
--font-size-xs: 10px
--font-size-sm: 12px
--font-size-base: 14px
--font-size-md: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 28px
```

## Dark Mode Support

Semua CSS variables otomatis mendukung dark mode melalui `[data-theme='dark']`. Tidak perlu perubahan kode tambahan.

## Best Practices

1. **Gunakan CSS Variables** untuk values yang bisa berubah (colors, spacing)
2. **Gunakan Utility Classes** untuk styling yang sering digunakan
3. **Gunakan Component Classes** untuk styling komponen spesifik
4. **Konsisten** - Gunakan style yang sama untuk elemen yang sama di seluruh aplikasi
5. **Dark Mode** - Pastikan semua style mendukung dark mode

## Contoh Penggunaan

### Contoh 1: Table Row

```tsx
<tr className="table-row-even">
  <td className="text-primary font-semibold">Content</td>
</tr>
```

### Contoh 2: Card dengan Hover

```tsx
<div className="card-hover p-lg">
  <h3 className="text-primary font-bold text-xl mb-md">Title</h3>
  <p className="text-secondary">Description</p>
</div>
```

### Contoh 3: Tag Channel

```tsx
<span className="tag-channel-live-chat">
  <MessageOutlined /> Live Chat
</span>
```

### Contoh 4: Button dengan Custom Style

```tsx
<button 
  className="btn-primary"
  style={{
    padding: 'var(--spacing-md) var(--spacing-lg)',
    fontSize: 'var(--font-size-base)'
  }}
>
  Submit
</button>
```

## Catatan

- Semua utility classes sudah include dark mode support
- CSS variables menggunakan `:root` untuk light mode dan `[data-theme='dark']` untuk dark mode
- Pastikan menggunakan class yang sesuai untuk menjaga konsistensi
