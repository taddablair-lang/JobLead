// ========================================
// JobLead - Main App
// ========================================

let leads = [];


// ========================================
// PAGE NAVIGATION
// ========================================

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-button");

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    const button = document.querySelector(
        `.nav-button[data-page="${pageId}"]`
    );

    if (button) {
        button.classList.add("active");
    }
}


// Navigation buttons

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});


// "View All" button on dashboard

document.querySelectorAll("[data-page]").forEach(button => {

    if (!button.classList.contains("nav-button")) {

        button.addEventListener("click", () => {

            showPage(button.dataset.page);

        });

    }

});


// ========================================
// LEAD STORAGE
// ========================================

function saveLeads() {

    localStorage.setItem(
        "joblead_leads",
        JSON.stringify(leads)
    );

}


function loadLeads() {

    const saved =
        localStorage.getItem("joblead_leads");

    if (saved) {

        try {

            leads = JSON.parse(saved);

        } catch {

            leads = [];

        }

    }

}


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    const total =
        document.getElementById("totalLeads");

    const newCount =
        document.getElementById("newLeads");

    const followUps =
        document.getElementById("followUps");

    const booked =
        document.getElementById("bookedJobs");


    const newLeads =
        leads.filter(lead => lead.status === "New");

    const followUpLeads =
        leads.filter(lead => lead.status === "Follow-Up");

    const bookedLeads =
        leads.filter(lead => lead.status === "Booked");


    total.textContent = leads.length;

    newCount.textContent =
        newLeads.length;

    followUps.textContent =
        followUpLeads.length;

    booked.textContent =
        bookedLeads.length;


    renderRecentLeads();

}


// ========================================
// RENDER RECENT LEADS
// ========================================

