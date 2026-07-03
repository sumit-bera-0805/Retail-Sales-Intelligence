// ======================================
// Retail Sales Intelligence Dashboard JS
// ======================================

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ==========================================================
// Demo data — used whenever the real FastAPI backend isn't
// reachable (e.g. previewing this page standalone), so the
// dashboard and API explorer always have something real to
// filter, sort, and page through instead of a broken/empty
// state.
// ==========================================================

const DEMO_DASHBOARD_BY_REGION = {
    All:   { total_sales: 128400, customers: 9243, products: 1287, profit: 34210, growth_adj: 1.00 },
    North: { total_sales: 41230,  customers: 2870, products: 512,  profit: 12980, growth_adj: 1.09 },
    South: { total_sales: 29810,  customers: 2210, products: 398,  profit: 7460,  growth_adj: 0.93 },
    West:  { total_sales: 33990,  customers: 2540, products: 431,  profit: 9870,  growth_adj: 1.05 },
    East:  { total_sales: 23370,  customers: 1623, products: 349,  profit: 3900,  growth_adj: 0.84 }
};

const DEMO_RANGES_BASE = {
    weekly: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [12800, 15200, 11800, 17600, 20100, 26400, 22300],
        caption: "total this week"
    },
    monthly: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        data: [84000, 91000, 78000, 102000, 113000, 121000, 128400, 118000, 109500, 124300, 131200, 142800],
        caption: "total this year"
    },
    quarterly: {
        labels: ["Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25"],
        data: [253000, 301000, 287000, 342000, 368000, 405000],
        caption: "total across shown quarters"
    }
};

// Bigger, filterable/sortable demo tables so the query builder has
// something real to work with.
const SALES_DB = [
    { id: 10231, product: "Wireless Mouse",    qty: 2, amount: 1198,  region: "West"  },
    { id: 10232, product: "Cotton T-Shirt",     qty: 1, amount: 799,   region: "South" },
    { id: 10233, product: "Bluetooth Speaker",  qty: 1, amount: 2299,  region: "North" },
    { id: 10234, product: "Running Shoes",      qty: 1, amount: 3499,  region: "West"  },
    { id: 10235, product: "Desk Lamp",          qty: 3, amount: 2637,  region: "East"  },
    { id: 10236, product: "Yoga Mat",           qty: 2, amount: 1598,  region: "South" },
    { id: 10237, product: "Coffee Maker",       qty: 1, amount: 4299,  region: "North" },
    { id: 10238, product: "Backpack",           qty: 1, amount: 1899,  region: "West"  },
    { id: 10239, product: "Sunglasses",         qty: 2, amount: 2398,  region: "South" },
    { id: 10240, product: "Notebook Set",       qty: 4, amount: 796,   region: "East"  },
    { id: 10241, product: "Water Bottle",       qty: 3, amount: 897,   region: "North" },
    { id: 10242, product: "Office Chair",       qty: 1, amount: 6499,  region: "West"  },
    { id: 10243, product: "Wireless Mouse",     qty: 1, amount: 599,   region: "East"  },
    { id: 10244, product: "Bluetooth Speaker",  qty: 2, amount: 4598,  region: "South" },
    { id: 10245, product: "Running Shoes",      qty: 2, amount: 6998,  region: "North" },
    { id: 10246, product: "Desk Lamp",          qty: 1, amount: 879,   region: "West"  },
    { id: 10247, product: "Coffee Maker",       qty: 1, amount: 4299,  region: "East"  },
    { id: 10248, product: "Yoga Mat",           qty: 1, amount: 799,   region: "North" },
    { id: 10249, product: "Backpack",           qty: 2, amount: 3798,  region: "South" },
    { id: 10250, product: "Office Chair",       qty: 2, amount: 12998, region: "West"  },
    { id: 10251, product: "Sunglasses",         qty: 1, amount: 1199,  region: "East"  },
    { id: 10252, product: "Notebook Set",       qty: 6, amount: 1194,  region: "North" },
    { id: 10253, product: "Water Bottle",       qty: 5, amount: 1495,  region: "South" },
    { id: 10254, product: "Cotton T-Shirt",     qty: 3, amount: 2397,  region: "West"  }
];

