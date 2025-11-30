---
title: "Real-Time Bidding (RTB) and Dynamic Pricing — Notes"
subtitle: "How publishers use auctions, reserve prices, and option-style contracts to manage ad inventory"
date: "11/30/2025"
category: "Stochastic Processes"
readTime: "8 min read"
---

# Real-Time Bidding (RTB) and Dynamic Pricing

based on the paper: [Display Advertising with
Real-Time Bidding (RTB) and Behavioural Targeting](https://arxiv.org/pdf/1610.03013) by Jun Wang.

## 1. What is Real-Time Bidding (RTB)?

- **RTB** is a way of selling and buying online ad impressions **one at a time, in real time**, via auctions.
- When a user loads a page/app:
  1. An **ad request** is sent to an ad exchange.
  2. Multiple **demand-side platforms (DSPs)** bid for the impression.
  3. The **highest bidder wins**, and their ad is shown.
  4. This all happens in ~100 ms.

**Key players:**

- **Publisher**: owns the site/app; sells impressions.
- **Ad exchange / SSP**: runs the auction (the RTB marketplace).
- **Advertiser / DSP**: bids for impressions to show ads to users.

---

## 2. Auction Mechanics in RTB

Most RTB systems use variants of a **second-price auction** (or modified second-price):

- Each bidder submits a **bid** (e.g. cost-per-mille, CPM).
- Bids: $ b_1 \ge b_2 \ge \dots \ge b_K $
- **Winner**: highest bid $ b_1 $
- **Price paid** (classic second price): approximately the second-highest bid $ b_2 $
  (sometimes with floors and other adjustments)

**Why second-price?**

- Encourages bidders to bid closer to their **true value**, because they pay (roughly) the _next_ highest price, not their own.

---

## 3. Where Dynamic Pricing Comes In

Dynamic pricing in RTB is mainly a **publisher-side** concept:

> The publisher (or exchange) **adjusts prices and contract terms over time and across impressions** to maximise revenue under uncertainty, instead of using a single fixed price.

Dynamic pricing shows up in three main areas:

1. **Dynamic reserve prices** in RTB auctions
2. **Programmatic guaranteed / direct deals** with time-varying prices
3. **Ad options / First Look deals** priced off future RTB uncertainty

---

## 4. Dynamic Reserve Prices (Floor Prices)

### 4.1 What is a reserve price?

- A **reserve (floor) price** $ \alpha $ is the **minimum price** at which the publisher is willing to sell the impression.
- In a second-price auction with a reserve:
  - If $ b_1 \ge \alpha $, the highest bidder can still win.
  - If $ b_1 < \alpha $, the impression is **not sold** in this auction (or is routed elsewhere).

More precisely, given $ b_1 \ge b_2 \ge \dots \ge b_K $:

- **Neutral case**: $ b_1 > b_2 \ge \alpha $
  - Winner: highest bidder
  - Price: $ b_2 $ (same as no reserve; floor is inactive)
- **Desirable (binding) case**: $ b_1 \ge \alpha > b_2 $
  - Winner: highest bidder
  - Price: $ \alpha $ (higher than $ b*2 $; floor \_increases* revenue)
- **Bad case**: $ \alpha > b_1 $
  - No winner, no revenue from this impression

### 4.2 Dynamic aspect

The key is that the **reserve price is not fixed**. It can:

- Change by time of day, user segment, ad format/placement, or inventory scarcity.
- Be updated using statistical models of bid distributions or online learning/bandit algorithms.

In practice:

- The publisher/exchange tests different reserve prices.
- Observes revenue and fill rate:
  - Higher floors → higher price per impression but potentially **more unsold inventory**.
  - Lower floors → more impressions sold but **lower prices**.
- Uses algorithms to **optimise the trade-off**.

---

## 5. Dynamic Pricing via Programmatic Guaranteed

RTB is the **spot market**. On top of that, publishers also sell **Programmatic Guaranteed / Programmatic Direct** deals:

- Contracts to deliver a fixed number of impressions in the future
- At a pre-agreed CPM, often sold in advance

Dynamic pricing here means the guaranteed price is **time- and state-dependent**, based on:

- Forecasted future RTB prices
- Forecasted inventory supply
- Observed demand for guaranteed deals

**Logic:**

- If future RTB competition is expected to be **weak** → guaranteed prices may be **lower** to lock in revenue.
- If future RTB competition is expected to be **strong** → guaranteed prices can be **higher**, since advertisers will pay extra to secure inventory.

Publishers dynamically decide:

1. How many impressions to allocate to guaranteed contracts vs leaving for RTB.
2. What guaranteed CPM to charge at each time.

This is a **dynamic pricing + allocation** problem.

---

## 6. Ad Options and First Look: Dynamic Pricing via Option Theory

To manage **risk** and **flexibility**, publishers offer **ad options** or **First Look deals**.

### 6.1 Ad options

- Advertiser pays an upfront option price for the right (not obligation) to buy future impressions/clicks:
  - At a fixed strike price (CPM/CPC)
  - During a future time window
- The underlying is the future RTB clearing price.

Dynamic pricing tasks:

- Model the stochastic process of future RTB prices.
- Use option-pricing ideas (Black–Scholes-style, binomial trees, bespoke models).
- Set a fair option premium and strike price.

### 6.2 First Look deals

- Advertiser gets priority access to impressions:
  - They see the impression before the open auction.
  - They can buy at a pre-agreed floor/fixed price.
  - If they decline, the impression goes to RTB.

Dynamic pricing here means priority prices/terms depend on:

- Forecast distribution of RTB prices
- Advertiser’s risk tolerance
- Publisher’s revenue objectives

---

## 7. Why Dynamic Pricing Matters in RTB

### 7.1 Revenue maximisation (yield management)

- Dynamic pricing boosts revenue per impression, smooths revenue over time, and enables price discrimination.

### 7.2 Risk management

- RTB prices are volatile. Guaranteed deals and options let publishers lock in revenue and advertisers cap future costs.

### 7.3 Better market segmentation and control

- Different channels for different advertiser types:
  - Risk-averse, high-value buyers → guaranteed & options (higher prices)
  - Price-sensitive buyers → RTB spot market with more uncertainty
- Dynamic pricing aligns each buyer type with the contract that fits them best.
