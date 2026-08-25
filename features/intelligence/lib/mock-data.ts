export interface Message {
  id: string;
  role: "human" | "assistant" | "tool_call" | "tool_response";
  content: string;
  timestamp: string;
  runId?: string;
  toolName?: string;
  model?: string;
  tokens?: { input: number; output: number };
  latency?: string;
  cost?: string;
}

export interface Thread {
  id: string;
  user: string;
  startedAt: string;
  turns: number;
  duration: string;
  score: number;
  status: "completed" | "failed" | "in_progress";
  model: string;
  totalTokens: number;
  totalCost: string;
  messages: Message[];
}

export interface MetricCard {
  label: string;
  value: string;
  trend: number[];
  change: string;
  positive: boolean;
}

export const mockMetrics: MetricCard[] = [
  {
    label: "Avg Quality Score",
    value: "0.84",
    trend: [0.78, 0.81, 0.79, 0.83, 0.82, 0.85, 0.84, 0.86, 0.83, 0.84],
    change: "+3.2%",
    positive: true,
  },
  {
    label: "Avg Latency",
    value: "1.2s",
    trend: [1.8, 1.6, 1.4, 1.3, 1.5, 1.2, 1.1, 1.3, 1.2, 1.2],
    change: "-18%",
    positive: true,
  },
  {
    label: "Failure Rate",
    value: "2.1%",
    trend: [4.2, 3.8, 3.1, 2.9, 2.5, 2.8, 2.3, 2.1, 2.4, 2.1],
    change: "-0.9%",
    positive: true,
  },
  {
    label: "Daily Threads",
    value: "1,847",
    trend: [1200, 1340, 1480, 1520, 1610, 1700, 1780, 1820, 1790, 1847],
    change: "+12%",
    positive: true,
  },
];