const CUSTOMERS_DB = [
    { id: 5510, name: "A. Sharma",   lifetime_value: 18420, orders: 14, region: "North" },
    { id: 5511, name: "R. Mehta",    lifetime_value: 9210,  orders: 6,  region: "South" },
    { id: 5512, name: "K. Iyer",     lifetime_value: 24310, orders: 19, region: "West"  },
    { id: 5513, name: "P. Das",      lifetime_value: 5420,  orders: 3,  region: "East"  },
    { id: 5514, name: "S. Verma",    lifetime_value: 14870, orders: 11, region: "North" },
    { id: 5515, name: "N. Gupta",    lifetime_value: 8120,  orders: 5,  region: "South" },
    { id: 5516, name: "T. Nair",     lifetime_value: 31200, orders: 23, region: "West"  },
    { id: 5517, name: "M. Roy",      lifetime_value: 4310,  orders: 2,  region: "East"  },
    { id: 5518, name: "J. Kapoor",   lifetime_value: 16980, orders: 12, region: "North" },
    { id: 5519, name: "V. Reddy",    lifetime_value: 12040, orders: 9,  region: "South" },
    { id: 5520, name: "D. Chawla",   lifetime_value: 27650, orders: 20, region: "West"  },
    { id: 5521, name: "H. Bose",     lifetime_value: 3980,  orders: 2,  region: "East"  }
];

const PRODUCTS_DB = [
    { sku: "SKU-2291", name: "Running Shoes",     stock: 184, margin_pct: 38.2, category: "Footwear"    },
    { sku: "SKU-1187", name: "Desk Lamp",         stock: 412, margin_pct: 44.9, category: "Home"        },
    { sku: "SKU-3305", name: "Wireless Mouse",    stock: 640, margin_pct: 51.4, category: "Electronics" },
    { sku: "SKU-4410", name: "Bluetooth Speaker", stock: 220, margin_pct: 33.7, category: "Electronics" },
    { sku: "SKU-5522", name: "Cotton T-Shirt",    stock: 980, margin_pct: 58.1, category: "Apparel"     },
    { sku: "SKU-6633", name: "Yoga Mat",          stock: 305, margin_pct: 41.0, category: "Fitness"     },
    { sku: "SKU-7744", name: "Coffee Maker",      stock: 92,  margin_pct: 29.6, category: "Home"        },
    { sku: "SKU-8855", name: "Backpack",          stock: 267, margin_pct: 47.3, category: "Accessories" },
    { sku: "SKU-9966", name: "Sunglasses",        stock: 401, margin_pct: 54.8, category: "Accessories" },
    { sku: "SKU-1077", name: "Notebook Set",      stock: 812, margin_pct: 62.0, category: "Stationery"  },
    { sku: "SKU-1188", name: "Water Bottle",      stock: 553, margin_pct: 49.5, category: "Fitness"     },
    { sku: "SKU-1299", name: "Office Chair",      stock: 58,  margin_pct: 27.1, category: "Furniture"   }
];

const REGIONS_DB = [
    { region: "North", sales: 41230, growth_pct: 12.4 },
    { region: "South", sales: 29810, growth_pct: 5.1 },
    { region: "West", sales: 33990, growth_pct: 9.8 },
    { region: "East", sales: 23370, growth_pct: -1.2 }
];

const HEALTH_DEMO = { status: "ok", database: "connected", uptime_seconds: 184213, version: "1.4.2" };

// ---------- Query engines (client-side filter/sort/paginate) ----------

function paginate(rows, params, defaultPageSize = 5) {
    const total_records = rows.length;
    const page = Math.max(1, Number(params.page) || 1);
    const page_size = Math.max(1, Number(params.page_size) || defaultPageSize);
    const start = (page - 1) * page_size;
    const results = rows.slice(start, start + page_size);
    return { page, page_size, total_records, results };
}

function sortRows(rows, sortKey, order) {
    if (!sortKey) return rows;
    const dir = order === "asc" ? 1 : -1;
    return rows.slice().sort((a, b) => {
        if (a[sortKey] === b[sortKey]) return 0;
        return a[sortKey] > b[sortKey] ? dir : -dir;
    });
}

function querySales(params) {
    let rows = SALES_DB.slice();
    if (params.region) rows = rows.filter(r => r.region === params.region);
    if (params.product) rows = rows.filter(r => r.product.toLowerCase().includes(params.product.toLowerCase()));
    if (params.min_amount) rows = rows.filter(r => r.amount >= Number(params.min_amount));
    rows = sortRows(rows, params.sort || "id", params.order || "desc");
    return paginate(rows, params);
}

