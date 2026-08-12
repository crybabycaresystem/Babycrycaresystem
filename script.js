// ======================================
// Baby Cry AI Monitoring System
// ======================================

// IMPORTANT:
// Change this IP if your ESP32 gets a different IP address.
const ESP32_IP = "172.20.10.4";

let currentStatus = "NO CRY";
let confidence = 0;

// ======================================
// Random Reply Function
// ======================================

function randomReply(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ======================================
// Automatic AI Recommendation
// ======================================

function updateAdvice(status) {

    const advice = document.getElementById("autoAdvice");

    if (!advice) return;

    if (status === "HUNGER") {

        advice.innerHTML = `
            <h3>🍼 Current Status: HUNGER</h3>

            <p><b>Suggested Actions:</b></p>

            <ul>
                <li>Feed the baby if it is feeding time.</li>
                <li>Burp the baby after feeding.</li>
                <li>Monitor whether the crying stops.</li>
                <li>Continue observing the baby after feeding.</li>
            </ul>
        `;
    }

    else if (status === "DISTRESS") {

        advice.innerHTML = `
            <h3>🚨 Current Status: DISTRESS</h3>

            <p><b>Suggested Actions:</b></p>

            <ul>
                <li>Check the diaper.</li>
                <li>Check room temperature.</li>
                <li>Comfort the baby by gently rocking.</li>
                <li>Seek medical advice if crying continues.</li>
            </ul>
        `;
    }

    else {

        advice.innerHTML = `
            <h3>😊 Current Status: NO CRY</h3>

            <p>The baby appears calm.</p>

            <ul>
                <li>No action is required.</li>
                <li>Continue monitoring.</li>
                <li>Ensure the baby is comfortable.</li>
            </ul>
        `;
    }
}

// ======================================
// READ ESP32 STATUS
// ======================================

async function updateStatus() {

    try {

        const response = await fetch(
            `http://${ESP32_IP}/status?t=${Date.now()}`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "ESP32 returned HTTP " + response.status
            );
        }

        const data = await response.json();

        // ==================================
        // GET EXACT VALUES FROM ESP32
        // ==================================

        currentStatus = String(
            data.status || "NO CRY"
        ).toUpperCase();

        confidence = Number(
            data.confidence || 0
        );

        // ==================================
        // UPDATE CONFIDENCE
        // ==================================

        const confidenceElement =
            document.getElementById("confidence");

        if (confidenceElement) {

            confidenceElement.textContent =
                confidence.toFixed(1) + "%";
        }

        // ==================================
        // UPDATE TIME
        // ==================================

        const updateElement =
            document.getElementById("lastUpdate");

        if (updateElement) {

            updateElement.textContent =
                new Date().toLocaleTimeString();
        }

        // ==================================
        // UPDATE STATUS BOX
        // ==================================

        const box =
            document.getElementById("statusBox");

        if (box) {

            box.className = "status";

            if (currentStatus === "HUNGER") {

                box.classList.add("blue");

            }

            else if (currentStatus === "DISTRESS") {

                box.classList.add("red");

            }

            else {

                box.classList.add("green");

            }

            box.textContent = currentStatus;
        }

        // ==================================
        // UPDATE RECOMMENDATION
        // ==================================

        updateAdvice(currentStatus);

        console.log(
            "ESP32 STATUS:",
            currentStatus,
            "CONFIDENCE:",
            confidence.toFixed(1) + "%"
        );

    }

    catch (error) {

        console.error(
            "ESP32 connection failed:",
            error
        );

        const updateElement =
            document.getElementById("lastUpdate");

        if (updateElement) {

            updateElement.textContent =
                "ESP32 Offline";
        }
    }
}

// ======================================
// START LIVE UPDATES
// ======================================

updateStatus();

// Update every 1 second
setInterval(updateStatus, 1000);


// ======================================
// CHATBOT REPLY DATABASE
// ======================================

// Greeting

const helloReplies = [

    "Hello! 👋 I'm your Baby Care Assistant. How can I help today?",

    "Hi! Feel free to ask me anything about baby care.",

    "Hello! I can answer questions about crying, feeding, sleeping and newborn care.",

    "Hi there! 😊 Ask me anything about babies.",

    "Welcome! How can I assist you today?"

];

// Thanks

const thanksReplies = [

    "You're welcome! 😊",

    "Glad I could help.",

    "My pleasure!",

    "Happy to help anytime!",

    "You're most welcome!"

];

// Hunger

