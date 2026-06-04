
function money(num){ return "$" + Number(num || 0).toFixed(2); }
function pct(num){ return Number(num || 0).toFixed(1) + "%"; }
function getValue(id){ return parseFloat(document.getElementById(id)?.value) || 0; }
function getText(id){ return (document.getElementById(id)?.value || "").trim(); }
function setText(id, text){ const el = document.getElementById(id); if(el) el.textContent = text; }

function switchTool(id){
  document.querySelectorAll(".tool-tab").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tool-panel").forEach(panel => panel.classList.remove("active"));
  const btn = document.querySelector('[data-tool="' + id + '"]');
  const panel = document.getElementById(id);
  if(btn) btn.classList.add("active");
  if(panel) panel.classList.add("active");
  calculateAll();
}

function calcNumbers(prefix){
  const price = getValue(prefix + "price");
  const shippingCharged = getValue(prefix + "shippingCharged");
  const productCost = getValue(prefix + "productCost");
  const shippingCost = getValue(prefix + "shippingCost");
  const packagingCost = getValue(prefix + "packagingCost");
  const listingFee = getValue(prefix + "listingFee");
  const transactionFee = getValue(prefix + "transactionFee") / 100;
  const processingFee = getValue(prefix + "processingFee") / 100;
  const fixedFee = getValue(prefix + "fixedFee");
  const offsiteFee = getValue(prefix + "offsiteFee") / 100;
  const adCost = getValue(prefix + "adCost");
  const discount = getValue(prefix + "discount") / 100;

  const discountedPrice = price * (1 - discount);
  const revenue = discountedPrice + shippingCharged;
  const fees = listingFee + fixedFee + revenue * (transactionFee + processingFee + offsiteFee);
  const costs = productCost + shippingCost + packagingCost + adCost;
  const profit = revenue - fees - costs;
  const margin = revenue > 0 ? profit / revenue * 100 : 0;

  return { price, shippingCharged, productCost, shippingCost, packagingCost, listingFee, transactionFee, processingFee, fixedFee, offsiteFee, adCost, discount, revenue, fees, costs, profit, margin };
}

function calculateBasic(){
  const n = calcNumbers("");
  setText("revenue", money(n.revenue));
  setText("fees", money(n.fees));
  setText("costs", money(n.costs));
  setText("profit", money(n.profit));
  setText("margin", pct(n.margin));
  const p = document.getElementById("profit");
  if(p) p.className = n.profit >= 0 ? "profit" : "loss";
}

function calculateFee(){
  const n = calcNumbers("fee_");
  setText("fee_totalRevenue", money(n.revenue));
  setText("fee_totalFees", money(n.fees));
  setText("fee_feeRate", n.revenue > 0 ? pct(n.fees / n.revenue * 100) : "0%");
}

function calculateTargetPrice(){
  const targetProfit = getValue("target_targetProfit");
  const productCost = getValue("target_productCost");
  const shippingCost = getValue("target_shippingCost");
  const packagingCost = getValue("target_packagingCost");
  const shippingCharged = getValue("target_shippingCharged");
  const listingFee = getValue("target_listingFee");
  const fixedFee = getValue("target_fixedFee");
  const adCost = getValue("target_adCost");
  const discount = getValue("target_discount") / 100;
  const feeRate = (getValue("target_transactionFee") + getValue("target_processingFee") + getValue("target_offsiteFee")) / 100;

  const neededRevenue = (targetProfit + productCost + shippingCost + packagingCost + adCost + listingFee + fixedFee) / Math.max(0.01, 1 - feeRate);
  const recommendedPrice = Math.max(0, (neededRevenue - shippingCharged) / Math.max(0.01, 1 - discount));
  const finalRevenue = recommendedPrice * (1 - discount) + shippingCharged;
  const totalFees = listingFee + fixedFee + finalRevenue * feeRate;
  const margin = finalRevenue > 0 ? targetProfit / finalRevenue * 100 : 0;

  setText("target_recommendedPrice", money(recommendedPrice));
  setText("target_revenue", money(finalRevenue));
  setText("target_fees", money(totalFees));
  setText("target_margin", pct(margin));
}

function calculateBreakEven(){
  const prefix = "be_";
  const productCost = getValue(prefix + "productCost");
  const shippingCost = getValue(prefix + "shippingCost");
  const packagingCost = getValue(prefix + "packagingCost");
  const shippingCharged = getValue(prefix + "shippingCharged");
  const listingFee = getValue(prefix + "listingFee");
  const fixedFee = getValue(prefix + "fixedFee");
  const adCost = getValue(prefix + "adCost");
  const feeRate = (getValue(prefix + "transactionFee") + getValue(prefix + "processingFee") + getValue(prefix + "offsiteFee")) / 100;

  const breakEvenRevenue = (productCost + shippingCost + packagingCost + adCost + listingFee + fixedFee) / Math.max(0.01, 1 - feeRate);
  const breakEvenPrice = Math.max(0, breakEvenRevenue - shippingCharged);

  setText("be_price", money(breakEvenPrice));
  setText("be_revenue", money(breakEvenRevenue));
  setText("be_note", "This is the estimated minimum item price before profit.");
}