export const mockThreads: Thread[] = [
  {
    id: "th_01",
    user: "sarah.chen",
    startedAt: "2 min ago",
    turns: 4,
    duration: "38s",
    score: 0.92,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 2847,
    totalCost: "$0.034",
    messages: [
      { id: "r_01a", role: "human", content: "What's the status of order #4821?", timestamp: "14:32:01" },
      { id: "r_01b", role: "tool_call", content: "lookup_order(order_id=\"4821\")", timestamp: "14:32:02", runId: "run_01b", toolName: "lookup_order", model: "gpt-4o", tokens: { input: 312, output: 28 }, latency: "210ms", cost: "$0.004" },
      { id: "r_01c", role: "tool_response", content: "{\"status\": \"shipped\", \"carrier\": \"FedEx\", \"eta\": \"Aug 27\", \"tracking\": \"7291038421\"}", timestamp: "14:32:02", runId: "run_01c" },
      { id: "r_01d", role: "assistant", content: "Your order #4821 has shipped via FedEx! Expected delivery is August 27th. Your tracking number is 7291038421 — would you like me to send you the tracking link?", timestamp: "14:32:03", runId: "run_01d", model: "gpt-4o", tokens: { input: 587, output: 42 }, latency: "380ms", cost: "$0.008" },
      { id: "r_01e", role: "human", content: "Yes please, and can I change the delivery address?", timestamp: "14:32:18" },
      { id: "r_01f", role: "tool_call", content: "check_address_change(order_id=\"4821\")", timestamp: "14:32:19", runId: "run_01f", toolName: "check_address_change", model: "gpt-4o", tokens: { input: 624, output: 31 }, latency: "190ms", cost: "$0.004" },
      { id: "r_01g", role: "tool_response", content: "{\"eligible\": true, \"deadline\": \"Aug 26 12:00 UTC\"}", timestamp: "14:32:19", runId: "run_01g" },
      { id: "r_01h", role: "assistant", content: "Good news — you can still change the delivery address until tomorrow at noon. Here's the tracking link: https://fedex.com/track/7291038421\n\nWould you like to update the address now?", timestamp: "14:32:20", runId: "run_01h", model: "gpt-4o", tokens: { input: 891, output: 56 }, latency: "420ms", cost: "$0.012" },
    ],
  },
  {
    id: "th_02",
    user: "mike.johnson",
    startedAt: "8 min ago",
    turns: 3,
    duration: "24s",
    score: 0.67,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 1923,
    totalCost: "$0.024",
    messages: [
      { id: "r_02a", role: "human", content: "I want to return my headphones, they're broken", timestamp: "14:26:41" },
      { id: "r_02b", role: "tool_call", content: "find_recent_orders(user=\"mike.johnson\", category=\"electronics\")", timestamp: "14:26:42", runId: "run_02b", toolName: "find_recent_orders", model: "gpt-4o", tokens: { input: 298, output: 34 }, latency: "340ms", cost: "$0.005" },
      { id: "r_02c", role: "tool_response", content: "{\"orders\": [{\"id\": \"3291\", \"item\": \"Sony WH-1000XM5\", \"date\": \"Aug 12\", \"returnable\": true}]}", timestamp: "14:26:42", runId: "run_02c" },
      { id: "r_02d", role: "assistant", content: "I found your Sony WH-1000XM5 headphones from August 12th. I can help you start a return — could you tell me more about what's broken? Is it a hardware defect or a connectivity issue?", timestamp: "14:26:43", runId: "run_02d", model: "gpt-4o", tokens: { input: 512, output: 48 }, latency: "390ms", cost: "$0.007" },
      { id: "r_02e", role: "human", content: "Left ear stopped working completely after a week", timestamp: "14:26:58" },
      { id: "r_02f", role: "assistant", content: "That sounds like a hardware defect. Since you're within the return window, I'll initiate a return with a prepaid shipping label. You'll receive a full refund within 3-5 business days after we receive the item. I'm generating your label now...", timestamp: "14:26:59", runId: "run_02f", model: "gpt-4o", tokens: { input: 687, output: 62 }, latency: "410ms", cost: "$0.009" },
    ],
  },
  {
    id: "th_03",
    user: "emma.watson",
    startedAt: "14 min ago",
    turns: 5,
    duration: "1m 12s",
    score: 0.41,
    status: "failed",
    model: "gpt-4o",
    totalTokens: 4210,
    totalCost: "$0.051",
    messages: [
      { id: "r_03a", role: "human", content: "Can you check if my promo code SAVE20 still works?", timestamp: "14:20:12" },
      { id: "r_03b", role: "tool_call", content: "validate_promo(code=\"SAVE20\", user=\"emma.watson\")", timestamp: "14:20:13", runId: "run_03b", toolName: "validate_promo", model: "gpt-4o", tokens: { input: 276, output: 22 }, latency: "180ms", cost: "$0.003" },
      { id: "r_03c", role: "tool_response", content: "{\"error\": \"TIMEOUT: promo service unavailable\"}", timestamp: "14:20:16", runId: "run_03c" },
      { id: "r_03d", role: "assistant", content: "I'm having trouble checking that promo code right now due to a system issue. Let me try an alternative approach.", timestamp: "14:20:17", runId: "run_03d", model: "gpt-4o", tokens: { input: 389, output: 34 }, latency: "290ms", cost: "$0.005" },
      { id: "r_03e", role: "tool_call", content: "validate_promo(code=\"SAVE20\", user=\"emma.watson\", fallback=true)", timestamp: "14:20:18", runId: "run_03e", toolName: "validate_promo", model: "gpt-4o", tokens: { input: 412, output: 28 }, latency: "5200ms", cost: "$0.005" },
      { id: "r_03f", role: "tool_response", content: "{\"error\": \"TIMEOUT: promo service unavailable\"}", timestamp: "14:20:23", runId: "run_03f" },
      { id: "r_03g", role: "assistant", content: "I apologize, but I'm unable to validate your promo code at the moment. Our promotions system appears to be experiencing an outage. Would you like me to escalate this to a human agent who can manually apply the discount?", timestamp: "14:20:24", runId: "run_03g", model: "gpt-4o", tokens: { input: 521, output: 52 }, latency: "350ms", cost: "$0.007" },
    ],
  },
  {
    id: "th_04",
    user: "james.lee",
    startedAt: "21 min ago",
    turns: 2,
    duration: "12s",
    score: 0.95,
    status: "completed",
    model: "gpt-4o-mini",
    totalTokens: 891,
    totalCost: "$0.004",
    messages: [
      { id: "r_04a", role: "human", content: "What are your store hours this weekend?", timestamp: "14:13:44" },
      { id: "r_04b", role: "assistant", content: "Our weekend hours are:\n- Saturday: 9 AM - 9 PM\n- Sunday: 10 AM - 7 PM\n\nIs there anything else I can help with?", timestamp: "14:13:45", runId: "run_04b", model: "gpt-4o-mini", tokens: { input: 198, output: 38 }, latency: "140ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_05",
    user: "priya.patel",
    startedAt: "29 min ago",
    turns: 6,
    duration: "2m 04s",
    score: 0.78,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 5102,
    totalCost: "$0.062",
    messages: [
      { id: "r_05a", role: "human", content: "I'd like to upgrade my subscription to the Pro plan", timestamp: "14:05:30" },
      { id: "r_05b", role: "tool_call", content: "get_subscription(user=\"priya.patel\")", timestamp: "14:05:31", runId: "run_05b", toolName: "get_subscription", model: "gpt-4o", tokens: { input: 284, output: 26 }, latency: "220ms", cost: "$0.004" },
      { id: "r_05c", role: "tool_response", content: "{\"plan\": \"Basic\", \"billing\": \"monthly\", \"price\": \"$9.99\", \"renewal\": \"Sep 1\"}", timestamp: "14:05:31", runId: "run_05c" },
      { id: "r_05d", role: "assistant", content: "You're currently on the Basic plan ($9.99/mo), renewing September 1st. The Pro plan is $24.99/mo and includes priority support, advanced analytics, and unlimited exports. Would you like to upgrade now? The prorated difference for this billing period would be $12.41.", timestamp: "14:05:32", runId: "run_05d", model: "gpt-4o", tokens: { input: 498, output: 68 }, latency: "440ms", cost: "$0.008" },
      { id: "r_05e", role: "human", content: "Yes, upgrade me", timestamp: "14:05:48" },
      { id: "r_05f", role: "tool_call", content: "upgrade_subscription(user=\"priya.patel\", plan=\"pro\", prorate=true)", timestamp: "14:05:49", runId: "run_05f", toolName: "upgrade_subscription", model: "gpt-4o", tokens: { input: 534, output: 32 }, latency: "680ms", cost: "$0.007" },
      { id: "r_05g", role: "tool_response", content: "{\"success\": true, \"new_plan\": \"Pro\", \"charged\": \"$12.41\", \"next_billing\": \"$24.99 on Sep 1\"}", timestamp: "14:05:50", runId: "run_05g" },
      { id: "r_05h", role: "assistant", content: "Done! You're now on the Pro plan. I've charged $12.41 for the remainder of this billing period, and your next full charge of $24.99 will be on September 1st. You now have access to priority support, advanced analytics, and unlimited exports. Enjoy!", timestamp: "14:05:51", runId: "run_05h", model: "gpt-4o", tokens: { input: 712, output: 72 }, latency: "480ms", cost: "$0.010" },
    ],
  },
  {
    id: "th_06",
    user: "alex.rivera",
    startedAt: "34 min ago",
    turns: 3,
    duration: "19s",
    score: 0.88,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 1654,
    totalCost: "$0.020",
    messages: [
      { id: "r_06a", role: "human", content: "How do I reset my password?", timestamp: "14:00:11" },
      { id: "r_06b", role: "assistant", content: "I can help you reset your password. I'll send a reset link to your registered email address. Would you like me to do that now?", timestamp: "14:00:12", runId: "run_06b", model: "gpt-4o", tokens: { input: 245, output: 32 }, latency: "180ms", cost: "$0.003" },
      { id: "r_06c", role: "human", content: "Yes please", timestamp: "14:00:19" },
      { id: "r_06d", role: "tool_call", content: "send_password_reset(user=\"alex.rivera\")", timestamp: "14:00:20", runId: "run_06d", toolName: "send_password_reset", model: "gpt-4o", tokens: { input: 312, output: 24 }, latency: "320ms", cost: "$0.004" },
      { id: "r_06e", role: "tool_response", content: "{\"sent\": true, \"email\": \"a***a@email.com\"}", timestamp: "14:00:20", runId: "run_06e" },
      { id: "r_06f", role: "assistant", content: "Done! I've sent a password reset link to a***a@email.com. It'll expire in 30 minutes. Check your spam folder if you don't see it in a few minutes.", timestamp: "14:00:21", runId: "run_06f", model: "gpt-4o", tokens: { input: 478, output: 44 }, latency: "290ms", cost: "$0.006" },
    ],
  },
  {
    id: "th_07",
    user: "jordan.smith",
    startedAt: "41 min ago",
    turns: 4,
    duration: "52s",
    score: 0.73,
    status: "in_progress",
    model: "gpt-4o",
    totalTokens: 3201,
    totalCost: "$0.039",
    messages: [
      { id: "r_07a", role: "human", content: "I'm being charged twice for my last order", timestamp: "13:53:22" },
      { id: "r_07b", role: "tool_call", content: "get_payment_history(user=\"jordan.smith\", last=5)", timestamp: "13:53:23", runId: "run_07b", toolName: "get_payment_history", model: "gpt-4o", tokens: { input: 301, output: 30 }, latency: "280ms", cost: "$0.004" },
      { id: "r_07c", role: "tool_response", content: "{\"payments\": [{\"id\": \"pay_891\", \"amount\": \"$47.99\", \"date\": \"Aug 22\", \"status\": \"completed\"}, {\"id\": \"pay_892\", \"amount\": \"$47.99\", \"date\": \"Aug 22\", \"status\": \"pending\"}]}", timestamp: "13:53:23", runId: "run_07c" },
      { id: "r_07d", role: "assistant", content: "I can see two charges of $47.99 on August 22nd — one completed and one still pending. The pending charge is likely a temporary authorization hold that should drop off within 3-5 business days. However, if both charges fully process, I can initiate a refund for the duplicate. Would you like me to monitor this and refund automatically if it settles?", timestamp: "13:53:24", runId: "run_07d", model: "gpt-4o", tokens: { input: 612, output: 78 }, latency: "520ms", cost: "$0.009" },
    ],
  },
  {
    id: "th_08",
    user: "nina.kowalski",
    startedAt: "55 min ago",
    turns: 2,
    duration: "8s",
    score: 0.96,
    status: "completed",
    model: "gpt-4o-mini",
    totalTokens: 634,
    totalCost: "$0.002",
    messages: [
      { id: "r_08a", role: "human", content: "Do you offer free shipping?", timestamp: "13:39:44" },
      { id: "r_08b", role: "assistant", content: "Yes! We offer free standard shipping on all orders over $35. Orders under $35 have a flat $4.99 shipping fee. Express shipping (1-2 days) is available for $9.99 regardless of order total.", timestamp: "13:39:45", runId: "run_08b", model: "gpt-4o-mini", tokens: { input: 176, output: 52 }, latency: "120ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_09",
    user: "carlos.mendez",
    startedAt: "1h 12m ago",
    turns: 5,
    duration: "1m 38s",
    score: 0.55,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 4890,
    totalCost: "$0.059",
    messages: [
      { id: "r_09a", role: "human", content: "My package says delivered but I never got it", timestamp: "13:22:01" },
      { id: "r_09b", role: "tool_call", content: "get_delivery_details(user=\"carlos.mendez\", status=\"delivered\")", timestamp: "13:22:02", runId: "run_09b", toolName: "get_delivery_details", model: "gpt-4o", tokens: { input: 298, output: 28 }, latency: "240ms", cost: "$0.004" },
      { id: "r_09c", role: "tool_response", content: "{\"order\": \"5021\", \"carrier\": \"USPS\", \"delivered_at\": \"Aug 24 14:22\", \"location\": \"Front door\", \"photo\": null}", timestamp: "13:22:02", runId: "run_09c" },
      { id: "r_09d", role: "assistant", content: "I can see your order #5021 was marked as delivered by USPS on August 24th at 2:22 PM to your front door, but there's no delivery photo available. I'm sorry you haven't received it. Let me check a few things — have you checked with neighbors or your building's package room?", timestamp: "13:22:03", runId: "run_09d", model: "gpt-4o", tokens: { input: 521, output: 64 }, latency: "410ms", cost: "$0.007" },
      { id: "r_09e", role: "human", content: "Yes I checked everywhere, it's not here", timestamp: "13:22:28" },
      { id: "r_09f", role: "tool_call", content: "file_missing_package_claim(order=\"5021\", user=\"carlos.mendez\")", timestamp: "13:22:29", runId: "run_09f", toolName: "file_missing_package_claim", model: "gpt-4o", tokens: { input: 589, output: 34 }, latency: "560ms", cost: "$0.008" },
      { id: "r_09g", role: "tool_response", content: "{\"claim_id\": \"CLM-8821\", \"status\": \"filed\", \"resolution_eta\": \"48 hours\"}", timestamp: "13:22:30", runId: "run_09g" },
      { id: "r_09h", role: "assistant", content: "I've filed a missing package claim (CLM-8821). Our team will investigate and you'll hear back within 48 hours with either a replacement shipment or a full refund. Is there anything else I can help with?", timestamp: "13:22:31", runId: "run_09h", model: "gpt-4o", tokens: { input: 734, output: 58 }, latency: "380ms", cost: "$0.010" },
    ],
  },
  {
    id: "th_10",
    user: "lisa.wong",
    startedAt: "1h 28m ago",
    turns: 3,
    duration: "22s",
    score: 0.89,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 1876,
    totalCost: "$0.023",
    messages: [
      { id: "r_10a", role: "human", content: "Can I add a gift message to order #6104?", timestamp: "13:06:33" },
      { id: "r_10b", role: "tool_call", content: "get_order(order_id=\"6104\")", timestamp: "13:06:34", runId: "run_10b", toolName: "get_order", model: "gpt-4o", tokens: { input: 267, output: 24 }, latency: "190ms", cost: "$0.003" },
      { id: "r_10c", role: "tool_response", content: "{\"id\": \"6104\", \"status\": \"processing\", \"gift_message\": null, \"editable\": true}", timestamp: "13:06:34", runId: "run_10c" },
      { id: "r_10d", role: "assistant", content: "Absolutely! Your order #6104 is still being processed so I can add a gift message. What would you like it to say?", timestamp: "13:06:35", runId: "run_10d", model: "gpt-4o", tokens: { input: 412, output: 34 }, latency: "260ms", cost: "$0.005" },
      { id: "r_10e", role: "human", content: "Happy Birthday Mom! Love, Lisa", timestamp: "13:06:48" },
      { id: "r_10f", role: "tool_call", content: "update_order(order_id=\"6104\", gift_message=\"Happy Birthday Mom! Love, Lisa\")", timestamp: "13:06:49", runId: "run_10f", toolName: "update_order", model: "gpt-4o", tokens: { input: 456, output: 28 }, latency: "310ms", cost: "$0.006" },
      { id: "r_10g", role: "tool_response", content: "{\"updated\": true}", timestamp: "13:06:49", runId: "run_10g" },
      { id: "r_10h", role: "assistant", content: "Done! I've added \"Happy Birthday Mom! Love, Lisa\" as the gift message on order #6104. It'll be printed on a card included with the package.", timestamp: "13:06:50", runId: "run_10h", model: "gpt-4o", tokens: { input: 534, output: 38 }, latency: "240ms", cost: "$0.006" },
    ],
  },
  {
    id: "th_11", user: "david.park", startedAt: "1h 35m ago", turns: 2, duration: "9s", score: 0.91, status: "completed", model: "gpt-4o-mini", totalTokens: 710, totalCost: "$0.003",
    messages: [
      { id: "r_11a", role: "human", content: "What's your return policy?", timestamp: "12:59:10" },
      { id: "r_11b", role: "assistant", content: "You can return any item within 30 days of delivery for a full refund. Items must be unused and in original packaging.", timestamp: "12:59:11", runId: "run_11b", model: "gpt-4o-mini", tokens: { input: 182, output: 44 }, latency: "130ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_12", user: "rachel.green", startedAt: "1h 42m ago", turns: 4, duration: "45s", score: 0.76, status: "completed", model: "gpt-4o", totalTokens: 3120, totalCost: "$0.038",
    messages: [
      { id: "r_12a", role: "human", content: "I need to cancel my subscription", timestamp: "12:52:18" },
      { id: "r_12b", role: "tool_call", content: "get_subscription(user=\"rachel.green\")", timestamp: "12:52:19", runId: "run_12b", toolName: "get_subscription", model: "gpt-4o", tokens: { input: 276, output: 28 }, latency: "200ms", cost: "$0.004" },
      { id: "r_12c", role: "tool_response", content: "{\"plan\": \"Pro\", \"billing\": \"annual\", \"renewal\": \"Nov 15\"}", timestamp: "12:52:19", runId: "run_12c" },
      { id: "r_12d", role: "assistant", content: "You're on the annual Pro plan, renewing November 15th. I can cancel it — you'll keep access until the renewal date. Want to proceed?", timestamp: "12:52:20", runId: "run_12d", model: "gpt-4o", tokens: { input: 498, output: 42 }, latency: "310ms", cost: "$0.007" },
    ],
  },
  {
    id: "th_13", user: "tom.hanks", startedAt: "1h 58m ago", turns: 3, duration: "28s", score: 0.83, status: "completed", model: "gpt-4o", totalTokens: 2240, totalCost: "$0.027",
    messages: [
      { id: "r_13a", role: "human", content: "Do you have the Air Max 90 in size 11?", timestamp: "12:36:02" },
      { id: "r_13b", role: "tool_call", content: "check_inventory(sku=\"AM90\", size=\"11\")", timestamp: "12:36:03", runId: "run_13b", toolName: "check_inventory", model: "gpt-4o", tokens: { input: 264, output: 24 }, latency: "180ms", cost: "$0.003" },
      { id: "r_13c", role: "tool_response", content: "{\"in_stock\": true, \"colors\": [\"white\", \"black\", \"infrared\"], \"price\": \"$130\"}", timestamp: "12:36:03", runId: "run_13c" },
      { id: "r_13d", role: "assistant", content: "Yes! The Air Max 90 in size 11 is available in white, black, and infrared at $130. Want me to add one to your cart?", timestamp: "12:36:04", runId: "run_13d", model: "gpt-4o", tokens: { input: 487, output: 38 }, latency: "280ms", cost: "$0.006" },
    ],
  },
  {
    id: "th_14", user: "maya.singh", startedAt: "2h 5m ago", turns: 2, duration: "6s", score: 0.97, status: "completed", model: "gpt-4o-mini", totalTokens: 520, totalCost: "$0.002",
    messages: [
      { id: "r_14a", role: "human", content: "Is there a student discount?", timestamp: "12:29:44" },
      { id: "r_14b", role: "assistant", content: "Yes — verified students get 15% off with a valid .edu email. Apply at checkout with code STUDENT15.", timestamp: "12:29:45", runId: "run_14b", model: "gpt-4o-mini", tokens: { input: 164, output: 36 }, latency: "110ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_15", user: "ben.wright", startedAt: "2h 18m ago", turns: 5, duration: "1m 22s", score: 0.48, status: "failed", model: "gpt-4o", totalTokens: 4680, totalCost: "$0.057",
    messages: [
      { id: "r_15a", role: "human", content: "I was charged for an item I already returned", timestamp: "12:16:33" },
      { id: "r_15b", role: "tool_call", content: "get_returns(user=\"ben.wright\")", timestamp: "12:16:34", runId: "run_15b", toolName: "get_returns", model: "gpt-4o", tokens: { input: 278, output: 26 }, latency: "220ms", cost: "$0.004" },
      { id: "r_15c", role: "tool_response", content: "{\"error\": \"SERVICE_UNAVAILABLE\"}", timestamp: "12:16:37", runId: "run_15c" },
      { id: "r_15d", role: "assistant", content: "I'm sorry, I'm having trouble accessing your return records. Let me try again.", timestamp: "12:16:38", runId: "run_15d", model: "gpt-4o", tokens: { input: 412, output: 28 }, latency: "240ms", cost: "$0.005" },
      { id: "r_15e", role: "tool_call", content: "get_returns(user=\"ben.wright\", retry=true)", timestamp: "12:16:39", runId: "run_15e", toolName: "get_returns", model: "gpt-4o", tokens: { input: 436, output: 28 }, latency: "4800ms", cost: "$0.006" },
      { id: "r_15f", role: "tool_response", content: "{\"error\": \"TIMEOUT\"}", timestamp: "12:16:44", runId: "run_15f" },
      { id: "r_15g", role: "assistant", content: "I apologize — our returns system is currently down. I'd recommend contacting us again in an hour, or I can escalate this to a human agent now.", timestamp: "12:16:45", runId: "run_15g", model: "gpt-4o", tokens: { input: 587, output: 46 }, latency: "340ms", cost: "$0.008" },
    ],
  },
  {
    id: "th_16", user: "olivia.martinez", startedAt: "2h 31m ago", turns: 3, duration: "18s", score: 0.90, status: "completed", model: "gpt-4o", totalTokens: 1890, totalCost: "$0.023",
    messages: [
      { id: "r_16a", role: "human", content: "Can I get an invoice for order #7720?", timestamp: "12:03:11" },
      { id: "r_16b", role: "tool_call", content: "generate_invoice(order_id=\"7720\")", timestamp: "12:03:12", runId: "run_16b", toolName: "generate_invoice", model: "gpt-4o", tokens: { input: 256, output: 22 }, latency: "340ms", cost: "$0.003" },
      { id: "r_16c", role: "tool_response", content: "{\"url\": \"https://store.example.com/invoices/7720.pdf\"}", timestamp: "12:03:12", runId: "run_16c" },
      { id: "r_16d", role: "assistant", content: "Here's your invoice: https://store.example.com/invoices/7720.pdf — it includes the full order breakdown and tax details.", timestamp: "12:03:13", runId: "run_16d", model: "gpt-4o", tokens: { input: 434, output: 36 }, latency: "260ms", cost: "$0.006" },
    ],
  },
  {
    id: "th_17", user: "kevin.zhao", startedAt: "2h 45m ago", turns: 2, duration: "11s", score: 0.85, status: "completed", model: "gpt-4o-mini", totalTokens: 680, totalCost: "$0.003",
    messages: [
      { id: "r_17a", role: "human", content: "When will the new colorways drop?", timestamp: "11:49:22" },
      { id: "r_17b", role: "assistant", content: "The Fall 2026 collection drops September 4th at 10 AM ET. Sign up for notifications at store.example.com/drops to get early access.", timestamp: "11:49:23", runId: "run_17b", model: "gpt-4o-mini", tokens: { input: 178, output: 48 }, latency: "140ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_18", user: "aisha.kumar", startedAt: "3h 2m ago", turns: 4, duration: "34s", score: 0.72, status: "completed", model: "gpt-4o", totalTokens: 2890, totalCost: "$0.035",
    messages: [
      { id: "r_18a", role: "human", content: "My order arrived damaged", timestamp: "11:32:44" },
      { id: "r_18b", role: "assistant", content: "I'm sorry to hear that. Could you share your order number and a photo of the damage? I'll get a replacement started right away.", timestamp: "11:32:45", runId: "run_18b", model: "gpt-4o", tokens: { input: 234, output: 38 }, latency: "220ms", cost: "$0.004" },
      { id: "r_18c", role: "human", content: "Order #8842, the box was crushed and the item inside is cracked", timestamp: "11:33:02" },
      { id: "r_18d", role: "tool_call", content: "create_replacement(order_id=\"8842\", reason=\"damaged_in_transit\")", timestamp: "11:33:03", runId: "run_18d", toolName: "create_replacement", model: "gpt-4o", tokens: { input: 478, output: 30 }, latency: "420ms", cost: "$0.006" },
      { id: "r_18e", role: "tool_response", content: "{\"replacement_order\": \"8843\", \"eta\": \"Aug 29\"}", timestamp: "11:33:03", runId: "run_18e" },
      { id: "r_18f", role: "assistant", content: "Done — replacement order #8843 is on its way and should arrive by August 29th. No need to return the damaged item.", timestamp: "11:33:04", runId: "run_18f", model: "gpt-4o", tokens: { input: 612, output: 42 }, latency: "300ms", cost: "$0.008" },
    ],
  },
  {
    id: "th_19", user: "lucas.ferreira", startedAt: "3h 15m ago", turns: 2, duration: "7s", score: 0.93, status: "completed", model: "gpt-4o-mini", totalTokens: 590, totalCost: "$0.002",
    messages: [
      { id: "r_19a", role: "human", content: "Do you ship to Brazil?", timestamp: "11:19:55" },
      { id: "r_19b", role: "assistant", content: "Yes, we ship to Brazil! Standard international shipping takes 10-14 business days and costs $19.99. Express (5-7 days) is $34.99.", timestamp: "11:19:56", runId: "run_19b", model: "gpt-4o-mini", tokens: { input: 170, output: 42 }, latency: "120ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_20", user: "sophie.anderson", startedAt: "3h 28m ago", turns: 3, duration: "21s", score: 0.86, status: "completed", model: "gpt-4o", totalTokens: 1740, totalCost: "$0.021",
    messages: [
      { id: "r_20a", role: "human", content: "How do I use my gift card?", timestamp: "11:06:33" },
      { id: "r_20b", role: "assistant", content: "At checkout, enter the 16-digit code from the back of your gift card in the 'Gift Card or Promo Code' field. The balance will be applied automatically. Any remaining balance stays on the card for future purchases.", timestamp: "11:06:34", runId: "run_20b", model: "gpt-4o", tokens: { input: 198, output: 52 }, latency: "240ms", cost: "$0.004" },
      { id: "r_20c", role: "human", content: "Can I use it with a promo code?", timestamp: "11:06:48" },
      { id: "r_20d", role: "assistant", content: "Yes! Gift cards and promo codes stack — apply both at checkout. The promo discount applies first, then the gift card covers the remaining total.", timestamp: "11:06:49", runId: "run_20d", model: "gpt-4o", tokens: { input: 342, output: 38 }, latency: "200ms", cost: "$0.005" },
    ],
  },
  {
    id: "th_21", user: "ethan.moore", startedAt: "3h 40m ago", turns: 2, duration: "8s", score: 0.94, status: "completed", model: "gpt-4o-mini", totalTokens: 620, totalCost: "$0.002",
    messages: [
      { id: "r_21a", role: "human", content: "What payment methods do you accept?", timestamp: "10:54:11" },
      { id: "r_21b", role: "assistant", content: "We accept Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, PayPal, and Klarna (pay in 4 installments).", timestamp: "10:54:12", runId: "run_21b", model: "gpt-4o-mini", tokens: { input: 174, output: 40 }, latency: "115ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_22", user: "maria.costa", startedAt: "3h 55m ago", turns: 4, duration: "42s", score: 0.61, status: "completed", model: "gpt-4o", totalTokens: 3340, totalCost: "$0.041",
    messages: [
      { id: "r_22a", role: "human", content: "Why was my order cancelled?", timestamp: "10:39:22" },
      { id: "r_22b", role: "tool_call", content: "get_order_history(user=\"maria.costa\", status=\"cancelled\")", timestamp: "10:39:23", runId: "run_22b", toolName: "get_order_history", model: "gpt-4o", tokens: { input: 288, output: 28 }, latency: "260ms", cost: "$0.004" },
      { id: "r_22c", role: "tool_response", content: "{\"order\": \"9102\", \"reason\": \"payment_declined\", \"card_last4\": \"4821\"}", timestamp: "10:39:23", runId: "run_22c" },
      { id: "r_22d", role: "assistant", content: "Order #9102 was cancelled because the payment on your card ending in 4821 was declined. This is usually due to insufficient funds or the card issuer blocking the transaction. Would you like to retry with a different payment method?", timestamp: "10:39:24", runId: "run_22d", model: "gpt-4o", tokens: { input: 512, output: 56 }, latency: "380ms", cost: "$0.007" },
      { id: "r_22e", role: "human", content: "Can you try my other card on file?", timestamp: "10:39:38" },
      { id: "r_22f", role: "assistant", content: "For security, I can't retry payment on your behalf. But I can re-create the order — just head to your cart where the items are still saved, and select your other card at checkout. Everything will be ready for you.", timestamp: "10:39:39", runId: "run_22f", model: "gpt-4o", tokens: { input: 634, output: 52 }, latency: "320ms", cost: "$0.009" },
    ],
  },
  {
    id: "th_23", user: "noah.kim", startedAt: "4h 8m ago", turns: 2, duration: "10s", score: 0.88, status: "completed", model: "gpt-4o-mini", totalTokens: 740, totalCost: "$0.003",
    messages: [
      { id: "r_23a", role: "human", content: "How do I track my order?", timestamp: "10:26:05" },
      { id: "r_23b", role: "assistant", content: "Go to store.example.com/orders and sign in, or check the shipping confirmation email — it has a tracking link directly from the carrier. You can also just tell me your order number and I'll look it up for you.", timestamp: "10:26:06", runId: "run_23b", model: "gpt-4o-mini", tokens: { input: 186, output: 54 }, latency: "145ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_24", user: "chloe.dubois", startedAt: "4h 22m ago", turns: 3, duration: "26s", score: 0.81, status: "in_progress", model: "gpt-4o", totalTokens: 2100, totalCost: "$0.025",
    messages: [
      { id: "r_24a", role: "human", content: "I want to exchange my jacket for a larger size", timestamp: "10:12:44" },
      { id: "r_24b", role: "tool_call", content: "find_recent_orders(user=\"chloe.dubois\", category=\"apparel\")", timestamp: "10:12:45", runId: "run_24b", toolName: "find_recent_orders", model: "gpt-4o", tokens: { input: 282, output: 28 }, latency: "240ms", cost: "$0.004" },
      { id: "r_24c", role: "tool_response", content: "{\"orders\": [{\"id\": \"9330\", \"item\": \"Puffer Jacket - M\", \"exchangeable\": true}]}", timestamp: "10:12:45", runId: "run_24c" },
      { id: "r_24d", role: "assistant", content: "I found your Puffer Jacket in Medium from order #9330. I can set up an exchange for a Large — we'll send the new size and include a prepaid return label for the Medium. Want me to go ahead?", timestamp: "10:12:46", runId: "run_24d", model: "gpt-4o", tokens: { input: 498, output: 48 }, latency: "340ms", cost: "$0.007" },
    ],
  },
];