function queryCustomers(params) {
    let rows = CUSTOMERS_DB.slice();
    if (params.region) rows = rows.filter(r => r.region === params.region);
    if (params.search) rows = rows.filter(r => r.name.toLowerCase().includes(params.search.toLowerCase()));
    if (params.min_ltv) rows = rows.filter(r => r.lifetime_value >= Number(params.min_ltv));
    rows = sortRows(rows, params.sort || "lifetime_value", params.order || "desc");
    return paginate(rows, params);
}

function queryProducts(params) {
    let rows = PRODUCTS_DB.slice();
    if (params.search) rows = rows.filter(r =>
        r.name.toLowerCase().includes(params.search.toLowerCase()) ||
        r.sku.toLowerCase().includes(params.search.toLowerCase())
    );
    if (params.min_stock) rows = rows.filter(r => r.stock >= Number(params.min_stock));
    rows = sortRows(rows, params.sort || "stock", params.order || "desc");
    return paginate(rows, params);
}

function queryRegions(params) {
    let rows = REGIONS_DB.slice();
    rows = sortRows(rows, params.sort || "sales", params.order || "desc");
    return paginate(rows, params, 10);
}

function queryDashboard(params) {
    const region = params.region || "All";
    const stat = DEMO_DASHBOARD_BY_REGION[region] || DEMO_DASHBOARD_BY_REGION.All;
    return {
        region,
        total_sales: stat.total_sales,
        customers: stat.customers,
        products: stat.products,
        profit: stat.profit,
        monthly_sales: scaledSeries(DEMO_RANGES_BASE.monthly.data, region)
    };
}

function queryHealth() {
    return HEALTH_DEMO;
}

// ---------- Endpoint schema: drives the query builder UI ----------

const ENDPOINT_SCHEMA = {
    "/dashboard": {
        name: "Dashboard API",
        run: queryDashboard,
        fields: [
            { key: "region", label: "Region", type: "select", options: ["", "North", "South", "East", "West"] }
        ],
        columns: null // object response, not a row list
    },
    "/sales": {
        name: "Sales API",
        run: querySales,
        fields: [
            { key: "region", label: "Region", type: "select", options: ["", "North", "South", "East", "West"] },
            { key: "product", label: "Product contains", type: "text", placeholder: "e.g. Mouse" },
            { key: "min_amount", label: "Min amount (₹)", type: "number", placeholder: "0" },
            { key: "sort", label: "Sort by", type: "select", options: ["id", "amount", "qty", "product", "region"] },
            { key: "order", label: "Order", type: "select", options: ["desc", "asc"] },
            { key: "page", label: "Page", type: "number", placeholder: "1" },
            { key: "page_size", label: "Page size", type: "number", placeholder: "5" }
        ],
        columns: ["id", "product", "qty", "amount", "region"]
    },
    "/customers": {
        name: "Customer API",
        run: queryCustomers,
        fields: [
            { key: "region", label: "Region", type: "select", options: ["", "North", "South", "East", "West"] },
            { key: "search", label: "Name contains", type: "text", placeholder: "e.g. Sharma" },
            { key: "min_ltv", label: "Min lifetime value (₹)", type: "number", placeholder: "0" },
            { key: "sort", label: "Sort by", type: "select", options: ["lifetime_value", "orders", "name"] },
            { key: "order", label: "Order", type: "select", options: ["desc", "asc"] },
            { key: "page", label: "Page", type: "number", placeholder: "1" },
            { key: "page_size", label: "Page size", type: "number", placeholder: "5" }
        ],
        columns: ["id", "name", "region", "lifetime_value", "orders"]
    },
    "/products": {
        name: "Product API",
        run: queryProducts,
        fields: [
            { key: "search", label: "Name or SKU contains", type: "text", placeholder: "e.g. SKU-22" },
            { key: "min_stock", label: "Min stock", type: "number", placeholder: "0" },
            { key: "sort", label: "Sort by", type: "select", options: ["stock", "margin_pct", "name"] },
            { key: "order", label: "Order", type: "select", options: ["desc", "asc"] },
            { key: "page", label: "Page", type: "number", placeholder: "1" },
            { key: "page_size", label: "Page size", type: "number", placeholder: "5" }
        ],
        columns: ["sku", "name", "category", "stock", "margin_pct"]
    },
    "/regions": {
        name: "Region API",
        run: queryRegions,
        fields: [
            { key: "sort", label: "Sort by", type: "select", options: ["sales", "growth_pct", "region"] },
            { key: "order", label: "Order", type: "select", options: ["desc", "asc"] }
        ],
        columns: ["region", "sales", "growth_pct"]
    },
    "/health": {
        name: "Health API",
        run: queryHealth,
        fields: [],
        columns: null
    }
};