function calculateDiscount(){
  const n = calcNumbers("disc_");
  setText("disc_revenue", money(n.revenue));
  setText("disc_profit", money(n.profit));
  setText("disc_margin", pct(n.margin));
  const p = document.getElementById("disc_profit");
  if(p) p.className = n.profit >= 0 ? "profit" : "loss";
}

function calculateROI(){
  const n = calcNumbers("roi_");
  const adSpend = getValue("roi_adCost");
  const roi = adSpend > 0 ? n.profit / adSpend * 100 : 0;
  setText("roi_profit", money(n.profit));
  setText("roi_roi", adSpend > 0 ? pct(roi) : "No ad spend");
  setText("roi_margin", pct(n.margin));
}

function calculateBundle(){
  const bundlePrice = getValue("bundle_price");
  const items = getValue("bundle_items");
  const costPerItem = getValue("bundle_costPerItem");
  const shippingCharged = getValue("bundle_shippingCharged");
  const shippingCost = getValue("bundle_shippingCost");
  const packagingCost = getValue("bundle_packagingCost");
  const listingFee = getValue("bundle_listingFee");
  const fixedFee = getValue("bundle_fixedFee");
  const feeRate = (getValue("bundle_transactionFee") + getValue("bundle_processingFee") + getValue("bundle_offsiteFee")) / 100;

  const revenue = bundlePrice + shippingCharged;
  const fees = listingFee + fixedFee + revenue * feeRate;
  const costs = items * costPerItem + shippingCost + packagingCost;
  const profit = revenue - fees - costs;
  const margin = revenue > 0 ? profit / revenue * 100 : 0;
  const perItemProfit = items > 0 ? profit / items : 0;

  setText("bundle_profit", money(profit));
  setText("bundle_margin", pct(margin));
  setText("bundle_perItem", money(perItemProfit));
}

function recommendAdvisorPrice(n, targetMargin){
  const target = targetMargin > 0 ? targetMargin / 100 : 0.3;
  const feeRate = n.transactionFee + n.processingFee + n.offsiteFee;
  const fixedCosts = n.productCost + n.shippingCost + n.packagingCost + n.adCost + n.listingFee + n.fixedFee;
  const neededRevenue = fixedCosts / Math.max(0.01, 1 - feeRate - target);
  if(!isFinite(neededRevenue) || neededRevenue < 0) return n.price * 1.15;
  return Math.max(0, (neededRevenue - n.shippingCharged) / Math.max(0.01, 1 - n.discount));
}

function runAdvisor(){
  const box = document.getElementById("advisor_result");
  if(!box) return;

  const product = getText("advisor_product") || "your product";
  const competitor = getValue("advisor_competitor");
  const targetMargin = getValue("advisor_targetMargin");
  const n = calcNumbers("advisor_");

  let score = 80;
  const issues = [];
  const actions = [];

  if(n.profit <= 0){ score -= 45; issues.push("This product may lose money or break even."); actions.push("Raise the price, lower costs, or remove discounts before listing."); }
  if(n.margin < 15){ score -= 25; issues.push("Profit margin is very thin."); actions.push("Aim for a stronger margin to survive refunds, shipping changes, and ads."); }
  else if(n.margin < 30){ score -= 10; issues.push("Margin is workable but fragile."); actions.push("Test a slightly higher price or lower fulfillment costs."); }
  if(competitor > 0 && n.price < competitor * 0.85){ score -= 10; issues.push("Your price is far below the competitor reference."); actions.push("You may be underpricing. Test a price closer to the market."); }
  if(competitor > 0 && n.price > competitor * 1.25){ score -= 8; issues.push("Your price is much higher than the competitor reference."); actions.push("Make sure your photos, description, materials, and value justify the premium."); }
  if(targetMargin > 0 && n.margin < targetMargin){ score -= 12; issues.push("Your margin is below your target margin."); actions.push("Use the Target Price tool to work backwards from your desired profit."); }
  if(!issues.length){ issues.push("This product looks reasonably priced based on the numbers entered."); actions.push("Test the price and review real order data after a few sales."); }

  score = Math.max(5, Math.min(98, score));
  const cls = score < 45 ? "advisor-warning" : score < 72 ? "advisor-mid" : "";
  const suggested = recommendAdvisorPrice(n, targetMargin);

  box.innerHTML = `
    <div class="advisor-score ${cls}">Full pricing analysis · Score ${score}/100</div>
    <div class="kpi-grid">
      <div class="kpi"><span>Estimated profit</span><strong>${money(n.profit)}</strong></div>
      <div class="kpi"><span>Profit margin</span><strong>${pct(n.margin)}</strong></div>
      <div class="kpi"><span>Suggested price</span><strong>${money(suggested)}</strong></div>
    </div>
    <h3>Advisor notes for ${product}</h3>
    <ul>${issues.map(x => `<li>${x}</li>`).join("")}</ul>
    <h3>Recommended actions</h3>
    <ul>${actions.map(x => `<li>${x}</li>`).join("")}</ul>
  `;
}