function renderRecentLeads() {

    const container =
        document.getElementById("recentLeads");

    if (leads.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">📋</div>

                <h3>No leads yet</h3>

                <p>
                    Add a test lead or send someone your quote form.
                </p>

            </div>

        `;

        return;
    }


    const recent =
        leads.slice(0, 5);


    container.innerHTML =
        recent.map(lead => createLeadHTML(lead)).join("");

}


// ========================================
// RENDER ALL LEADS
// ========================================

function renderAllLeads(list = leads) {

    const container =
        document.getElementById("allLeads");


    if (list.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">👥</div>

                <h3>No leads found</h3>

                <p>
                    Your customer inquiries will appear here.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        list.map(lead => createLeadHTML(lead)).join("");

}


// ========================================
// CREATE LEAD HTML
// ========================================

function createLeadHTML(lead) {

    return `

        <div class="lead">

            <div>

                <h3>
                    ${escapeHTML(lead.name)}
                </h3>

                <span class="status">
                    ${escapeHTML(lead.status)}
                </span>

                <p>
                    <strong>Service:</strong>
                    ${escapeHTML(lead.service)}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(lead.phone)}
                </p>

                ${
                    lead.email
                        ? `<p>
                            <strong>Email:</strong>
                            ${escapeHTML(lead.email)}
                           </p>`
                        : ""
                }

                ${
                    lead.address
                        ? `<p>
                            <strong>Address:</strong>
                            ${escapeHTML(lead.address)}
                           </p>`
                        : ""
                }

                ${
                    lead.message
                        ? `<p>
                            ${escapeHTML(lead.message)}
                           </p>`
                        : ""
                }

            </div>

            <div class="lead-actions">

                <select
                    onchange="changeLeadStatus('${lead.id}', this.value)"
                >

                    <option
                        value="New"
                        ${lead.status === "New" ? "selected" : ""}
                    >
                        New
                    </option>

                    <option
                        value="Follow-Up"
                        ${lead.status === "Follow-Up" ? "selected" : ""}
                    >
                        Follow-Up
                    </option>

                    <option
                        value="Booked"
                        ${lead.status === "Booked" ? "selected" : ""}
                    >
                        Booked
                    </option>

                    <option
                        value="Completed"
                        ${lead.status === "Completed" ? "selected" : ""}
                    >
                        Completed
                    </option>

                </select>

                <button
                    class="secondary-button"
                    onclick="deleteLead('${lead.id}')"
                >
                    Delete
                </button>

            </div>

        </div>

    `;
}


// ========================================
// ADD TEST LEAD
// ========================================

function addTestLead() {

    const lead = {

        id:
            Date.now().toString(),

        name:
            "John Smith",

        phone:
            "(435) 555-0199",

        email:
            "john@example.com",

        service:
            "Lawn Mowing",

        address:
            "123 Main Street",

        message:
            "Looking for a quote for weekly lawn service.",

        status:
            "New",

        created:
            new Date().toISOString()

    };


    leads.unshift(lead);

    saveLeads();

    updateDashboard();

    renderAllLeads();

}


document
    .getElementById("addTestLead")
    .addEventListener("click", addTestLead);


// ========================================
// ADD LEAD BUTTON
// ========================================

document
    .getElementById("addLeadButton")
    .addEventListener("click", () => {

        showPage("quotes");

    });


// ========================================
// CHANGE LEAD STATUS
// ========================================

function changeLeadStatus(id, newStatus) {

    const lead =
        leads.find(item => item.id === id);

    if (!lead) {
        return;
    }


    lead.status = newStatus;

    saveLeads();

    updateDashboard();

    renderAllLeads();

}


// ========================================
// DELETE LEAD
// ========================================

function deleteLead(id) {

    const confirmed =
        confirm("Delete this lead?");

    if (!confirmed) {
        return;
    }


    leads =
        leads.filter(
            lead => lead.id !== id
        );


    saveLeads();

    updateDashboard();

    renderAllLeads();

}


// ========================================
// QUOTE FORM
// ========================================

document
    .getElementById("quoteForm")
    .addEventListener("submit", event => {

        event.preventDefault();


        const form =
            event.target;


        const formData =
            new FormData(form);


        const lead = {

            id:
                Date.now().toString(),

            name:
                formData.get("name") || "",

            phone:
                formData.get("phone") || "",

            email:
                formData.get("email") || "",

            service:
                formData.get("service") || "",

            address:
                formData.get("address") || "",

            message:
                formData.get("message") || "",

            status:
                "New",

            created:
                new Date().toISOString()

        };


        leads.unshift(lead);

        saveLeads();

        updateDashboard();

        renderAllLeads();

        form.reset();


        alert(
            "Quote request submitted successfully!"
        );


        showPage("dashboard");

    });


// ========================================
// SEARCH
// ========================================

document
    .getElementById("leadSearch")
    .addEventListener("input", event => {

        const search =
            event.target.value
                .toLowerCase()
                .trim();


        if (!search) {

            renderAllLeads();

            return;

        }


        const filtered =
            leads.filter(lead => {

                const text = [

                    lead.name,
                    lead.phone,
                    lead.email,
                    lead.service,
                    lead.address,
                    lead.message,
                    lead.status

                ]
                    .join(" ")
                    .toLowerCase();


                return text.includes(search);

            });


        renderAllLeads(filtered);

    });


// ========================================
// BUSINESS SETUP
// ========================================

const businessForm =
    document.getElementById("businessForm");


businessForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const formData =
            new FormData(businessForm);


        const business = {

            name:
                formData.get("businessName") || "",

            owner:
                formData.get("owner") || "",

            phone:
                formData.get("phone") || "",

            email:
                formData.get("email") || "",

            address:
                formData.get("address") || "",

            serviceArea:
                formData.get("serviceArea") || "",

            services:
                formData.get("services") || ""

        };


        localStorage.setItem(
            "joblead_business",
            JSON.stringify(business)
        );


        alert(
            "Business information saved!"
        );

    }
);


// ========================================
// LOAD BUSINESS INFORMATION
// ========================================

function loadBusiness() {

    const saved =
        localStorage.getItem("joblead_business");


    if (!saved) {
        return;
    }


    try {

        const business =
            JSON.parse(saved);


        document.getElementById(
            "businessName"
        ).value =
            business.name || "";


        document.getElementById(
            "ownerName"
        ).value =
            business.owner || "";


        document.getElementById(
            "businessPhone"
        ).value =
            business.phone || "";


        document.getElementById(
            "businessEmail"
        ).value =
            business.email || "";


        document.getElementById(
            "businessAddress"
        ).value =
            business.address || "";


        document.getElementById(
            "serviceArea"
        ).value =
            business.serviceArea || "";


        document.getElementById(
            "services"
        ).value =
            business.services || "";

    } catch {

        console.log(
            "Could not load business information."
        );

    }

}


// ========================================
// SECURITY
// ========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ========================================
// START APP
// ========================================

loadLeads();

loadBusiness();

updateDashboard();

renderAllLeads();
