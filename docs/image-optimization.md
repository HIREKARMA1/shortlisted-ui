# Image Optimization Guide

This project uses optimized image components with lazy loading and skeleton loaders for better performance and user experience.

## Components

### OptimizedImage

A wrapper around Next.js Image component with built-in lazy loading and skeleton loader.

**Features:**
- ✅ Lazy loading (default)
- ✅ Skeleton loader while loading
- ✅ Error handling with placeholder
- ✅ AWS S3 support
- ✅ Dark mode support
- ✅ Multiple variants and aspect ratios

**Usage:**

```tsx
import { OptimizedImage } from "@/components/ui/optimized-image"

// Basic usage
<OptimizedImage
  src="https://your-bucket.s3.amazonaws.com/image.jpg"
  alt="Image description"
  width={400}
  height={300}
/>

// With variants
<OptimizedImage
  src="https://your-bucket.s3.amazonaws.com/image.jpg"
  alt="Image description"
  width={400}
  height={300}
  variant="rounded"
  aspectRatio="square"
/>

// Fill container
<OptimizedImage
  src="https://your-bucket.s3.amazonaws.com/image.jpg"
  alt="Image description"
  fill
  className="w-full h-64"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Priority loading (above the fold)
<OptimizedImage
  src="https://your-bucket.s3.amazonaws.com/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority
/>
```

### ImageCard

An image component wrapped in a card with skeleton loading. Perfect for card layouts.

**Usage:**

```tsx
import { ImageCard } from "@/components/ui/image-card"

<ImageCard
  src="https://your-bucket.s3.amazonaws.com/image.jpg"
  alt="Image description"
  width={400}
  height={300}
  showCard
>
  <h3 className="font-semibold">Card Title</h3>
  <p className="text-sm text-gray-600 dark:text-gray-400">
    Card description
  </p>
</ImageCard>
```

### ImageSkeleton

A skeleton loader component for images. Used internally but can be used standalone.

**Usage:**

```tsx
import { ImageSkeleton } from "@/components/ui/image-skeleton"

<ImageSkeleton 
  variant="rounded" 
  aspectRatio="square"
  className="w-full h-64"
/>
```

## Props

### OptimizedImage & ImageCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Image URL (AWS S3 or any) |
| `alt` | `string` | **required** | Alt text for accessibility |
| `width` | `number` | - | Image width (required if not using `fill`) |
| `height` | `number` | - | Image height (required if not using `fill`) |
| `fill` | `boolean` | `false` | Fill parent container |
| `className` | `string` | - | Additional CSS classes |
| `priority` | `boolean` | `false` | Load with priority (above the fold) |
| `sizes` | `string` | - | Responsive image sizes |
| `objectFit` | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` | `"cover"` | Object fit style |
| `variant` | `"default" \| "rounded" \| "circular"` | `"default"` | Border radius variant |
| `aspectRatio` | `"square" \| "video" \| "auto"` | `"auto"` | Aspect ratio constraint |
| `onLoad` | `() => void` | - | Callback when image loads |
| `onError` | `() => void` | - | Callback when image fails |

### ImageCard Additional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showCard` | `boolean` | `false` | Wrap image in Card component |
| `cardClassName` | `string` | - | Additional classes for card |
| `children` | `ReactNode` | - | Content below image (when using card) |

## AWS S3 Configuration

The project is configured to accept images from AWS S3 buckets. The following patterns are allowed:

- `*.s3.amazonaws.com`
- `*.s3.*.amazonaws.com`
- `s3.amazonaws.com`

Configuration is in `next.config.js`:

```js
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.s3.amazonaws.com",
      pathname: "/**",
    },
    // ... more patterns
  ],
}
```

## Best Practices

### 1. Always Provide Alt Text
```tsx
// ✅ Good
<OptimizedImage src="..." alt="Product image showing blue t-shirt" />

// ❌ Bad
<OptimizedImage src="..." alt="image" />
```

### 2. Use Appropriate Sizes
```tsx
// For responsive images
<OptimizedImage
  src="..."
  alt="..."
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 3. Use Priority for Above-the-Fold Images
```tsx
// Hero images, logos, etc.
<OptimizedImage
  src="..."
  alt="..."
  priority
  width={1200}
  height={600}
/>
```

### 4. Choose Appropriate Variants
```tsx
// Profile pictures
<OptimizedImage variant="circular" ... />

// Product images
<OptimizedImage variant="rounded" ... />

// General images
<OptimizedImage variant="default" ... />
```

### 5. Handle Errors Gracefully
```tsx
<OptimizedImage
  src="..."
  alt="..."
  onError={() => console.error("Image failed to load")}
/>
```

## Performance Tips

1. **Lazy Loading**: Images are lazy loaded by default. Only use `priority` for critical images.

2. **Responsive Images**: Use the `sizes` prop for responsive images to help Next.js choose the right image size.

3. **Aspect Ratios**: Use `aspectRatio` prop to prevent layout shift:
   ```tsx
   <OptimizedImage aspectRatio="square" ... />
   ```

4. **Object Fit**: Choose appropriate `objectFit` based on your design:
   - `cover`: Fill container, may crop (default)
   - `contain`: Fit entire image, may have empty space
   - `fill`: Stretch to fill (may distort)

## Examples

### Gallery Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {images.map((image) => (
    <OptimizedImage
      key={image.id}
      src={image.url}
      alt={image.alt}
      width={400}
      height={400}
      variant="rounded"
      aspectRatio="square"
    />
  ))}
</div>
```

### Hero Section
```tsx
<div className="relative h-[500px] w-full">
  <OptimizedImage
    src={heroImageUrl}
    alt="Hero image"
    fill
    priority
    objectFit="cover"
    sizes="100vw"
  />
</div>
```

### Product Card
```tsx
<ImageCard
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
  showCard
  variant="rounded"
  aspectRatio="square"
>
  <h3 className="font-semibold">{product.name}</h3>
  <p className="text-gray-600 dark:text-gray-400">
    ${product.price}
  </p>
</ImageCard>
```

