# E-Commerce Backend — Sprint Plan

## Overview
4 sprints implementing: Paystack payments, catalog enhancements (search/filter/pagination/reviews/inventory), user experience (profile/wishlist/address book/returns), and marketing (coupons/email notifications/recommendations).

---

## Sprint 1 — Foundation & Payments
**Goal**: Stable data layer + real Paystack payment working end-to-end.

### Tasks
- [ ] Install `paystack-api` + `nodemailer`
- [ ] Update `models/userModel.js` — add `phone`, `addresses`, `wishlist`
- [ ] Update `models/productModel.js` — add `subCategory`, `bestseller`, `date`, `stock`, `avgRating`, `reviewCount`
- [ ] Update `models/orderModel.js` — add `statusHistory`, `couponCode`, `discount`
- [ ] Implement `placeOrderPaystack` in `controllers/orderController.js` — initialize Paystack transaction
- [ ] Implement `verifyPaystack` in `controllers/orderController.js` — verify payment, save order, deduct stock
- [ ] Update COD `placeOrder` to deduct stock
- [ ] Update `routes/orderRoute.js` — `/paystack`, `/verify-paystack`

### New Env Vars Required
```
PAYSTACK_SECRET_KEY=sk_test_...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=yourpassword
```

### Deliverable
Paystack payments work end-to-end. All models have complete schemas.

---

## Sprint 2 — Catalog Enhancements
**Goal**: Rich product browsing and discovery.

### Tasks
- [ ] Update `listProducts` — add pagination + filters (`category`, `subCategory`, `minPrice`, `maxPrice`, `sort`, `bestseller`)
- [ ] Update `addProduct` — handle `subCategory`, `bestseller`, `date`, `stock` fields
- [ ] Add `searchProducts` — MongoDB text search on name + description
- [ ] Add `getRecommendations` — same-category products, sorted by avgRating (limit 8)
- [ ] Create `models/reviewModel.js`
- [ ] Create `controllers/reviewController.js` — `addReview`, `getProductReviews`, `deleteReview`
- [ ] Create `routes/reviewRoute.js`
- [ ] Update `routes/productRoute.js` — add search + recommendations endpoints
- [ ] Register `/api/review` in `server.js`

### New Endpoints
| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/product/list?page&limit&category&subCategory&minPrice&maxPrice&sort&bestseller | Public |
| GET | /api/product/search?q=&... | Public |
| GET | /api/product/recommendations/:productId | Public |
| POST | /api/review/add | User |
| GET | /api/review/:productId | Public |
| DELETE | /api/review/delete | Admin |

### Deliverable
Search, filters, pagination, and product reviews all working.

---

## Sprint 3 — User Experience
**Goal**: Rich user accounts + order visibility + returns flow.

### Tasks
- [ ] Add `getProfile`, `updateProfile` to `controllers/userController.js`
- [ ] Add `addAddress`, `removeAddress` to `controllers/userController.js`
- [ ] Add `addToWishlist`, `removeFromWishlist`, `getWishlist` to `controllers/userController.js`
- [ ] Update `routes/userRoute.js` — profile, address, wishlist endpoints
- [ ] Update `updateStatus` in `controllers/orderController.js` — push to `statusHistory`
- [ ] Create `models/returnModel.js`
- [ ] Create `controllers/returnController.js` — `requestReturn`, `getUserReturns`, `allReturns`, `updateReturnStatus`
- [ ] Create `routes/returnRoute.js`
- [ ] Register `/api/return` in `server.js`

### New Endpoints
| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/user/profile | User |
| PUT | /api/user/profile | User |
| POST | /api/user/address/add | User |
| DELETE | /api/user/address/remove | User |
| POST | /api/user/wishlist/add | User |
| POST | /api/user/wishlist/remove | User |
| GET | /api/user/wishlist | User |
| POST | /api/return/request | User |
| GET | /api/return/user | User |
| GET | /api/return/list | Admin |
| POST | /api/return/status | Admin |

### Deliverable
Users can manage profiles, addresses, wishlists. Returns flow works. Orders track full status history.

---

## Sprint 4 — Marketing & Notifications
**Goal**: Promotions, emails, and recommendations fully wired.

### Tasks
- [ ] Create `models/couponModel.js`
- [ ] Create `controllers/couponController.js` — `applyCoupon`, `createCoupon`, `listCoupons`, `deleteCoupon`
- [ ] Create `routes/couponRoute.js`
- [ ] Wire coupon validation into `placeOrder` (COD) and `verifyPaystack`
- [ ] Create `utils/emailService.js` — `sendOrderConfirmation`, `sendStatusUpdate`, `sendReturnUpdate`
- [ ] Trigger emails in: `placeOrder`, `verifyPaystack`, `updateStatus`, `updateReturnStatus`
- [ ] Register `/api/coupon` in `server.js`

### New Endpoints
| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/coupon/apply | User |
| POST | /api/coupon/create | Admin |
| GET | /api/coupon/list | Admin |
| DELETE | /api/coupon/delete | Admin |

### Deliverable
Coupons apply at checkout for both COD and Paystack. Emails fire on order placement, status change, and return updates.

---

## Testing Checklist
- [ ] `npm run server` — server starts without errors
- [ ] `GET /api/product/list?page=1&limit=5` — pagination works
- [ ] `GET /api/product/search?q=shirt` — text search works
- [ ] `POST /api/review/add` — add review, check avgRating updates on product
- [ ] `POST /api/user/wishlist/add` + `GET /api/user/wishlist` — wishlist works
- [ ] `POST /api/coupon/create` (admin) + `POST /api/coupon/apply` — coupon validates correctly
- [ ] `POST /api/order/paystack` — returns Paystack authorization_url
- [ ] `POST /api/order/verify-paystack` — verifies payment, saves order, clears cart
- [ ] `POST /api/return/request` — creates return, admin can update status
- [ ] Emails received on order placement and status update
