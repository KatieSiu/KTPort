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
  spanType?: "llm" | "tool" | "chain" | "retriever" | "function" | "embedding" | "parser";
}

export interface EvalMetric {
  id: string;
  label: string;
  score: number;
  trend: number[];
  evaluatorId?: string;
}

export interface Thread {
  id: string;
  name: string;
  user: string;
  startedAt: string;
  turns: number;
  duration: string;
  score: number;
  status: "completed" | "failed" | "in_progress";
  model: string;
  totalTokens: number;
  totalCost: string;
  properties: string;
  environment: "Production" | "Staging";
  traceId: string;
  userId: string;
  threadId: string;
  metric: string;
  evalMetrics: EvalMetric[];
  notes: string[];
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
    label: "Total Traces",
    value: "14,200",
    trend: [9800, 10100, 11400, 10900, 12300, 12800, 11900, 13200, 13800, 14200],
    change: "",
    positive: true,
  },
  {
    label: "P95 Latency",
    value: "840ms",
    trend: [1120, 960, 1080, 920, 1010, 870, 940, 860, 890, 840],
    change: "",
    positive: true,
  },
  {
    label: "Avg Factuality Rate",
    value: "94.2%",
    trend: [88.5, 89.2, 90.8, 92.1, 91.4, 92.6, 93.0, 93.5, 93.9, 94.2],
    change: "",
    positive: true,
  },
  {
    label: "Low Score Rate",
    value: "4.2%",
    trend: [8.1, 6.2, 7.4, 5.5, 6.8, 4.9, 5.6, 4.4, 5.1, 4.2],
    change: "",
    positive: false,
  },
  {
    label: "Total Cost",
    value: "$20.10",
    trend: [14.20, 15.10, 14.80, 16.30, 17.50, 16.90, 18.40, 19.10, 18.70, 20.10],
    change: "",
    positive: true,
  },
];

// Eval metric sets grouped by trace context -- labels match evaluator names on the evaluator page
const coreEvals: EvalMetric[] = [
  { id: "em_01", label: "Faithfulness", score: 0.96, trend: [0.88, 0.91, 0.93, 0.94, 0.95, 0.96], evaluatorId: "ev_01" },
  { id: "em_02", label: "Answer_relevance", score: 0.92, trend: [0.85, 0.87, 0.89, 0.90, 0.91, 0.92], evaluatorId: "ev_02" },
  { id: "em_03", label: "Coherence", score: 0.94, trend: [0.86, 0.89, 0.91, 0.92, 0.93, 0.94], evaluatorId: "ev_06" },
  { id: "em_04", label: "Conciseness", score: 0.89, trend: [0.78, 0.81, 0.84, 0.86, 0.88, 0.89], evaluatorId: "ev_08" },
  { id: "em_05", label: "PII_redaction_guard", score: 1.00, trend: [0.98, 0.99, 0.99, 1.00, 1.00, 1.00], evaluatorId: "ev_13" },
  { id: "em_06", label: "Toxicity_classifier", score: 0.99, trend: [0.96, 0.97, 0.98, 0.98, 0.99, 0.99], evaluatorId: "ev_27" },
];

// Traces involving tool use (lookups, checks) get tool-specific evals
const toolUseEvals: EvalMetric[] = [
  ...coreEvals,
  { id: "em_07", label: "Tool_use_correctness", score: 0.95, trend: [0.88, 0.90, 0.92, 0.93, 0.94, 0.95], evaluatorId: "ev_12" },
  { id: "em_08", label: "Instruction_adherence", score: 0.97, trend: [0.91, 0.93, 0.94, 0.95, 0.96, 0.97], evaluatorId: "ev_07" },
  { id: "em_09", label: "Latency_budget", score: 0.91, trend: [0.82, 0.85, 0.87, 0.89, 0.90, 0.91], evaluatorId: "ev_16" },
];

// Traces with policy/billing context get compliance evals
const complianceEvals: EvalMetric[] = [
  ...coreEvals,
  { id: "em_10", label: "Compliance_checker", score: 0.98, trend: [0.91, 0.93, 0.95, 0.96, 0.97, 0.98], evaluatorId: "ev_32" },
  { id: "em_11", label: "Tone_consistency", score: 0.93, trend: [0.84, 0.87, 0.89, 0.91, 0.92, 0.93], evaluatorId: "ev_09" },
  { id: "em_12", label: "Prompt_injection_shield", score: 1.00, trend: [0.97, 0.98, 0.99, 0.99, 1.00, 1.00], evaluatorId: "ev_30" },
];

// Multi-turn conversations get memory/context evals
const multiTurnEvals: EvalMetric[] = [
  ...coreEvals,
  { id: "em_13", label: "Multi_turn_memory", score: 0.88, trend: [0.76, 0.80, 0.83, 0.85, 0.87, 0.88], evaluatorId: "ev_10" },
  { id: "em_14", label: "Context_precision", score: 0.91, trend: [0.82, 0.85, 0.87, 0.89, 0.90, 0.91], evaluatorId: "ev_04" },
  { id: "em_15", label: "Tone_consistency", score: 0.90, trend: [0.81, 0.84, 0.86, 0.88, 0.89, 0.90], evaluatorId: "ev_09" },
];

// Failed/low-score traces get a broader set including hallucination
const failedTraceEvals: EvalMetric[] = [
  { id: "em_01", label: "Faithfulness", score: 0.52, trend: [0.71, 0.65, 0.60, 0.56, 0.53, 0.52], evaluatorId: "ev_01" },
  { id: "em_02", label: "Answer_relevance", score: 0.61, trend: [0.78, 0.72, 0.68, 0.65, 0.63, 0.61], evaluatorId: "ev_02" },
  { id: "em_16", label: "Hallucination_detector", score: 0.44, trend: [0.68, 0.58, 0.52, 0.48, 0.45, 0.44], evaluatorId: "ev_03" },
  { id: "em_03", label: "Coherence", score: 0.71, trend: [0.82, 0.79, 0.76, 0.74, 0.72, 0.71], evaluatorId: "ev_06" },
  { id: "em_05", label: "PII_redaction_guard", score: 1.00, trend: [0.99, 1.00, 1.00, 1.00, 1.00, 1.00], evaluatorId: "ev_13" },
  { id: "em_06", label: "Toxicity_classifier", score: 0.97, trend: [0.94, 0.95, 0.96, 0.96, 0.97, 0.97], evaluatorId: "ev_27" },
  { id: "em_10", label: "Compliance_checker", score: 0.85, trend: [0.90, 0.88, 0.87, 0.86, 0.85, 0.85], evaluatorId: "ev_32" },
];