// ---------- Helpers ----------

function scaledSeries(baseValues, region) {
    if (region === "All" || !region) return baseValues.slice();
    const stat = DEMO_DASHBOARD_BY_REGION[region];
    const share = stat.total_sales / DEMO_DASHBOARD_BY_REGION.All.total_sales;
    return baseValues.map((v, i, arr) => {
        const scaled = v * share;
        return Math.round(i === arr.length - 1 ? scaled * stat.growth_adj : scaled);
    });
}

function previousPeriodSeries(values) {
    // Deterministic synthetic "previous period" for the compare overlay.
    return values.map(v => Math.round(v * 0.83));
}

function buildQueryString(params) {
    const parts = [];
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value === "" || value === null || value === undefined) return;
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return parts.length ? "?" + parts.join("&") : "";
}

// ---------- App state ----------

let salesChart = null;
let currentRangeKey = "weekly";
let currentChartType = "line";
let currentRegion = "All";
let compareEnabled = false;

const qb = {
    path: "/dashboard",
    params: {},
    view: "table",
    lastResponse: null,
    history: []
};

// ---------- Animated Counter ----------
function animateCounter(id, target, prefix = "", suffix = "") {

    const element = document.getElementById(id);

    if (!element) return;

    if (REDUCED_MOTION) {
        element.innerHTML = prefix + target.toLocaleString() + suffix;
        return;
    }

    let current = 0;

    const increment = Math.ceil(target / 40) || 1;

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.innerHTML = prefix + current.toLocaleString() + suffix;

    }, 20);

}


// ---------- Create / Update Sales Chart ----------
function createSalesChart(labels, values, type, compareValues) {

    const canvas = document.getElementById("salesChart");

    if (!canvas) return;

    const wantsCompare = !!compareValues;
    const currentDatasetCount = salesChart ? salesChart.data.datasets.length : 0;

    // Chart.js doesn't reliably support swapping type or dataset count on a
    // live instance with fill/line-specific options in play, so rebuild
    // whenever either changes.
    if (salesChart && (salesChart.config.type !== type || currentDatasetCount !== (wantsCompare ? 2 : 1))) {
        salesChart.destroy();
        salesChart = null;
    }

    const isBar = type === "bar";

    const datasets = [
        {
            label: "Sales",
            data: values,
            borderColor: "#38bdf8",
            backgroundColor: isBar ? "rgba(56,189,248,0.55)" : "rgba(56,189,248,0.20)",
            borderRadius: isBar ? 8 : 0,
            fill: !isBar,
            borderWidth: isBar ? 0 : 4,
            tension: 0.4,
            pointRadius: isBar ? 0 : 5,
            pointHoverRadius: isBar ? 0 : 7,
            pointBackgroundColor: "#ffffff",
            order: 1
        }
    ];

    if (wantsCompare) {
        datasets.push({
            label: "Previous period",
            data: compareValues,
            borderColor: "rgba(148,163,184,0.9)",
            backgroundColor: "rgba(148,163,184,0.12)",
            borderRadius: isBar ? 8 : 0,
            fill: false,
            borderWidth: isBar ? 0 : 3,
            borderDash: isBar ? [] : [6, 5],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            order: 2
        });
    }

    if (salesChart) {
        salesChart.data.labels = labels;
        salesChart.data.datasets[0].data = values;
        if (wantsCompare) salesChart.data.datasets[1].data = compareValues;
        salesChart.update();
        return;
    }

    salesChart = new Chart(canvas, {

        type: type,

        data: { labels: labels, datasets: datasets },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: { duration: REDUCED_MOTION ? 0 : 700 },

            interaction: { mode: "index", intersect: false },

            plugins: {

                legend: {
                    display: wantsCompare,
                    labels: { color: "#dbeafe", boxWidth: 14, usePointStyle: true }
                },

                tooltip: {

                    backgroundColor: "#1e293b",
                    titleColor: "#ffffff",
                    bodyColor: "#dbeafe",
                    padding: 10,

                    callbacks: {

                        label: (ctx) => (ctx.dataset.label || "") + ": ₹" + ctx.parsed.y.toLocaleString()

                    }

                }

            },

            scales: {

                x: {
                    ticks: { color: "white" },
                    grid: { color: "rgba(255,255,255,.1)" }
                },

                y: {
                    ticks: {
                        color: "white",
                        callback: (v) => "₹" + (v / 1000) + "k"
                    },
                    grid: { color: "rgba(255,255,255,.1)" }
                }

            }

        }

    });

}