function exportCSV(){
  const rows = [
    ["Metric","Value"],
    ["Recommended Price", document.getElementById("target_recommendedPrice")?.textContent || ""],
    ["Total Revenue", document.getElementById("target_revenue")?.textContent || ""],
    ["Estimated Fees", document.getElementById("target_fees")?.textContent || ""],
    ["Estimated Margin", document.getElementById("target_margin")?.textContent || ""]
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "craftprofitcalc-pro-result.csv";
  a.click();
}

function saveProduct(){
  const name = document.getElementById("target_productName")?.value || "Untitled product";
  const price = document.getElementById("target_recommendedPrice")?.textContent || "$0.00";
  const saved = JSON.parse(localStorage.getItem("craft_products") || "[]");
  saved.push({name, price, date: new Date().toLocaleDateString()});
  localStorage.setItem("craft_products", JSON.stringify(saved));
  renderProducts();
}

function renderProducts(){
  const box = document.getElementById("savedProducts");
  if(!box) return;
  const saved = JSON.parse(localStorage.getItem("craft_products") || "[]");
  box.innerHTML = saved.length ? saved.map(x => `<div class="result"><span>${x.name}<br><small>${x.date}</small></span><strong>${x.price}</strong></div>`).join("") : "<p class='muted'>No saved products yet.</p>";
}

function calculateAll(){
  calculateBasic();
  calculateFee();
  calculateTargetPrice();
  calculateBreakEven();
  calculateDiscount();
  calculateROI();
  calculateBundle();
  runAdvisor();
  renderProducts();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach(input => input.addEventListener("input", calculateAll));
  document.querySelectorAll(".locked-tool-note").forEach(el => el.remove());
  document.querySelectorAll(".blur-locked").forEach(el => el.classList.remove("blur-locked"));
  calculateAll();
});


/* License gate */
const PRO_LICENSE_KEY = "CPRO-LIFETIME-2026";

function isLicenseUnlocked(){
  return localStorage.getItem("craftprofitcalc_license_ok") === "true";
}

function unlockLicense(){
  const input = document.getElementById("licenseInput");
  const status = document.getElementById("licenseStatus");
  const value = (input?.value || "").trim();

  if(value === PRO_LICENSE_KEY){
    localStorage.setItem("craftprofitcalc_license_ok", "true");
    applyLicenseGate();
  } else {
    if(status) status.textContent = "Invalid license key.";
  }
}

function lockLicense(){
  localStorage.removeItem("craftprofitcalc_license_ok");
  applyLicenseGate();
}

function applyLicenseGate(){
  const unlocked = isLicenseUnlocked();
  const gate = document.getElementById("licenseGate");
  const content = document.getElementById("proContent");
  const status = document.getElementById("licenseStatus");

  if(gate) gate.style.display = unlocked ? "none" : "block";
  if(content){
    content.classList.toggle("locked", !unlocked);
    content.classList.toggle("unlocked", unlocked);
  }
  if(status && !unlocked) status.textContent = "Enter your license key to access Pro tools.";
  if(unlocked) calculateAll();
}

document.addEventListener("DOMContentLoaded", applyLicenseGate);


/* Supabase one-use license system
   Fill these two values after creating your Supabase project.
*/
const SUPABASE_URL = "https://qvtvcasmoilrcybxqhse.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ASiKKGVCqfEblwDvHlDkXQ_iFDEi9RF";
let supabaseClient = null;