const hungerReplies = [

    "The AI suggests the baby may be hungry. Try feeding the baby.",

    "Hunger cries usually become more repetitive over time.",

    "If it has been a while since the last feed, offer milk if appropriate.",

    "Watch for rooting or sucking movements which are common hunger cues.",

    "After feeding, burp the baby gently.",

    "Frequent feeding is normal for newborns.",

    "Monitor whether the crying stops after feeding.",

    "Offer breast milk or formula if appropriate."

];

// Distress

const distressReplies = [

    "Check the baby's diaper first.",

    "Ensure the baby is not too hot or too cold.",

    "Comfort the baby by gently rocking or holding them.",

    "Check if clothing is too tight.",

    "Discomfort may be caused by a wet diaper.",

    "Observe whether the crying becomes calmer after comforting.",

    "Persistent distress should be checked by a healthcare professional.",

    "Make sure the baby's sleeping environment is comfortable."

];

// Sleeping

const sleepReplies = [

    "Newborns usually sleep between 14 and 17 hours each day.",

    "A quiet and dim environment can help babies sleep better.",

    "Rock the baby gently before putting them to sleep.",

    "Keep a consistent bedtime routine whenever possible.",

    "Some babies wake every few hours to feed, which is normal.",

    "Avoid overstimulation before bedtime.",

    "Swaddling may help some babies sleep better.",

    "Ensure the sleeping area is safe and comfortable."

];

// Feeding

const feedingReplies = [

    "Feed the baby whenever hunger cues appear.",

    "Burp the baby after feeding to reduce discomfort.",

    "Most newborns feed every 2–3 hours.",

    "Watch for rooting, sucking hands or lip smacking.",

    "Hold the baby upright after feeding.",

    "Avoid overfeeding the baby.",

    "Feeding on demand is common for newborns."

];

// Diaper

const diaperReplies = [

    "Check if the diaper is wet or dirty.",

    "A clean diaper can quickly calm a fussy baby.",

    "Ensure the diaper is not too tight.",

    "Check for diaper rash while changing.",

    "Keep the baby's skin clean and dry.",

    "Use the correct diaper size for comfort."

];

// Doctor

const doctorReplies = [

    "If the baby has a fever, seek medical attention.",

    "Persistent crying should be assessed by a healthcare professional.",

    "If breathing seems difficult, seek emergency care immediately.",

    "Contact your pediatrician if you are concerned.",

    "Trust your instincts if something feels wrong."

];

// No Cry

const noCryReplies = [

    "The baby appears calm.",

    "No crying is currently detected.",

    "The environment appears quiet.",

    "Continue normal monitoring.",

    "The baby seems comfortable.",

    "No action is required at the moment."

];

// Crying

const cryingReplies = [

    "Crying is a baby's primary way of communicating.",

    "Babies cry because of hunger, discomfort, tiredness or needing attention.",

    "Always check feeding, diaper and temperature first.",

    "Most crying is completely normal.",

    "If crying becomes excessive, consult a healthcare professional."

];

// Temperature

const temperatureReplies = [

    "Keep the room comfortably cool.",

    "A baby who is too hot or cold may become fussy.",

    "Avoid overdressing newborns.",

    "Check whether the baby's hands or neck feel unusually cold or warm.",

    "Maintain a comfortable room temperature."

];

// Burping

const burpReplies = [

    "Burp the baby after feeding.",

    "Holding the baby upright can help release swallowed air.",

    "Gently pat the baby's back while burping.",

    "Burping helps reduce discomfort after feeding.",

    "Some babies need several minutes before they burp."

];

// ======================================
// SEND QUESTION
// ======================================

function sendQuestion() {

    const input =
        document.getElementById("question");

    if (!input) return;

    const question =
        input.value.trim();

    if (question === "") return;

    const chat =
        document.getElementById("chatBox");

    if (!chat) return;

    chat.innerHTML += `
        <div class="userBubble">
            ${question}
        </div>
    `;

    input.value = "";

    chat.innerHTML += `
        <div class="typing" id="typing">
            Baby Care Assistant is typing...
        </div>
    `;

    chat.scrollTop =
        chat.scrollHeight;

    setTimeout(() => {

        const typing =
            document.getElementById("typing");

        if (typing) {
            typing.remove();
        }

        const answer =
            getAnswer(question);

        chat.innerHTML += `
            <div class="aiBubble">
                ${answer}
            </div>
        `;

        chat.scrollTop =
            chat.scrollHeight;

    }, 700);
}

// ======================================
// ENTER KEY
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const question =
            document.getElementById("question");

        if (question) {

            question.addEventListener(
                "keypress",
                function (e) {

                    if (e.key === "Enter") {
                        sendQuestion();
                    }

                }
            );
        }
    }
);