// ---------- Chart summary (total + growth badge) ----------
function updateChartMeta(range) {

    const totalEl = document.getElementById("chartTotal");
    const growthEl = document.getElementById("chartGrowth");
    const captionEl = document.getElementById("chartCaption");

    if (!totalEl || !growthEl) return;

    const values = range.data;
    const total = values.reduce((sum, v) => sum + v, 0);
    const first = values[0];
    const last = values[values.length - 1];
    const growthPct = first ? ((last - first) / first) * 100 : 0;
    const isUp = growthPct >= 0;

    totalEl.textContent = "₹" + Math.round(total).toLocaleString();

    growthEl.textContent = (isUp ? "▲ " : "▼ ") + Math.abs(growthPct).toFixed(1) + "%";
    growthEl.classList.toggle("up", isUp);
    growthEl.classList.toggle("down", !isUp);

    if (captionEl) {
        const regionNote = currentRegion === "All" ? "" : " · " + currentRegion + " region";
        captionEl.textContent = range.caption + " · start-to-end trend" + regionNote;
    }

}


// ---------- Render a given range + type together ----------
function renderChart(rangeKey, type) {

    const base = DEMO_RANGES_BASE[rangeKey];

    if (!base) return;

    currentRangeKey = rangeKey;
    currentChartType = type || currentChartType;

    const data = scaledSeries(base.data, currentRegion);
    const range = { labels: base.labels, data: data, caption: base.caption };

    const compareValues = compareEnabled ? previousPeriodSeries(data) : null;

    createSalesChart(range.labels, range.data, currentChartType, compareValues);
    updateChartMeta(range);

}


// ---------- Region filter ----------
function applyRegion(region) {

    currentRegion = region;

    const stat = DEMO_DASHBOARD_BY_REGION[region];

    animateCounter("salesCounter", stat.total_sales, "₹");
    animateCounter("customerCounter", stat.customers);
    animateCounter("productCounter", stat.products);
    animateCounter("profitCounter", stat.profit, "₹");

    const heading = document.getElementById("regionHeading");
    if (heading) heading.textContent = region === "All" ? "All regions" : region + " region";

    document.querySelectorAll(".kpi-card").forEach(card => {
        card.classList.add("region-updating");
        setTimeout(() => card.classList.remove("region-updating"), 500);
    });

    renderChart(currentRangeKey, currentChartType);

}

function setupRegionFilter() {

    const row = document.getElementById("regionFilter");

    if (!row) return;

    row.addEventListener("click", (e) => {

        const btn = e.target.closest("button");

        if (!btn) return;

        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        applyRegion(btn.dataset.region);

    });

}

function setupCompareToggle() {

    const toggle = document.getElementById("compareToggle");

    if (!toggle) return;

    toggle.addEventListener("change", () => {
        compareEnabled = toggle.checked;
        renderChart(currentRangeKey, currentChartType);
    });

}


// ---------- Load Dashboard Data ----------
async function loadDashboard() {

    try {

        const response = await fetch("/dashboard/");

        if (!response.ok) {
            throw new Error("Dashboard API Error");
        }

        const data = await response.json();

        DEMO_DASHBOARD_BY_REGION.All.total_sales = data.total_sales;
        DEMO_DASHBOARD_BY_REGION.All.customers = data.customers;
        DEMO_DASHBOARD_BY_REGION.All.products = data.products;
        DEMO_DASHBOARD_BY_REGION.All.profit = data.profit;

        if (data.monthly_sales) DEMO_RANGES_BASE.monthly.data = data.monthly_sales;

    }

    catch (error) {

        console.log("Dashboard API unavailable — showing demo data.");

    }

    applyRegion(currentRegion);

}


// ---------- API Health Check ----------
async function checkHealth() {

    try {

        const response = await fetch("/health");

        const data = await response.json();

        console.log("API Health:", data);

    }

    catch {

        console.log("Health API Offline");

    }

}


// ---------- Chart Range Toggle ----------
function setupRangeChips() {

    const chipRow = document.getElementById("rangeChips");

    if (!chipRow) return;

    chipRow.addEventListener("click", (e) => {

        const btn = e.target.closest("button");

        if (!btn) return;

        chipRow.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        renderChart(btn.dataset.range, currentChartType);

    });

}