function getSupabase(){
  if(!window.supabase) return null;
  if(SUPABASE_URL.includes("PASTE_") || SUPABASE_ANON_KEY.includes("PASTE_")) return null;
  if(!supabaseClient){
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

function deviceId(){
  let id = localStorage.getItem("craft_device_id");
  if(!id){
    id = "dev_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("craft_device_id", id);
  }
  return id;
}

async function unlockLicense(){
  const input = document.getElementById("licenseInput");
  const emailInput = document.getElementById("emailInput");
  const status = document.getElementById("licenseStatus");
  const key = (input?.value || "").trim();
  const email = (emailInput?.value || "").trim().toLowerCase();

  if(status) status.textContent = "Checking license...";

  const sb = getSupabase();

  if(!sb){
    if(status){
      status.innerHTML = "Supabase is not configured yet. Add your Supabase URL and anon key in app.js.";
    }
    return;
  }

  if(!key || !email){
    if(status) status.textContent = "Enter both purchase email and license key.";
    return;
  }

  const { data, error } = await sb
    .from("licenses")
    .select("*")
    .eq("license_key", key)
    .maybeSingle();

  if(error){
    console.error("Supabase license select error:", error);
    if(status) status.textContent = "License check failed: " + (error.message || "Supabase permission error");
    return;
  }

  if(!data){
    if(status) status.textContent = "Invalid license key.";
    return;
  }

  if(data.email && data.email.toLowerCase() !== email){
    if(status) status.textContent = "This license does not match that email.";
    return;
  }

  if(data.status !== "active"){
    if(status) status.textContent = "This license is not active.";
    return;
  }

  const currentDevice = deviceId();

  if(data.used === true && data.device_id && data.device_id !== currentDevice){
    if(status) status.textContent = "This license has already been activated on another device.";
    return;
  }

  if(data.used === true && data.device_id === currentDevice){
    localStorage.setItem("craftprofitcalc_license_ok", "true");
    localStorage.setItem("craft_license_key", key);
    applyLicenseGate();
    return;
  }

  const { error: updateError } = await sb
    .from("licenses")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      device_id: currentDevice
    })
    .eq("license_key", key)
    .eq("used", false);

  if(updateError){
    console.error("Supabase license update error:", updateError);
    if(status) status.textContent = "Could not activate license: " + (updateError.message || "Supabase update permission error");
    return;
  }

  localStorage.setItem("craftprofitcalc_license_ok", "true");
  localStorage.setItem("craft_license_key", key);
  applyLicenseGate();
}

async function validateExistingLicense(){
  const sb = getSupabase();
  const key = localStorage.getItem("craft_license_key");

  if(!isLicenseUnlocked() || !sb || !key) return;

  const { data } = await sb
    .from("licenses")
    .select("status,device_id")
    .eq("license_key", key)
    .maybeSingle();

  if(!data || data.status !== "active" || data.device_id !== deviceId()){
    localStorage.removeItem("craftprofitcalc_license_ok");
    localStorage.removeItem("craft_license_key");
  }
  applyLicenseGate();
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(validateExistingLicense, 500);
});


/* Final robust Supabase license override */
async function unlockLicense(){
  const input = document.getElementById("licenseInput");
  const emailInput = document.getElementById("emailInput");
  const status = document.getElementById("licenseStatus");
  const key = (input?.value || "").trim();
  const email = (emailInput?.value || "").trim().toLowerCase();

  if(status) status.textContent = "Checking license...";

  const sb = getSupabase();
  if(!sb){
    if(status) status.textContent = "Supabase is not configured in app.js.";
    return;
  }
  if(!key || !email){
    if(status) status.textContent = "Enter both purchase email and license key.";
    return;
  }

  const currentDevice = deviceId();

  const { data, error } = await sb
    .from("licenses")
    .select("license_key,email,status,used,device_id")
    .eq("license_key", key)
    .maybeSingle();

  if(error){
    console.error("License select error", error);
    if(status) status.textContent = "License check failed: " + error.message;
    return;
  }
  if(!data){
    if(status) status.textContent = "Invalid license key.";
    return;
  }
  if((data.email || "").toLowerCase() !== email){
    if(status) status.textContent = "This license does not match that email.";
    return;
  }
  if(data.status !== "active"){
    if(status) status.textContent = "This license is not active.";
    return;
  }
  if(data.used === true && data.device_id && data.device_id !== currentDevice){
    if(status) status.textContent = "This license has already been activated on another device.";
    return;
  }
  if(data.used === true && data.device_id === currentDevice){
    localStorage.setItem("craftprofitcalc_license_ok", "true");
    localStorage.setItem("craft_license_key", key);
    applyLicenseGate();
    return;
  }

  const { error: updateError } = await sb
    .from("licenses")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      device_id: currentDevice
    })
    .eq("license_key", key);

  if(updateError){
    console.error("License update error", updateError);
    if(status) status.textContent = "Could not activate license: " + updateError.message;
    return;
  }

  localStorage.setItem("craftprofitcalc_license_ok", "true");
  localStorage.setItem("craft_license_key", key);
  applyLicenseGate();
}
