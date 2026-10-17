# Say By Saniya — Admin Guide 🌸
*A simple, step-by-step handbook for managing your online shop from your phone or laptop.*

---

## 1. How to Access the Admin Portal

1. Open your browser and go to: `https://your-domain.com/admin` (or `http://localhost:5173/admin` during development).
2. Enter your **Admin Email** and **Password**.
3. Tap **Sign In**.
   > **Note:** Only email addresses registered in the admin allowlist can log in. This ensures no unauthorized visitors can ever access your shop dashboard.

---

## 2. Shop Dashboard Overview

When you log in, you will see a quick summary:
- **New Enquiries:** Customers who tapped "Order on WhatsApp" or "Order on Instagram" from their cart.
- **Orders in Progress:** Orders that need to be packed or shipped.
- **Pending Reviews:** New customer reviews waiting for your approval.
- **Active Deals:** Current promotions running on the store.

---

## 3. Managing Products

### Adding a New Product
1. Go to the **Products** tab.
2. Tap the **+ Add Product** button.
3. Fill in the details:
   - **Product Name:** e.g., *Rose Petal Lip Glaze*
   - **URL Slug:** e.g., `rose-petal` (lowercase, with hyphens)
   - **Subtitle:** A short one-line description.
   - **Description:** How it feels, scent notes, and benefits.
   - **Price in Rupees (₹):** Enter the selling price (e.g. `299`).
   - **Size:** Default is `15g` pocket slider tin.
   - **Status:**
     - `available`: In stock and ready to buy.
     - `sold-out`: Displays a "Sold Out" tag.
     - `coming-soon`: Displays a "Coming Soon" badge with a "Notify Me" button.
     - `limited-drop`: For seasonal small batches.
   - **Badge:** Optional highlight tag like *Bestseller* or *Founder's Pick*.
   - **Flavor Notes & Ingredients:** Enter items separated by commas.
4. Tap **Save Product**. It will appear on your shop immediately!

### Updating Prices or Stock
- To change a price, tap **Edit** on any product, type the new price, and tap **Save**. The website updates instantly.

---

## 4. Uploading Product Photos

1. When editing a product (or in the **Photos** section), tap **Upload Photos**.
2. Select one or more images from your phone gallery or computer.
3. The photos will automatically be compressed and uploaded securely to Supabase Storage.
4. **Set as Hero Image:** Tap the star icon on any photo to make it the primary thumbnail shown on the shop grid.
5. **Reorder Photos:** Drag and drop images to change the order they appear in the product gallery.
6. **Delete Photo:** Tap the trash can icon on any photo you want to remove.

---

## 5. Creating & Running Special Deals

Run holiday sales, launch promotions, or Instagram discount codes without touching code:

1. Go to the **Deals** tab and tap **+ Create Deal**.
2. Fill in the deal info:
   - **Deal Title:** e.g. *Festive Glow Duo (15% Off)*
   - **Coupon Code (Optional):** e.g. `DIWALI15` or `WELCOME10`. When a customer mentions this code on WhatsApp or Instagram, it will be included in their prefilled message!
   - **Discount Type:**
     - `Percentage Off`: e.g. `15` for 15% off.
     - `Flat Discount`: e.g. `50` for ₹50 off the order.
     - `Fixed Sale Price`: Set a specific discounted price.
     - `Bundle Deal`: Special bundle pricing.
   - **Schedule Dates:** Set an optional **Start Date** and **End Date**. The site will automatically show an "Ends in X hours" countdown timer!
   - **Show in Announcement Banner:** Turn this switch ON if you want this deal featured across the top banner of the whole website.
   - **Active Toggle:** Switch OFF to pause the deal anytime, and ON to resume.
3. Tap **Save Deal**. Customers can view active deals on your `/deals` page and Home page strip.

---

## 6. Managing Customer Enquiries & Orders

Because orders come directly to your WhatsApp and Instagram DM:

1. **When a customer clicks "Order on WhatsApp" or "Order on Instagram":**
   - The website automatically saves a snapshot of their cart, items, total price, and the channel to your **Enquiries** list.
   - The customer arrives in your chat with a neatly formatted prefilled message listing their items.
2. **Converting an Enquiry to an Order:**
   - In the **Enquiries** tab, find the customer's enquiry.
   - Tap **Convert to Order**.
   - Review or edit their name, phone number, or Instagram handle.
   - Tap **Create Order**.
3. **Updating Order Status:**
   - As you prepare and ship the order, move its status:
     - `New` → `Confirmed` → `Packed` → `Shipped` → `Delivered`
   - When shipped, add the **Courier Name** (e.g., Delhivery, BlueDart, India Post) and **Tracking Number**.
4. **Exporting Records:**
   - Tap **Export CSV** at any time to download a complete spreadsheet of your sales and customer orders for accounting.

---

## 7. Moderating Reviews & Testimonials

### Moderating Customer Reviews
When visitors submit a review on a product page, it is marked as **Pending** so spam or inappropriate messages never reach your live site.
1. Go to the **Reviews** tab.
2. Under **Pending Reviews**, read the submission and star rating.
3. Tap **Approve** to publish it to the product page and Home testimonials.
4. Tap **Delete** to discard unwanted reviews.

### Adding Manual Testimonials
You can also manually add glowing messages or Instagram feedback:
1. Tap **+ Add Testimonial**.
2. Enter the customer's name, Instagram handle (e.g., `@priyaloves`), their quote, and rating.
3. Tap **Publish**. It will be displayed in the testimonial strip on the Home page.

---

## 8. Store Settings

From the **Settings** tab, you can update:
- **WhatsApp Phone Number:** Change the number that receives order messages without code redeployments.
- **Instagram Handle:** Update your Instagram username link.
- **Announcement Banner Text:** Change the text scrolling at the very top of the website.
- **Shipping Note:** Edit the delivery timeline shown to customers.