// ---------- Chart Type Toggle ----------
function setupTypeChips() {

    const chipRow = document.getElementById("typeChips");

    if (!chipRow) return;

    chipRow.addEventListener("click", (e) => {

        const btn = e.target.closest("button");

        if (!btn) return;

        chipRow.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        renderChart(currentRangeKey, btn.dataset.type);

    });

}


// ==========================================================
// Advanced API Explorer / Query Builder
// ==========================================================

function renderQueryFields() {

    const container = document.getElementById("queryFields");
    const methodBadge = document.getElementById("qbMethod");
    const nameEl = document.getElementById("qbEndpointName");

    if (!container) return;

    const schema = ENDPOINT_SCHEMA[qb.path];

    if (methodBadge) methodBadge.textContent = "GET";
    if (nameEl) nameEl.textContent = schema.name;

    container.innerHTML = "";

    if (!schema.fields.length) {
        const note = document.createElement("p");
        note.style.color = "#94a3b8";
        note.style.fontSize = "13px";
        note.style.margin = "0";
        note.textContent = "This endpoint takes no query parameters — just run it.";
        container.appendChild(note);
        return;
    }

    schema.fields.forEach(field => {

        const wrap = document.createElement("div");
        wrap.className = "field";

        const label = document.createElement("label");
        label.textContent = field.label;
        label.setAttribute("for", "qf_" + field.key);
        wrap.appendChild(label);

        let input;

        if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const o = document.createElement("option");
                o.value = opt;
                o.textContent = opt === "" ? "Any" : opt;
                input.appendChild(o);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            if (field.placeholder) input.placeholder = field.placeholder;
        }

        input.id = "qf_" + field.key;
        input.value = qb.params[field.key] || "";

        input.addEventListener("input", () => {
            qb.params[field.key] = input.value;
            updateUrlPreview();
        });

        wrap.appendChild(input);
        container.appendChild(wrap);

    });

}

function updateUrlPreview() {

    const preview = document.getElementById("queryUrlPreview");

    if (!preview) return;

    const qs = buildQueryString(qb.params);
    preview.textContent = "GET " + qb.path + qs;

}

function selectEndpoint(path) {

    qb.path = path;
    qb.params = {};

    document.querySelectorAll(".api-card").forEach(c => c.classList.toggle("active", c.dataset.path === path));

    renderQueryFields();
    updateUrlPreview();

}

function addHistoryEntry(path, params) {

    const qs = buildQueryString(params);
    const label = path + qs;

    qb.history = qb.history.filter(h => h !== label);
    qb.history.unshift(label);
    qb.history = qb.history.slice(0, 6);

    renderHistory();

}

function renderHistory() {

    const row = document.getElementById("queryHistory");
    const empty = document.getElementById("historyEmpty");

    if (!row) return;

    row.querySelectorAll(".history-chip").forEach(c => c.remove());

    if (!qb.history.length) {
        if (empty) empty.style.display = "inline";
        return;
    }

    if (empty) empty.style.display = "none";

    qb.history.forEach(entry => {

        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "history-chip";
        chip.textContent = entry;

        chip.addEventListener("click", () => {

            const [path, qs] = entry.split("?");
            const params = {};

            if (qs) {
                qs.split("&").forEach(pair => {
                    const [k, v] = pair.split("=");
                    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || "");
                });
            }

            selectEndpoint(path);
            qb.params = params;
            renderQueryFields();
            updateUrlPreview();
            runQuery();

        });

        row.appendChild(chip);

    });

}

function renderStatus(ok, latencyMs, count) {

    const statusBadge = document.getElementById("statusBadge");
    const latencyBadge = document.getElementById("latencyBadge");
    const countBadge = document.getElementById("countBadge");

    if (statusBadge) {
        statusBadge.textContent = ok ? "200 OK" : "500 Error";
        statusBadge.classList.toggle("error", !ok);
    }

    if (latencyBadge) latencyBadge.textContent = latencyMs + " ms";

    if (countBadge) countBadge.textContent = count === null ? "single object" : count + (count === 1 ? " record" : " records");

}