// ======================================
// CHATBOT INTELLIGENCE
// ======================================

function getAnswer(question) {

    question =
        question.toLowerCase();

    // Greeting

    if (
        question.includes("hello") ||
        question.includes("hi") ||
        question.includes("hey")
    ) {
        return randomReply(
            helloReplies
        );
    }

    // Thanks

    if (question.includes("thank")) {

        return randomReply(
            thanksReplies
        );
    }

    // Status

    if (question.includes("status")) {

        return (
            "The current Baby Cry AI status is <b>" +
            currentStatus +
            "</b> with a confidence of <b>" +
            confidence.toFixed(1) +
            "%</b>."
        );
    }

    // Confidence

    if (question.includes("confidence")) {

        return (
            "The current confidence is <b>" +
            confidence.toFixed(1) +
            "%</b>."
        );
    }

    // What should I do?

    if (
        question.includes("what should i do") ||
        question.includes("what do i do") ||
        question.includes("help me")
    ) {

        if (currentStatus === "HUNGER") {

            return "🍼 The AI currently detects <b>HUNGER</b>. Feed the baby if appropriate, burp the baby afterwards, and observe whether the crying stops.";
        }

        if (currentStatus === "DISTRESS") {

            return "🚨 The AI currently detects <b>DISTRESS</b>. Check the diaper, clothing, room temperature and comfort the baby.";
        }

        return "😊 The AI currently detects <b>NO CRY</b>. The baby appears calm. Continue monitoring normally.";
    }

    // Hunger / Feeding

    if (
        question.includes("hungry") ||
        question.includes("hunger") ||
        question.includes("feed") ||
        question.includes("feeding") ||
        question.includes("milk") ||
        question.includes("formula")
    ) {

        return randomReply(
            hungerReplies
        );
    }

    // Distress

    if (
        question.includes("distress") ||
        question.includes("pain") ||
        question.includes("uncomfortable") ||
        question.includes("crying")
    ) {

        return randomReply(
            distressReplies
        );
    }

    // Sleep

    if (
        question.includes("sleep") ||
        question.includes("tired") ||
        question.includes("nap")
    ) {

        return randomReply(
            sleepReplies
        );
    }

    // Diaper

    if (
        question.includes("diaper") ||
        question.includes("nappy")
    ) {

        return randomReply(
            diaperReplies
        );
    }

    // Burp

    if (
        question.includes("burp") ||
        question.includes("gas")
    ) {

        return randomReply(
            burpReplies
        );
    }

    // Temperature

    if (
        question.includes("temperature") ||
        question.includes("hot") ||
        question.includes("cold")
    ) {

        return randomReply(
            temperatureReplies
        );
    }

    // Doctor

    if (
        question.includes("doctor") ||
        question.includes("hospital") ||
        question.includes("fever") ||
        question.includes("sick")
    ) {

        return randomReply(
            doctorReplies
        );
    }

    // No Cry

    if (
        question.includes("no cry") ||
        question.includes("quiet") ||
        question.includes("calm")
    ) {

        return randomReply(
            noCryReplies
        );
    }

    // General Cry

    if (question.includes("cry")) {

        return randomReply(
            cryingReplies
        );
    }

    // Default

    const defaultReplies = [

        "I'm here to help with baby crying, feeding, sleeping and newborn care. Could you ask your question differently?",

        "I can answer questions about hunger, distress, diapers, feeding, sleeping and newborn care.",

        "Could you rephrase your question? I can help with baby care topics.",

        "I'm not sure I understood. Try asking about feeding, crying, sleep, diapers or newborn care.",

        "I'll do my best to help. Ask me about baby care, crying or feeding."

    ];

    return randomReply(
        defaultReplies
    );
}


// ======================================
// PAGE LOAD
// ======================================

window.addEventListener(
    "load",
    function () {

        updateAdvice(currentStatus);

        const chat =
            document.getElementById("chatBox");

        if (chat) {

            chat.innerHTML = `
                <div class="aiBubble">
                    👋 Hello! I'm your
                    <b>Baby Care Assistant</b>.
                    <br><br>

                    I can help answer questions about:
                    <br><br>

                    • Hunger<br>
                    • Distress<br>
                    • Feeding<br>
                    • Sleeping<br>
                    • Burping<br>
                    • Diapers<br>
                    • Temperature<br>
                    • General newborn care<br><br>

                    The recommendation panel above
                    will automatically update based
                    on the AI detection from the ESP32.
                </div>
            `;
        }

        // Immediately try to get ESP32 data
        updateStatus();
    }
);
