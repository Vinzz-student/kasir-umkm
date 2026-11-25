# Kasir UMKM

Aplikasi kasir dan pemesanan digital untuk UMKM berbasis web. Aplikasi ini memungkinkan pelanggan melihat menu dan melakukan pemesanan, sementara penjual dapat mengelola produk, pesanan, pembayaran, dan riwayat transaksi.

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide React
- React Hooks

### Backend
- Next.js Route Handlers
- Node.js
- MySQL
- mysql2
- Zod
- bcryptjs
- jose
- server-only

## Fitur Aplikasi

### 1. Pelanggan

- Melihat katalog menu tanpa login.
- Mencari dan memfilter produk berdasarkan kategori.
- Menambahkan produk ke keranjang.
- Registrasi dan login pelanggan.
- Melakukan pemesanan setelah login.
- Memilih metode pembayaran QRIS atau tunai.
- Melihat status pesanan aktif.
- Melihat detail dan riwayat pesanan.
- Mengelola informasi akun.
- Logout dan berpindah akun.

### 2. Penjual

- Login khusus penjual.
- Registrasi penjual menggunakan undangan berupa token atau QR.
- Melihat dashboard penjualan.
- Mengelola kategori produk.
- Menambah, mengubah, dan menghapus produk.
- Mengatur ketersediaan produk.
- Melihat daftar pesanan masuk.
- Melihat detail pesanan dan informasi pelanggan.
- Mengubah status pesanan.
- Memverifikasi pembayaran QRIS secara manual.
- Memproses pembayaran tunai dan menghitung kembalian.
- Melihat riwayat transaksi.

## Struktur Folder Project

kasir-umkm/
│
├── public/
│   ├── images/
│   │   ├── products/
│   │   ├── qris/
│   │   └── logo.svg
│   │
│   └── icons/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── daftar/
│   │   │   └── page.tsx
│   │   │
│   │   ├── daftar-penjual/
│   │   │   └── page.tsx
│   │   │
│   │   ├── keranjang/
│   │   │   └── page.tsx
│   │   │
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   │
│   │   ├── pembayaran/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── pesanan/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── riwayat/
│   │   │   └── page.tsx
│   │   │
│   │   ├── akun/
│   │   │   └── page.tsx
│   │   │
│   │   ├── penjual/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   │
│   │   │   ├── pesanan/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── menu/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── tambah/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── kategori/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── pembayaran/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── riwayat/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── undangan/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── route.ts
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   ├── register-seller/
│   │       │   │   └── route.ts
│   │       │   ├── logout/
│   │       │   │   └── route.ts
│   │       │   └── session/
│   │       │       └── route.ts
│   │       │
│   │       ├── categories/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       │
│   │       ├── products/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       │
│   │       ├── orders/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       │
│   │       ├── payments/
│   │       │   ├── [id]/
│   │       │   │   └── route.ts
│   │       │   └── [id]/
│   │       │       └── verify/
│   │       │           └── route.ts
│   │       │
│   │       └── seller/
│   │           ├── dashboard/
│   │           │   └── route.ts
│   │           ├── orders/
│   │           │   └── route.ts
│   │           ├── products/
│   │           │   └── route.ts
│   │           ├── categories/
│   │           │   └── route.ts
│   │           └── invites/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   └── select.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── confirm-dialog.tsx
│   │   │
│   │   ├── buyer/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-list.tsx
│   │   │   ├── category-filter.tsx
│   │   │   ├── cart-item.tsx
│   │   │   ├── cart-summary.tsx
│   │   │   ├── order-card.tsx
│   │   │   └── order-status.tsx
│   │   │
│   │   └── seller/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       ├── stat-card.tsx
│   │       ├── order-table.tsx
│   │       ├── product-form.tsx
│   │       ├── category-form.tsx
│   │       └── payment-form.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── products/
│   │   │   ├── product.service.ts
│   │   │   ├── product.validation.ts
│   │   │   └── product.types.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── category.service.ts
│   │   │   ├── category.validation.ts
│   │   │   └── category.types.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── order.service.ts
│   │   │   ├── order.validation.ts
│   │   │   └── order.types.ts
│   │   │
│   │   └── payments/
│   │       ├── payment.service.ts
│   │       ├── payment.validation.ts
│   │       └── payment.types.ts
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts
│   │   │   └── transaction.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   ├── password.ts
│   │   │   ├── permissions.ts
│   │   │   └── invitation.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── format-currency.ts
│   │   │   ├── format-date.ts
│   │   │   └── generate-order-number.ts
│   │   │
│   │   ├── api-response.ts
│   │   └── constants.ts
│   │
│   ├── hooks/
│   │   ├── use-cart.ts
│   │   └── use-debounce.ts
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── order.ts
│   │   └── payment.ts
│   │
│   └── middleware.ts
│
├── .env.example
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prettier.config.mjs
├── tsconfig.json
├── README.md
└── next-env.d.ts

## Environment Variables

Buat file `.env.local` berdasarkan `.env.example`.

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kasir_umkm

SESSION_SECRET= (isi dengan secret acak, ketik command berikut di terminal "openssl rand -base64 32")

## Instalasi dan Menjalankan Project

### 1. Install Dependencies

npm install

### 2. Jalankan XAMPP/Laragon

Pastikan Apache dan MySQL aktif.

### 3. Buat Database

Buka phpMyAdmin/HeidiSQL, kemudian import:

- `database/schema.sql`
- `database/seed.sql`

### 4. Konfigurasi Environment

Isi `.env.local` sesuai konfigurasi MySQL lokal.

### 5. Jalankan Development Server

npm run dev

Buka: http://localhost:3000