function renderTable(payload, columns) {

    const wrap = document.getElementById("tableView");
    const headRow = document.getElementById("tableHeadRow");
    const bodyRows = document.getElementById("tableBodyRows");
    const emptyMsg = document.getElementById("tableEmpty");
    const table = document.getElementById("dataTable");

    if (!wrap) return;

    headRow.innerHTML = "";
    bodyRows.innerHTML = "";

    const rows = payload.results;

    if (!columns || !rows) {
        // Single-object response (dashboard / health) — show as key/value rows.
        const displayCols = ["field", "value"];
        const kvRows = Object.entries(payload)
            .filter(([k]) => k !== "monthly_sales")
            .map(([k, v]) => ({ field: k, value: Array.isArray(v) ? v.join(", ") : v }));
        buildTableRows(kvRows, displayCols, headRow, bodyRows);
        table.style.display = kvRows.length ? "table" : "none";
        emptyMsg.style.display = kvRows.length ? "none" : "block";
        return;
    }

    buildTableRows(rows, columns, headRow, bodyRows);
    table.style.display = rows.length ? "table" : "none";
    emptyMsg.style.display = rows.length ? "none" : "block";

}

function formatCell(col, val) {
    if (typeof val === "number" && (col.includes("amount") || col.includes("value") || col === "sales" || col === "profit")) {
        return "₹" + val.toLocaleString();
    }
    return val === undefined ? "—" : val;
}

function buildTableRowsOnly(rows, columns, bodyRows) {
    rows.forEach(row => {
        const tr = document.createElement("tr");
        columns.forEach(col => {
            const td = document.createElement("td");
            td.textContent = formatCell(col, row[col]);
            tr.appendChild(td);
        });
        bodyRows.appendChild(tr);
    });
}

function buildTableRows(rows, columns, headRow, bodyRows) {

    columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col.replace(/_/g, " ");
        th.dataset.col = col;
        headRow.appendChild(th);
    });

    buildTableRowsOnly(rows, columns, bodyRows);

    // Client-side column sort on the already-fetched page of rows.
    headRow.querySelectorAll("th").forEach(th => {
        th.addEventListener("click", () => {

            const col = th.dataset.col;
            const asc = !(th.classList.contains("sorted") && th.classList.contains("asc"));

            headRow.querySelectorAll("th").forEach(h => h.classList.remove("sorted", "asc"));
            th.classList.add("sorted");
            if (asc) th.classList.add("asc");

            const sorted = rows.slice().sort((a, b) => {
                if (a[col] === b[col]) return 0;
                return (a[col] > b[col] ? 1 : -1) * (asc ? 1 : -1);
            });

            bodyRows.innerHTML = "";
            buildTableRowsOnly(sorted, columns, bodyRows);

        });
    });

}

function renderPagination(payload) {

    const row = document.getElementById("paginationRow");
    const indicator = document.getElementById("pageIndicator");
    const prevBtn = document.getElementById("prevPageBtn");
    const nextBtn = document.getElementById("nextPageBtn");

    if (!row) return;

    if (!payload.results || payload.total_records === undefined) {
        row.classList.add("hidden");
        return;
    }

    row.classList.remove("hidden");

    const totalPages = Math.max(1, Math.ceil(payload.total_records / payload.page_size));

    indicator.textContent = "Page " + payload.page + " of " + totalPages + " · " + payload.total_records + " total";

    prevBtn.disabled = payload.page <= 1;
    nextBtn.disabled = payload.page >= totalPages;

    prevBtn.onclick = () => {
        qb.params.page = String(payload.page - 1);
        renderQueryFields();
        updateUrlPreview();
        runQuery();
    };

    nextBtn.onclick = () => {
        qb.params.page = String(payload.page + 1);
        renderQueryFields();
        updateUrlPreview();
        runQuery();
    };

}

function setActiveView(view) {

    qb.view = view;

    document.querySelectorAll("#viewTabs button").forEach(b => b.classList.toggle("active", b.dataset.view === view));

    const tableWrap = document.getElementById("tableView");
    const jsonView = document.getElementById("consoleBody");

    tableWrap.classList.toggle("hidden", view !== "table");
    jsonView.classList.toggle("hidden", view !== "json");

}

