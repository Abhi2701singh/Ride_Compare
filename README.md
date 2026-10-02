# 🚕 RideCompare — Multi-Provider Ride Aggregation & Comparison Platform

> **Compare fares, ETAs, vehicle types, and routes across Uber, Ola, Rapido, inDrive, BluSmart, and Namma Yatri in one click.**
> Built with React 19, TypeScript, Tailwind CSS, Leaflet Maps, and designed for **100% Free Deployment on Cloudflare Pages**.

---

## 🌟 Project Overview (प्रोजेक्ट का परिचय)

When people in India need to book a ride, they often spend 5–10 minutes opening separate apps:
- **Uber** (Cabs, Autos, Moto)
- **Ola** (Mini, Prime Sedan, Auto, Bike)
- **Rapido** (Lowest bike fares, fast autos)
- **inDrive** (Bidding model, no algorithm surge)
- **BluSmart** (100% Electric EV, Zero surge, Zero cancellation)
- **Namma Yatri / Yatri Sathi** (0% commission, direct driver pay)

**RideCompare** solves this problem by centralizing all ride providers into a single, intuitive interface. Users enter their pickup and destination, and RideCompare instantly displays:
- 💰 **Real-time Estimated Fares** (highlighting savings: *"Save ₹175 vs Uber!"*)
- ⏱️ **Pickup Arrival Times (ETA)**
- 🚗 **Vehicle Categories** (Bike, Auto, Cab, Electric EV, Premium)
- 🛣️ **Driving Distance & Route Navigation** (via OpenStreetMap & OSRM)
- 📈 **Dynamic Surge & Transparent Fare Breakdowns**
- 📱 **Quick Booking Simulator** with Driver Assignment, OTP & Direct App Deep-links.
- 👨💼 **Admin Control Center** to toggle providers, simulate rain/peak surges, and track analytics.

---

## ☁️ How to Deploy on Cloudflare for FREE (क्लाउडफ्लेयर पर फ्री में कैसे डिप्लॉय करें)

Cloudflare Pages offers **unlimited bandwidth, 300+ worldwide edge locations, free automatic SSL, and custom domain support at ₹0 cost forever**.

The project is already pre-configured with:
- `wrangler.toml` (Cloudflare Pages config)
- `public/_redirects` (Single Page App routing rule: `/* /index.html 200`)
- `public/_headers` (Optimal edge caching and security headers)

### 🚀 Method 1: 1-Command CLI Deployment (Fastest)

1. Build the production files:
   ```bash
   npm run build
   ```
2. Deploy directly to Cloudflare Pages using Wrangler:
   ```bash
   npx wrangler pages deploy dist --project-name=ride-compare
   ```
   *(If it's your first time, Wrangler will open your browser to log in to your free Cloudflare account. Once logged in, it will upload and give you a live URL like `https://ride-compare.pages.dev` in under 30 seconds!)*

---

### 🌐 Method 2: Git Push Deployment (Recommended for Auto-Updates)

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of RideCompare"
   git remote add origin https://github.com/<your-username>/ride-compare.git
   git branch -M main
   git push -u origin main
   ```
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Go to **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**
4. Select your `ride-compare` repository and set:
   - **Framework preset**: `Vite` (or None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**. Cloudflare will automatically build and publish your site with a free `https://<your-project>.pages.dev` domain and automatic SSL!

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite | Blazing fast HMR, type-safe data models, edge deployable |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive fintech UI with Dark/Light mode support |
| **Interactive Map** | Leaflet + OpenStreetMap | **Zero cost**, no Google Maps API billing or credit card required |
| **Routing Engine** | OSRM (Open Source Routing Machine) | Real road geometries, driving distances, and travel times |
| **Geocoding** | Nominatim API + Metro Presets | Real-time Indian address lookup & instant preset routes |
| **Effects** | Canvas Confetti | Celebratory booking confirmation experience |
| **Hosting** | Cloudflare Pages | **100% Free**, zero server maintenance, global edge CDN |

---

## 🚀 Running Locally (अपने कंप्यूटर पर कैसे चलाएं)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧩 Key Features Walkthrough

### 1. Smart Fare Comparison & Savings Banner
- Computes difference between the highest fare and cheapest fare.
- Clearly states: *"💡 Save up to ₹175 (55%) on Rapido Bike vs Uber!"*
- Categorized quick filters:
  - 🏆 **Cheapest Option**
  - ⚡ **Fastest Arrival (Lowest ETA)**
  - 🌿 **100% Electric EV (BluSmart)**

### 2. Provider Integration Engine
The modular architecture (`src/services/providerEngine.ts`) implements Indian ride pricing algorithms:
- **Uber**: Go, Premier, XL, Auto, Moto (bike)
- **Ola**: Mini, Prime Sedan, Prime Plus, Auto, Bike
- **Rapido**: Lowest rate Bike taxi, Auto, Cab Economy
- **inDrive**: User-driver bidding model (15-20% cheaper base fare)
- **BluSmart**: 100% Electric Sedans, Zero Surge guarantee, Zero driver cancellation
- **Namma Yatri / Yatri Sathi**: 0% driver commission, open mobility network

### 3. Interactive Leaflet Map
- Green pin for **Pickup**, Red pin for **Destination**.
- Blue animated road polyline matching real highway/city routes.
- Real-time animated **nearby cabs, autos, and bikes** moving around pickup point.
- GPS button to detect user's current location with 1 click.

### 4. End-to-End Booking Simulator
- Payment selection: **UPI (GPay / PhonePe / Paytm)**, Cash, Card, or Wallet.
- Radar driver dispatching animation.
- Driver assignment card with:
  - Driver Name & Rating (⭐ 4.88)
  - Vehicle Model & Registration Plate (`DL 1C AB 4829`)
  - **4-Digit Ride Start OTP**
  - Direct Call & Message actions.
- Official App Deep-link button to open the ride directly on Uber, Ola, Rapido, etc.

### 5. Admin Control Center
- Platform KPIs: Total Searches, Bookings, User Savings Generated, Est. Revenue.
- Dynamic Surge Slider (1.0x to 2.5x).
- Weather Simulator (Rain surge +35%, Clear normal).
- Toggle individual ride providers ON or OFF in real time.

---

## 📄 Portfolio & Resume Highlights

- **One-line summary for Resume:**
  > *"Architected and deployed a multi-provider ride aggregation platform on Cloudflare Pages that compares fares, ETAs, and vehicle categories across 7 transportation services (Uber, Ola, Rapido, inDrive, BluSmart) using React, TypeScript, Leaflet, and OSRM routing."*
- **Key Technical Skills Demonstrated:**
  - Modern React 19, TypeScript, Tailwind CSS, Component Architecture
  - Geospatial APIs (OpenStreetMap, Leaflet, OSRM Routing Machine)
  - Cloudflare Edge Deployment (Pages, Headers, Redirects, Wrangler)
  - Aggregation & Provider Adapter Pattern
  - State persistence with LocalStorage & Responsive UI/UX Design

---

## 📜 License
MIT License — Free to use for personal projects, college submissions, and portfolios!