// Map thread properties to eval sets
function getEvalsForThread(props: string, status: string, turns: number): EvalMetric[] {
  if (status === "failed") return failedTraceEvals;
  if (turns >= 4) return multiTurnEvals;
  if (props === "Billing" || props === "Returns") return complianceEvals;
  if (props === "Shipping" || props === "Account") return toolUseEvals;
  return coreEvals;
}

const userIds = ["usr_sarah_chen", "usr_mike_johnson", "usr_emma_watson", "usr_priya_patel", "usr_alex_rivera", "usr_jordan_smith", "usr_david_park", "usr_rachel_green", "usr_tom_hanks", "usr_maya_singh", "usr_ben_wright", "usr_olivia_martinez", "usr_kevin_zhao", "usr_aisha_kumar", "usr_lucas_ferreira", "usr_sophie_anderson", "usr_ethan_moore", "usr_maria_costa", "usr_noah_kim", "usr_chloe_dubois"];

export const mockThreads: Thread[] = [
  {
    id: "th_01",
    name: "Order lookup",
    user: "sarah.chen",
    startedAt: "2 min ago",
    turns: 4,
    duration: "38s",
    score: 0.92,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 2847,
    totalCost: "$0.034",
    properties: "Shipping",
    environment: "Production",
    traceId: "12324554321",
    userId: "usr_sarah_chen",
    threadId: "9120938",
    metric: "end-to-end metrics",
    evalMetrics: toolUseEvals,
    notes: ["Customer confirmed address change went through successfully. Flagged as positive resolution example for training set."],
    messages: [
      { id: "r_01a", role: "human", content: "What's the status of order #4821?", timestamp: "14:32:01" },
      { id: "r_01b", role: "tool_call", content: "lookup_order(order_id=\"4821\")", timestamp: "14:32:02", runId: "run_01b", toolName: "lookup_order", latency: "210ms", cost: "$0.004", spanType: "tool" },
      { id: "r_01b2", role: "tool_call", content: "retrieve_shipping_policy(carrier=\"FedEx\")", timestamp: "14:32:02", runId: "run_01b2", toolName: "retrieve_shipping_policy", latency: "140ms", cost: "$0.001", spanType: "retriever" },
      { id: "r_01c", role: "tool_response", content: "{\"status\": \"shipped\", \"carrier\": \"FedEx\", \"eta\": \"Aug 27\", \"tracking\": \"7291038421\"}", timestamp: "14:32:02", runId: "run_01c" },
      { id: "r_01d", role: "assistant", content: "Your order #4821 has shipped via FedEx! Expected delivery is August 27th. Your tracking number is 7291038421 — would you like me to send you the tracking link?", timestamp: "14:32:03", runId: "run_01d", model: "gpt-4o", tokens: { input: 587, output: 42 }, latency: "380ms", cost: "$0.008", spanType: "llm" },
      { id: "r_01e", role: "human", content: "Yes please, and can I change the delivery address?", timestamp: "14:32:18" },
      { id: "r_01f", role: "tool_call", content: "check_address_change(order_id=\"4821\")", timestamp: "14:32:19", runId: "run_01f", toolName: "check_address_change", latency: "190ms", cost: "$0.004", spanType: "tool" },
      { id: "r_01f2", role: "tool_call", content: "check_delivery_window(tracking=\"7291038421\")", timestamp: "14:32:19", runId: "run_01f2", toolName: "check_delivery_window", latency: "160ms", cost: "$0.002", spanType: "tool" },
      { id: "r_01f3", role: "tool_call", content: "generate_tracking_link(carrier=\"FedEx\", id=\"7291038421\")", timestamp: "14:32:19", runId: "run_01f3", toolName: "generate_tracking_link", latency: "45ms", cost: "$0.000", spanType: "function" },
      { id: "r_01g", role: "tool_response", content: "{\"eligible\": true, \"deadline\": \"Aug 26 12:00 UTC\"}", timestamp: "14:32:19", runId: "run_01g" },
      { id: "r_01h", role: "assistant", content: "Good news — you can still change the delivery address until tomorrow at noon. Here's the tracking link: https://fedex.com/track/7291038421\n\nWould you like to update the address now?", timestamp: "14:32:20", runId: "run_01h", model: "gpt-4o", tokens: { input: 891, output: 56 }, latency: "420ms", cost: "$0.012", spanType: "llm" },
    ],
  },
  {
    id: "th_02",
    name: "Return request",
    user: "mike.johnson",
    startedAt: "8 min ago",
    turns: 3,
    duration: "24s",
    score: 0.67,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 1923,
    totalCost: "$0.024",
    properties: "Returns",
    environment: "Production",
    traceId: "12324554322",
    messages: [
      { id: "r_02a", role: "human", content: "I want to return my headphones, they're broken", timestamp: "14:26:41" },
      { id: "r_02b", role: "tool_call", content: "find_recent_orders(user=\"mike.johnson\", category=\"electronics\")", timestamp: "14:26:42", runId: "run_02b", toolName: "find_recent_orders", latency: "340ms", cost: "$0.005", spanType: "tool" },
      { id: "r_02b2", role: "tool_call", content: "check_return_policy(product_type=\"headphones\")", timestamp: "14:26:42", runId: "run_02b2", toolName: "check_return_policy", latency: "120ms", cost: "$0.001", spanType: "retriever" },
      { id: "r_02c", role: "tool_response", content: "{\"orders\": [{\"id\": \"3291\", \"item\": \"Sony WH-1000XM5\", \"date\": \"Aug 12\", \"returnable\": true}]}", timestamp: "14:26:42", runId: "run_02c" },
      { id: "r_02d", role: "assistant", content: "I found your Sony WH-1000XM5 headphones from August 12th. I can help you start a return — could you tell me more about what's broken? Is it a hardware defect or a connectivity issue?", timestamp: "14:26:43", runId: "run_02d", model: "gpt-4o", tokens: { input: 512, output: 48 }, latency: "390ms", cost: "$0.007", spanType: "llm" },
      { id: "r_02e", role: "human", content: "Left ear stopped working completely after a week", timestamp: "14:26:58" },
      { id: "r_02f1", role: "tool_call", content: "classify_defect(description=\"left ear stopped working\")", timestamp: "14:26:59", runId: "run_02f1", toolName: "classify_defect", latency: "280ms", cost: "$0.003", spanType: "function" },
      { id: "r_02f2", role: "tool_call", content: "initiate_return(order_id=\"3291\", reason=\"hardware_defect\")", timestamp: "14:26:59", runId: "run_02f2", toolName: "initiate_return", latency: "450ms", cost: "$0.002", spanType: "tool" },
      { id: "r_02f3", role: "tool_call", content: "generate_shipping_label(order_id=\"3291\", carrier=\"UPS\")", timestamp: "14:27:00", runId: "run_02f3", toolName: "generate_shipping_label", latency: "620ms", cost: "$0.001", spanType: "tool" },
      { id: "r_02f4", role: "tool_response", content: "{\"return_id\": \"RET-8821\", \"label_url\": \"https://ups.com/label/RET-8821\"}", timestamp: "14:27:00", runId: "run_02f4" },
      { id: "r_02f", role: "assistant", content: "That sounds like a hardware defect. Since you're within the return window, I'll initiate a return with a prepaid shipping label. You'll receive a full refund within 3-5 business days after we receive the item. I'm generating your label now...", timestamp: "14:27:01", runId: "run_02f", model: "gpt-4o", tokens: { input: 687, output: 62 }, latency: "410ms", cost: "$0.009", spanType: "llm" },
    ],
  },
  {
    id: "th_03",
    name: "Promo validation",
    user: "emma.watson",
    startedAt: "14 min ago",
    turns: 5,
    duration: "1m 12s",
    score: 0.41,
    status: "failed",
    model: "gpt-4o",
    totalTokens: 4210,
    totalCost: "$0.051",
    properties: "Billing",
    environment: "Production",
    traceId: "12324554323",
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
    name: "Store hours",
    user: "james.lee",
    startedAt: "21 min ago",
    turns: 2,
    duration: "12s",
    score: 0.95,
    status: "completed",
    model: "gpt-4o-mini",
    totalTokens: 891,
    totalCost: "$0.004",
    properties: "Account",
    environment: "Production",
    traceId: "12324554324",
    messages: [
      { id: "r_04a", role: "human", content: "What are your store hours this weekend?", timestamp: "14:13:44" },
      { id: "r_04b", role: "assistant", content: "Our weekend hours are:\n- Saturday: 9 AM - 9 PM\n- Sunday: 10 AM - 7 PM\n\nIs there anything else I can help with?", timestamp: "14:13:45", runId: "run_04b", model: "gpt-4o-mini", tokens: { input: 198, output: 38 }, latency: "140ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_05",
    name: "Subscription upgrade",
    user: "priya.patel",
    startedAt: "29 min ago",
    turns: 6,
    duration: "2m 04s",
    score: 0.78,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 5102,
    totalCost: "$0.062",
    properties: "Billing",
    environment: "Production",
    traceId: "12324554325",
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
    name: "Password reset",
    user: "alex.rivera",
    startedAt: "34 min ago",
    turns: 3,
    duration: "19s",
    score: 0.88,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 1654,
    totalCost: "$0.020",
    properties: "Account",
    environment: "Production",
    traceId: "12324554326",
    messages: [
      { id: "r_06a", role: "human", content: "How do I reset my password?", timestamp: "14:00:11" },
      { id: "r_06b1", role: "tool_call", content: "search_knowledge_base(query=\"password reset procedure\")", timestamp: "14:00:11", runId: "run_06b1", toolName: "search_knowledge_base", latency: "180ms", cost: "$0.001", spanType: "retriever" },
      { id: "r_06b2", role: "tool_call", content: "validate_user_identity(user=\"alex.rivera\")", timestamp: "14:00:12", runId: "run_06b2", toolName: "validate_user_identity", latency: "95ms", cost: "$0.000", spanType: "function" },
      { id: "r_06b3", role: "tool_response", content: "{\"docs\": [{\"id\": \"kb_401\", \"title\": \"Password Reset Flow\"}], \"verified\": true}", timestamp: "14:00:12", runId: "run_06b3" },
      { id: "r_06b", role: "assistant", content: "I can help you reset your password. I'll send a reset link to your registered email address. Would you like me to do that now?", timestamp: "14:00:12", runId: "run_06b", model: "gpt-4o", tokens: { input: 245, output: 32 }, latency: "180ms", cost: "$0.003", spanType: "llm" },
      { id: "r_06c", role: "human", content: "Yes please", timestamp: "14:00:19" },
      { id: "r_06d1", role: "tool_call", content: "generate_reset_token(user=\"alex.rivera\", ttl=1800)", timestamp: "14:00:20", runId: "run_06d1", toolName: "generate_reset_token", latency: "110ms", cost: "$0.000", spanType: "function" },
      { id: "r_06d", role: "tool_call", content: "send_email(to=\"a***a@email.com\", template=\"password_reset\")", timestamp: "14:00:20", runId: "run_06d", toolName: "send_email", latency: "320ms", cost: "$0.004", spanType: "tool" },
      { id: "r_06e", role: "tool_response", content: "{\"sent\": true, \"email\": \"a***a@email.com\"}", timestamp: "14:00:20", runId: "run_06e" },
      { id: "r_06f", role: "assistant", content: "Done! I've sent a password reset link to a***a@email.com. It'll expire in 30 minutes. Check your spam folder if you don't see it in a few minutes.", timestamp: "14:00:21", runId: "run_06f", model: "gpt-4o", tokens: { input: 478, output: 44 }, latency: "290ms", cost: "$0.006", spanType: "llm" },
    ],
  },
  {
    id: "th_07",
    name: "Payment dispute",
    user: "jordan.smith",
    startedAt: "41 min ago",
    turns: 12,
    duration: "1m 03s",
    score: 0.73,
    status: "in_progress",
    model: "gpt-4o",
    totalTokens: 3201,
    totalCost: "$0.039",
    properties: "Billing",
    environment: "Production",
    traceId: "12324554327",
    messages: [
      { id: "r_07a", role: "human", content: "I'm being charged twice for my last order", timestamp: "13:53:22" },
      { id: "r_07b", role: "tool_call", content: "get_payment_history(user=\"jordan.smith\", last=5)", timestamp: "13:53:23", runId: "run_07b", toolName: "get_payment_history", latency: "280ms", cost: "$0.004", spanType: "tool" },
      { id: "r_07b2", role: "tool_call", content: "query_stripe_charges(customer=\"cus_jordan\", since=\"2024-08-20\")", timestamp: "13:53:23", runId: "run_07b2", toolName: "query_stripe_charges", latency: "390ms", cost: "$0.002", spanType: "tool" },
      { id: "r_07b3", role: "tool_call", content: "check_fraud_flags(user=\"jordan.smith\")", timestamp: "13:53:23", runId: "run_07b3", toolName: "check_fraud_flags", latency: "150ms", cost: "$0.001", spanType: "function" },
      { id: "r_07c", role: "tool_response", content: "{\"payments\": [{\"id\": \"pay_891\", \"amount\": \"$47.99\", \"date\": \"Aug 22\", \"status\": \"completed\"}, {\"id\": \"pay_892\", \"amount\": \"$47.99\", \"date\": \"Aug 22\", \"status\": \"pending\"}]}", timestamp: "13:53:23", runId: "run_07c" },
      { id: "r_07d", role: "assistant", content: "I can see two charges of $47.99 on August 22nd — one completed and one still pending. The pending charge is likely a temporary authorization hold that should drop off within 3-5 business days. However, if both charges fully process, I can initiate a refund for the duplicate. Would you like me to monitor this and refund automatically if it settles?", timestamp: "13:53:24", runId: "run_07d", model: "gpt-4o", tokens: { input: 612, output: 78 }, latency: "520ms", cost: "$0.009", spanType: "llm" },
      { id: "r_07e", role: "human", content: "No, I want the refund now. This has happened before and I'm tired of waiting.", timestamp: "13:53:41" },
      { id: "r_07f1", role: "tool_call", content: "check_refund_eligibility(payment_id=\"pay_892\")", timestamp: "13:53:42", runId: "run_07f1", toolName: "check_refund_eligibility", latency: "180ms", cost: "$0.001", spanType: "tool" },
      { id: "r_07f2", role: "tool_call", content: "get_dispute_history(user=\"jordan.smith\")", timestamp: "13:53:42", runId: "run_07f2", toolName: "get_dispute_history", latency: "220ms", cost: "$0.002", spanType: "retriever" },
      { id: "r_07f3", role: "tool_response", content: "{\"eligible\": true, \"prior_disputes\": 2, \"last_dispute\": \"Jun 14\"}", timestamp: "13:53:42", runId: "run_07f3" },
      { id: "r_07g", role: "assistant", content: "I understand your frustration, and I can see this has happened twice before. I'm escalating this to priority processing — let me initiate the refund right now.", timestamp: "13:53:43", runId: "run_07g", model: "gpt-4o", tokens: { input: 845, output: 52 }, latency: "380ms", cost: "$0.011", spanType: "llm" },
      { id: "r_07h1", role: "tool_call", content: "initiate_refund(payment_id=\"pay_892\", amount=47.99, priority=true)", timestamp: "13:53:44", runId: "run_07h1", toolName: "initiate_refund", latency: "650ms", cost: "$0.003", spanType: "tool" },
      { id: "r_07h2", role: "tool_call", content: "send_confirmation_email(user=\"jordan.smith\", type=\"refund_initiated\")", timestamp: "13:53:44", runId: "run_07h2", toolName: "send_confirmation_email", latency: "310ms", cost: "$0.001", spanType: "tool" },
      { id: "r_07h3", role: "tool_response", content: "{\"refund_id\": \"ref_4421\", \"status\": \"processing\", \"eta\": \"1-2 business days\"}", timestamp: "13:53:45", runId: "run_07h3" },
      { id: "r_07i", role: "assistant", content: "Done — I've initiated a priority refund of $47.99 (ref: ref_4421). You should see it back in your account within 1-2 business days instead of the usual 3-5. I've also sent a confirmation email. Is there anything else I can help with?", timestamp: "13:53:46", runId: "run_07i", model: "gpt-4o", tokens: { input: 1102, output: 64 }, latency: "440ms", cost: "$0.014", spanType: "llm" },
      { id: "r_07j", role: "human", content: "Can you also make sure this doesn't happen again on future orders?", timestamp: "13:54:02" },
      { id: "r_07k1", role: "tool_call", content: "search_knowledge_base(query=\"prevent duplicate charges\")", timestamp: "13:54:03", runId: "run_07k1", toolName: "search_knowledge_base", latency: "190ms", cost: "$0.001", spanType: "retriever" },
      { id: "r_07k2", role: "tool_call", content: "flag_account_for_review(user=\"jordan.smith\", reason=\"recurring_duplicate_charges\")", timestamp: "13:54:03", runId: "run_07k2", toolName: "flag_account_for_review", latency: "120ms", cost: "$0.001", spanType: "function" },
      { id: "r_07k3", role: "tool_response", content: "{\"flagged\": true, \"ticket\": \"BILL-8821\"}", timestamp: "13:54:03", runId: "run_07k3" },
      { id: "r_07l", role: "assistant", content: "I've flagged your account for a billing review (ticket BILL-8821). Our payments team will investigate the root cause of these duplicate charges. They typically resolve these within 48 hours and will reach out if they need anything from you.\n\nIn the meantime, your future orders should process normally. If you see another duplicate, reference this ticket and we'll fast-track the resolution.", timestamp: "13:54:04", runId: "run_07l", model: "gpt-4o", tokens: { input: 1380, output: 82 }, latency: "510ms", cost: "$0.018", spanType: "llm" },
      { id: "r_07m", role: "human", content: "Ok thanks. One more thing — can I get a credit for the hassle? I've been a customer for 3 years.", timestamp: "13:54:22" },
      { id: "r_07n1", role: "tool_call", content: "get_customer_tenure(user=\"jordan.smith\")", timestamp: "13:54:23", runId: "run_07n1", toolName: "get_customer_tenure", latency: "95ms", cost: "$0.000", spanType: "tool" },
      { id: "r_07n2", role: "tool_call", content: "check_credit_policy(tenure_years=3, issue_type=\"billing_error\")", timestamp: "13:54:23", runId: "run_07n2", toolName: "check_credit_policy", latency: "140ms", cost: "$0.001", spanType: "retriever" },
      { id: "r_07n3", role: "tool_response", content: "{\"tenure\": \"3y 2mo\", \"eligible_credit\": 15.00, \"tier\": \"Gold\"}", timestamp: "13:54:23", runId: "run_07n3" },
      { id: "r_07o1", role: "tool_call", content: "apply_account_credit(user=\"jordan.smith\", amount=15.00, reason=\"billing_inconvenience\")", timestamp: "13:54:24", runId: "run_07o1", toolName: "apply_account_credit", latency: "280ms", cost: "$0.002", spanType: "tool" },
      { id: "r_07o2", role: "tool_response", content: "{\"applied\": true, \"new_balance\": 15.00}", timestamp: "13:54:24", runId: "run_07o2" },
      { id: "r_07p", role: "assistant", content: "Absolutely — as a Gold tier customer of over 3 years, I've applied a $15.00 credit to your account. It'll automatically apply to your next order.\n\nTo recap everything we did today:\n• Refund of $47.99 initiated (1-2 business days)\n• Account flagged for billing review (BILL-8821)\n• $15 courtesy credit applied\n\nThank you for your patience, Jordan. We value your loyalty.", timestamp: "13:54:25", runId: "run_07p", model: "gpt-4o", tokens: { input: 1680, output: 96 }, latency: "580ms", cost: "$0.022", spanType: "llm" },
    ],
  },
  {
    id: "th_08",
    name: "Shipping inquiry",
    user: "nina.kowalski",
    startedAt: "55 min ago",
    turns: 2,
    duration: "8s",
    score: 0.96,
    status: "completed",
    model: "gpt-4o-mini",
    totalTokens: 634,
    totalCost: "$0.002",
    properties: "Shipping",
    environment: "Production",
    traceId: "12324554328",
    messages: [
      { id: "r_08a", role: "human", content: "Do you offer free shipping?", timestamp: "13:39:44" },
      { id: "r_08b", role: "assistant", content: "Yes! We offer free standard shipping on all orders over $35. Orders under $35 have a flat $4.99 shipping fee. Express shipping (1-2 days) is available for $9.99 regardless of order total.", timestamp: "13:39:45", runId: "run_08b", model: "gpt-4o-mini", tokens: { input: 176, output: 52 }, latency: "120ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_09",
    name: "Missing package",
    user: "carlos.mendez",
    startedAt: "1h 12m ago",
    turns: 5,
    duration: "1m 38s",
    score: 0.55,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 4890,
    totalCost: "$0.059",
    properties: "Shipping",
    environment: "Production",
    traceId: "12324554329",
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
    name: "Gift message",
    user: "lisa.wong",
    startedAt: "1h 28m ago",
    turns: 3,
    duration: "22s",
    score: 0.89,
    status: "completed",
    model: "gpt-4o",
    totalTokens: 1876,
    totalCost: "$0.023",
    properties: "Shipping",
    environment: "Staging",
    traceId: "12324554330",
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
    id: "th_11", name: "Return policy", user: "david.park", startedAt: "1h 35m ago", turns: 2, duration: "9s", score: 0.91, status: "completed", model: "gpt-4o-mini", totalTokens: 710, totalCost: "$0.003", properties: "Returns", environment: "Production" as const, traceId: "12324554331",
    messages: [
      { id: "r_11a", role: "human", content: "What's your return policy?", timestamp: "12:59:10" },
      { id: "r_11b", role: "assistant", content: "You can return any item within 30 days of delivery for a full refund. Items must be unused and in original packaging.", timestamp: "12:59:11", runId: "run_11b", model: "gpt-4o-mini", tokens: { input: 182, output: 44 }, latency: "130ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_12", name: "Cancel subscription", user: "rachel.green", startedAt: "1h 42m ago", turns: 4, duration: "45s", score: 0.76, status: "completed", model: "gpt-4o", totalTokens: 3120, totalCost: "$0.038", properties: "Billing", environment: "Production" as const, traceId: "12324554332",
    messages: [
      { id: "r_12a", role: "human", content: "I need to cancel my subscription", timestamp: "12:52:18" },
      { id: "r_12b", role: "tool_call", content: "get_subscription(user=\"rachel.green\")", timestamp: "12:52:19", runId: "run_12b", toolName: "get_subscription", model: "gpt-4o", tokens: { input: 276, output: 28 }, latency: "200ms", cost: "$0.004" },
      { id: "r_12c", role: "tool_response", content: "{\"plan\": \"Pro\", \"billing\": \"annual\", \"renewal\": \"Nov 15\"}", timestamp: "12:52:19", runId: "run_12c" },
      { id: "r_12d", role: "assistant", content: "You're on the annual Pro plan, renewing November 15th. I can cancel it — you'll keep access until the renewal date. Want to proceed?", timestamp: "12:52:20", runId: "run_12d", model: "gpt-4o", tokens: { input: 498, output: 42 }, latency: "310ms", cost: "$0.007" },
    ],
  },
  {
    id: "th_13", name: "Inventory check", user: "tom.hanks", startedAt: "1h 58m ago", turns: 3, duration: "28s", score: 0.83, status: "completed", model: "gpt-4o", totalTokens: 2240, totalCost: "$0.027", properties: "Shipping", environment: "Production" as const, traceId: "12324554333",
    messages: [
      { id: "r_13a", role: "human", content: "Do you have the Air Max 90 in size 11?", timestamp: "12:36:02" },
      { id: "r_13b", role: "tool_call", content: "check_inventory(sku=\"AM90\", size=\"11\")", timestamp: "12:36:03", runId: "run_13b", toolName: "check_inventory", model: "gpt-4o", tokens: { input: 264, output: 24 }, latency: "180ms", cost: "$0.003" },
      { id: "r_13c", role: "tool_response", content: "{\"in_stock\": true, \"colors\": [\"white\", \"black\", \"infrared\"], \"price\": \"$130\"}", timestamp: "12:36:03", runId: "run_13c" },
      { id: "r_13d", role: "assistant", content: "Yes! The Air Max 90 in size 11 is available in white, black, and infrared at $130. Want me to add one to your cart?", timestamp: "12:36:04", runId: "run_13d", model: "gpt-4o", tokens: { input: 487, output: 38 }, latency: "280ms", cost: "$0.006" },
    ],
  },
  {
    id: "th_14", name: "Discount inquiry", user: "maya.singh", startedAt: "2h 5m ago", turns: 2, duration: "6s", score: 0.97, status: "completed", model: "gpt-4o-mini", totalTokens: 520, totalCost: "$0.002", properties: "Billing", environment: "Production" as const, traceId: "12324554334",
    messages: [
      { id: "r_14a", role: "human", content: "Is there a student discount?", timestamp: "12:29:44" },
      { id: "r_14b", role: "assistant", content: "Yes — verified students get 15% off with a valid .edu email. Apply at checkout with code STUDENT15.", timestamp: "12:29:45", runId: "run_14b", model: "gpt-4o-mini", tokens: { input: 164, output: 36 }, latency: "110ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_15", name: "Refund dispute", user: "ben.wright", startedAt: "2h 18m ago", turns: 14, duration: "3m 48s", score: 0.48, status: "failed", model: "gpt-4o", totalTokens: 4680, totalCost: "$0.057", properties: "Returns", environment: "Production" as const, traceId: "12324554335",
    messages: [
      { id: "r_15a", role: "human", content: "I was charged for an item I already returned", timestamp: "12:16:33" },
      { id: "r_15b", role: "tool_call", content: "get_returns(user=\"ben.wright\")", timestamp: "12:16:34", runId: "run_15b", toolName: "get_returns", latency: "220ms", cost: "$0.004", spanType: "tool" },
      { id: "r_15c", role: "tool_response", content: "{\"error\": \"SERVICE_UNAVAILABLE\"}", timestamp: "12:16:37", runId: "run_15c" },
      { id: "r_15d", role: "assistant", content: "I'm sorry, I'm having trouble accessing your return records. Let me try again.", timestamp: "12:16:38", runId: "run_15d", model: "gpt-4o", tokens: { input: 412, output: 28 }, latency: "240ms", cost: "$0.005", spanType: "llm" },
      { id: "r_15e", role: "tool_call", content: "get_returns(user=\"ben.wright\", retry=true)", timestamp: "12:16:39", runId: "run_15e", toolName: "get_returns", latency: "4800ms", cost: "$0.006", spanType: "tool" },
      { id: "r_15f", role: "tool_response", content: "{\"error\": \"TIMEOUT\"}", timestamp: "12:16:44", runId: "run_15f" },
      { id: "r_15g", role: "assistant", content: "I apologize — our returns system is currently experiencing issues. Let me try a different approach to look up your account.", timestamp: "12:16:45", runId: "run_15g", model: "gpt-4o", tokens: { input: 587, output: 46 }, latency: "340ms", cost: "$0.008", spanType: "llm" },
      { id: "r_15h", role: "human", content: "This is ridiculous. I returned the headphones two weeks ago and I have the tracking showing it was delivered back to your warehouse.", timestamp: "12:17:01" },
      { id: "r_15i1", role: "tool_call", content: "search_knowledge_base(query=\"manual return lookup fallback\")", timestamp: "12:17:02", runId: "run_15i1", toolName: "search_knowledge_base", latency: "160ms", cost: "$0.001", spanType: "retriever" },
      { id: "r_15i2", role: "tool_call", content: "query_warehouse_receiving(tracking=\"1Z999AA10123456784\")", timestamp: "12:17:02", runId: "run_15i2", toolName: "query_warehouse_receiving", latency: "340ms", cost: "$0.002", spanType: "tool" },
      { id: "r_15i3", role: "tool_response", content: "{\"received\": true, \"date\": \"Aug 16\", \"condition\": \"good\", \"refund_status\": \"not_processed\"}", timestamp: "12:17:03", runId: "run_15i3" },
      { id: "r_15j", role: "assistant", content: "I found it through our warehouse system — your return was received on August 16th in good condition, but the refund was never processed. That's clearly our error. I'm going to fix this right now.", timestamp: "12:17:04", runId: "run_15j", model: "gpt-4o", tokens: { input: 890, output: 58 }, latency: "410ms", cost: "$0.012", spanType: "llm" },
      { id: "r_15k1", role: "tool_call", content: "initiate_refund(user=\"ben.wright\", item=\"headphones\", amount=89.99, priority=true)", timestamp: "12:17:05", runId: "run_15k1", toolName: "initiate_refund", latency: "580ms", cost: "$0.003", spanType: "tool" },
      { id: "r_15k2", role: "tool_call", content: "create_incident_ticket(type=\"missed_refund\", user=\"ben.wright\")", timestamp: "12:17:05", runId: "run_15k2", toolName: "create_incident_ticket", latency: "210ms", cost: "$0.001", spanType: "tool" },
      { id: "r_15k3", role: "tool_response", content: "{\"error\": \"REFUND_SERVICE_UNAVAILABLE\"}", timestamp: "12:17:06", runId: "run_15k3" },
      { id: "r_15l", role: "assistant", content: "I'm very sorry — I've confirmed your return but our refund processing system is also down right now, so I can't issue the refund immediately. I've created an incident ticket so this gets top priority once systems are back.", timestamp: "12:17:07", runId: "run_15l", model: "gpt-4o", tokens: { input: 1120, output: 62 }, latency: "450ms", cost: "$0.015", spanType: "llm" },
      { id: "r_15m", role: "human", content: "Are you kidding me? I want to speak to a human. This is unacceptable.", timestamp: "12:17:22" },
      { id: "r_15n1", role: "tool_call", content: "escalate_to_human(user=\"ben.wright\", priority=\"urgent\", context=\"refund_system_down\")", timestamp: "12:17:23", runId: "run_15n1", toolName: "escalate_to_human", latency: "180ms", cost: "$0.001", spanType: "tool" },
      { id: "r_15n2", role: "tool_call", content: "apply_account_credit(user=\"ben.wright\", amount=10.00, reason=\"service_disruption\")", timestamp: "12:17:23", runId: "run_15n2", toolName: "apply_account_credit", latency: "250ms", cost: "$0.002", spanType: "tool" },
      { id: "r_15n3", role: "tool_response", content: "{\"escalated\": true, \"agent\": \"Sarah K.\", \"queue_position\": 1, \"credit_applied\": true}", timestamp: "12:17:24", runId: "run_15n3" },
      { id: "r_15o", role: "assistant", content: "You're absolutely right to be frustrated, and I'm sorry for this experience. I've done the following:\n\n• Escalated you to Sarah K. — you're next in queue\n• Applied a $10 courtesy credit to your account immediately\n• Created incident ticket INC-4421 for the $89.99 refund\n\nSarah will have full context of this conversation and will process your refund manually. You should be connected within the next minute.", timestamp: "12:17:25", runId: "run_15o", model: "gpt-4o", tokens: { input: 1450, output: 88 }, latency: "520ms", cost: "$0.019", spanType: "llm" },
      { id: "r_15p", role: "human", content: "Fine. Thanks for at least trying.", timestamp: "12:17:38" },
      { id: "r_15q", role: "assistant", content: "Thank you for your patience, Ben. Sarah will take great care of you. I've noted everything in the ticket so you won't have to repeat yourself. Have a good day.", timestamp: "12:17:39", runId: "run_15q", model: "gpt-4o", tokens: { input: 1580, output: 42 }, latency: "320ms", cost: "$0.016", spanType: "llm" },
    ],
  },
  {
    id: "th_16", name: "Invoice request", user: "olivia.martinez", startedAt: "2h 31m ago", turns: 3, duration: "18s", score: 0.90, status: "completed", model: "gpt-4o", totalTokens: 1890, totalCost: "$0.023", properties: "Billing", environment: "Production" as const, traceId: "12324554336",
    messages: [
      { id: "r_16a", role: "human", content: "Can I get an invoice for order #7720?", timestamp: "12:03:11" },
      { id: "r_16b", role: "tool_call", content: "generate_invoice(order_id=\"7720\")", timestamp: "12:03:12", runId: "run_16b", toolName: "generate_invoice", model: "gpt-4o", tokens: { input: 256, output: 22 }, latency: "340ms", cost: "$0.003" },
      { id: "r_16c", role: "tool_response", content: "{\"url\": \"https://store.example.com/invoices/7720.pdf\"}", timestamp: "12:03:12", runId: "run_16c" },
      { id: "r_16d", role: "assistant", content: "Here's your invoice: https://store.example.com/invoices/7720.pdf — it includes the full order breakdown and tax details.", timestamp: "12:03:13", runId: "run_16d", model: "gpt-4o", tokens: { input: 434, output: 36 }, latency: "260ms", cost: "$0.006" },
    ],
  },
  {
    id: "th_17", name: "Product launch", user: "kevin.zhao", startedAt: "2h 45m ago", turns: 2, duration: "11s", score: 0.85, status: "completed", model: "gpt-4o-mini", totalTokens: 680, totalCost: "$0.003", properties: "Account", environment: "Staging" as const, traceId: "12324554337",
    messages: [
      { id: "r_17a", role: "human", content: "When will the new colorways drop?", timestamp: "11:49:22" },
      { id: "r_17b", role: "assistant", content: "The Fall 2026 collection drops September 4th at 10 AM ET. Sign up for notifications at store.example.com/drops to get early access.", timestamp: "11:49:23", runId: "run_17b", model: "gpt-4o-mini", tokens: { input: 178, output: 48 }, latency: "140ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_18", name: "Damaged order", user: "aisha.kumar", startedAt: "3h 2m ago", turns: 4, duration: "34s", score: 0.72, status: "completed", model: "gpt-4o", totalTokens: 2890, totalCost: "$0.035", properties: "Returns", environment: "Production" as const, traceId: "12324554338",
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
    id: "th_19", name: "Shipping rates", user: "lucas.ferreira", startedAt: "3h 15m ago", turns: 2, duration: "7s", score: 0.93, status: "completed", model: "gpt-4o-mini", totalTokens: 590, totalCost: "$0.002", properties: "Shipping", environment: "Production" as const, traceId: "12324554339",
    messages: [
      { id: "r_19a", role: "human", content: "Do you ship to Brazil?", timestamp: "11:19:55" },
      { id: "r_19b", role: "assistant", content: "Yes, we ship to Brazil! Standard international shipping takes 10-14 business days and costs $19.99. Express (5-7 days) is $34.99.", timestamp: "11:19:56", runId: "run_19b", model: "gpt-4o-mini", tokens: { input: 170, output: 42 }, latency: "120ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_20", name: "Gift card usage", user: "sophie.anderson", startedAt: "3h 28m ago", turns: 3, duration: "21s", score: 0.86, status: "completed", model: "gpt-4o", totalTokens: 1740, totalCost: "$0.021", properties: "Billing", environment: "Production" as const, traceId: "12324554340",
    messages: [
      { id: "r_20a", role: "human", content: "How do I use my gift card?", timestamp: "11:06:33" },
      { id: "r_20b", role: "assistant", content: "At checkout, enter the 16-digit code from the back of your gift card in the 'Gift Card or Promo Code' field. The balance will be applied automatically. Any remaining balance stays on the card for future purchases.", timestamp: "11:06:34", runId: "run_20b", model: "gpt-4o", tokens: { input: 198, output: 52 }, latency: "240ms", cost: "$0.004" },
      { id: "r_20c", role: "human", content: "Can I use it with a promo code?", timestamp: "11:06:48" },
      { id: "r_20d", role: "assistant", content: "Yes! Gift cards and promo codes stack — apply both at checkout. The promo discount applies first, then the gift card covers the remaining total.", timestamp: "11:06:49", runId: "run_20d", model: "gpt-4o", tokens: { input: 342, output: 38 }, latency: "200ms", cost: "$0.005" },
    ],
  },
  {
    id: "th_21", name: "Payment methods", user: "ethan.moore", startedAt: "3h 40m ago", turns: 2, duration: "8s", score: 0.94, status: "completed", model: "gpt-4o-mini", totalTokens: 620, totalCost: "$0.002", properties: "Account", environment: "Production" as const, traceId: "12324554341",
    messages: [
      { id: "r_21a", role: "human", content: "What payment methods do you accept?", timestamp: "10:54:11" },
      { id: "r_21b", role: "assistant", content: "We accept Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, PayPal, and Klarna (pay in 4 installments).", timestamp: "10:54:12", runId: "run_21b", model: "gpt-4o-mini", tokens: { input: 174, output: 40 }, latency: "115ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_22", name: "Order cancelled", user: "maria.costa", startedAt: "3h 55m ago", turns: 4, duration: "42s", score: 0.61, status: "completed", model: "gpt-4o", totalTokens: 3340, totalCost: "$0.041", properties: "Billing", environment: "Staging" as const, traceId: "12324554342",
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
    id: "th_23", name: "Order tracking", user: "noah.kim", startedAt: "4h 8m ago", turns: 2, duration: "10s", score: 0.88, status: "completed", model: "gpt-4o-mini", totalTokens: 740, totalCost: "$0.003", properties: "Shipping", environment: "Production" as const, traceId: "12324554343",
    messages: [
      { id: "r_23a", role: "human", content: "How do I track my order?", timestamp: "10:26:05" },
      { id: "r_23b", role: "assistant", content: "Go to store.example.com/orders and sign in, or check the shipping confirmation email — it has a tracking link directly from the carrier. You can also just tell me your order number and I'll look it up for you.", timestamp: "10:26:06", runId: "run_23b", model: "gpt-4o-mini", tokens: { input: 186, output: 54 }, latency: "145ms", cost: "$0.001" },
    ],
  },
  {
    id: "th_24", name: "Size exchange", user: "chloe.dubois", startedAt: "4h 22m ago", turns: 3, duration: "26s", score: 0.81, status: "in_progress", model: "gpt-4o", totalTokens: 2100, totalCost: "$0.025", properties: "Returns", environment: "Production" as const, traceId: "12324554344",
    messages: [
      { id: "r_24a", role: "human", content: "I want to exchange my jacket for a larger size", timestamp: "10:12:44" },
      { id: "r_24b", role: "tool_call", content: "find_recent_orders(user=\"chloe.dubois\", category=\"apparel\")", timestamp: "10:12:45", runId: "run_24b", toolName: "find_recent_orders", model: "gpt-4o", tokens: { input: 282, output: 28 }, latency: "240ms", cost: "$0.004" },
      { id: "r_24c", role: "tool_response", content: "{\"orders\": [{\"id\": \"9330\", \"item\": \"Puffer Jacket - M\", \"exchangeable\": true}]}", timestamp: "10:12:45", runId: "run_24c" },
      { id: "r_24d", role: "assistant", content: "I found your Puffer Jacket in Medium from order #9330. I can set up an exchange for a Large — we'll send the new size and include a prepaid return label for the Medium. Want me to go ahead?", timestamp: "10:12:46", runId: "run_24d", model: "gpt-4o", tokens: { input: 498, output: 48 }, latency: "340ms", cost: "$0.007" },
    ],
  },
].map((t, i) => ({
  ...t,
  userId: t.userId ?? userIds[i % userIds.length],
  threadId: t.threadId ?? String(9120938 + i),
  metric: t.metric ?? "end-to-end metrics",
  notes: t.notes ?? (
    i === 1 ? ["Return policy edge case — agent suggested store credit but customer wanted refund. Escalated to manager."] :
    i === 4 ? ["Hallucination detected: agent fabricated a tracking number. Added to negative examples dataset.", "Follow-up: retrained retriever on shipping docs v2.3"] :
    i === 14 ? ["Refund dispute resolved after 3 escalations. Customer retention risk — flagged for review."] :
    []
  ),
  evalMetrics: t.evalMetrics ?? getEvalsForThread(t.properties as string, t.status as string, t.turns as number).map((em) => ({
    ...em,
    score: Math.round((em.score - 0.03 + Math.random() * 0.06) * 100) / 100,
  })),
  messages: t.messages.map((m) => ({
    ...m,
    spanType: (m as Message).spanType ?? (m.role === "tool_call" ? "tool" as const : m.role === "assistant" ? "llm" as const : undefined),
  })),
})) as Thread[];