async function runQuery() {

    const schema = ENDPOINT_SCHEMA[qb.path];
    const consoleBox = document.getElementById("console");
    const runBtn = document.getElementById("runQueryBtn");

    if (!schema) return;

    if (runBtn) {
        runBtn.disabled = true;
        runBtn.textContent = "Running…";
    }

    const start = performance.now();
    const qs = buildQueryString(qb.params);

    let payload;
    let ok = true;

    try {

        const response = await fetch(qb.path + qs);
        if (!response.ok) throw new Error("Endpoint unavailable");
        payload = await response.json();

    } catch {

        // Simulate a small, realistic network delay for the demo data path.
        await new Promise(res => setTimeout(res, REDUCED_MOTION ? 0 : 250 + Math.random() * 250));

        try {
            payload = schema.run(qb.params);
        } catch (err) {
            ok = false;
            payload = { message: "Could not run this query.", error: String(err) };
        }

    }

    const latencyMs = Math.round(performance.now() - start);

    qb.lastResponse = payload;

    renderStatus(ok, latencyMs, payload && payload.results ? payload.results.length : (schema.columns ? 0 : null));
    renderTable(payload, schema.columns);
    document.getElementById("consoleBody").textContent = JSON.stringify(payload, null, 2);
    renderPagination(payload);
    setActiveView(qb.view);

    addHistoryEntry(qb.path, qb.params);

    consoleBox.classList.add("open");
    consoleBox.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "nearest" });

    if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = "Run query";
    }

}

function setupQueryBuilder() {

    const apiGrid = document.getElementById("apiGrid");
    const runBtn = document.getElementById("runQueryBtn");
    const resetBtn = document.getElementById("resetQueryBtn");
    const viewTabs = document.getElementById("viewTabs");
    const copyBtn = document.getElementById("copyBtn");
    const curlBtn = document.getElementById("curlBtn");
    const csvBtn = document.getElementById("csvBtn");

    if (apiGrid) {
        apiGrid.addEventListener("click", (e) => {
            const card = e.target.closest(".api-card");
            if (!card) return;
            selectEndpoint(card.dataset.path);
            runQuery();
        });
    }

    if (runBtn) runBtn.addEventListener("click", runQuery);

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            qb.params = {};
            renderQueryFields();
            updateUrlPreview();
        });
    }

    if (viewTabs) {
        viewTabs.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;
            setActiveView(btn.dataset.view);
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            if (!qb.lastResponse) return;
            copyText(JSON.stringify(qb.lastResponse, null, 2));
        });
    }

    if (curlBtn) {
        curlBtn.addEventListener("click", () => {
            const qs = buildQueryString(qb.params);
            copyText("curl -X GET \"https://your-api-host" + qb.path + qs + "\"");
        });
    }

    if (csvBtn) {
        csvBtn.addEventListener("click", () => {
            downloadCsv();
        });
    }

    // KPI cards also route through the query builder.
    document.querySelectorAll(".kpi-card[data-endpoint]").forEach(card => {

        const activate = () => {
            selectEndpoint(card.dataset.endpoint);
            if (card.dataset.endpoint === "/dashboard") {
                qb.params.region = currentRegion === "All" ? "" : currentRegion;
                renderQueryFields();
                updateUrlPreview();
            }
            runQuery();
            document.getElementById("api").scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth" });
        };

        card.addEventListener("click", activate);

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                activate();
            }
        });

        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-10px) scale(1.03)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0px) scale(1)";
        });

    });

    renderQueryFields();
    updateUrlPreview();

}

function copyText(text) {

    navigator.clipboard.writeText(text).then(showToast).catch(() => {

        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast();

    });

}

function downloadCsv() {

    const payload = qb.lastResponse;

    if (!payload) return;

    const rows = payload.results || [Object.fromEntries(Object.entries(payload).filter(([, v]) => !Array.isArray(v)))];

    if (!rows.length) return;

    const columns = Object.keys(rows[0]);
    const lines = [columns.join(",")];

    rows.forEach(row => {
        lines.push(columns.map(c => JSON.stringify(row[c] ?? "")).join(","));
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = qb.path.replace("/", "") + "_export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast();

}


function showToast() {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.classList.add("show");

    clearTimeout(showToast._timer);

    showToast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);

}


// ---------- Fade In ----------
window.onload = () => {

    document.body.style.opacity = 0;

    document.body.style.transition = REDUCED_MOTION ? "0s" : "1s";

    setTimeout(() => {

        document.body.style.opacity = 1;

    }, 200);

};


// ---------- Console Message ----------
console.log(
    "%cRetail Sales Intelligence Platform",
    "color:#38bdf8;font-size:24px;font-weight:bold;"
);

console.log(
    "%cDeveloped by Sumit Bera",
    "color:#22c55e;font-size:16px;"
);


// ---------- Load Everything ----------
loadDashboard();

checkHealth();

setupRegionFilter();

setupCompareToggle();

setupRangeChips();

setupTypeChips();

setupQueryBuilder();