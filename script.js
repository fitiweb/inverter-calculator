/* =========================================================
   FITIWEBS SOLAR & INVERTER CALCULATOR
   ========================================================= */


/*
  APPLIANCE DATABASE

  watts = normal running power
  surge = approximate starting power

  These are estimates.

  Actual appliance ratings should be checked
  from the appliance nameplate/manual.
*/

const appliances = {

  led: {
    name: "LED Bulb",
    watts: 10,
    surge: 10
  },

  fan: {
    name: "Standing Fan",
    watts: 60,
    surge: 120
  },

  tv: {
    name: "Television",
    watts: 100,
    surge: 150
  },

  fridge: {
    name: "Refrigerator",
    watts: 150,
    surge: 600
  },

  freezer: {
    name: "Freezer",
    watts: 200,
    surge: 800
  },

  laptop: {
    name: "Laptop",
    watts: 65,
    surge: 100
  },

  decoder: {
    name: "Decoder",
    watts: 25,
    surge: 40
  },

  router: {
    name: "Wi-Fi Router",
    watts: 15,
    surge: 20
  },

  washing: {
    name: "Washing Machine",
    watts: 500,
    surge: 1200
  },

  microwave: {
    name: "Microwave",
    watts: 1200,
    surge: 1500
  },

  iron: {
    name: "Electric Iron",
    watts: 1200,
    surge: 1500
  },

  pump: {
    name: "Water Pump",
    watts: 750,
    surge: 1500
  },

  ac: {
    name: "Air Conditioner",
    watts: 1200,
    surge: 3000
  }

};


/*
  INVERTER DATABASE

  va = inverter capacity in VA
  kva = display name
  voltage = recommended nominal battery voltage
*/

const inverterSizes = [

  {
    va: 500,
    kva: "0.5 kVA",
    voltage: 12
  },

  {
    va: 1000,
    kva: "1 kVA",
    voltage: 12
  },

  {
    va: 1500,
    kva: "1.5 kVA",
    voltage: 12
  },

  {
    va: 2000,
    kva: "2 kVA",
    voltage: 24
  },

  {
    va: 2500,
    kva: "2.5 kVA",
    voltage: 24
  },

  {
    va: 3000,
    kva: "3 kVA",
    voltage: 24
  },

  {
    va: 3500,
    kva: "3.5 kVA",
    voltage: 24
  },

  {
    va: 5000,
    kva: "5 kVA",
    voltage: 48
  },

  {
    va: 6000,
    kva: "6 kVA",
    voltage: 48
  },

  {
    va: 7500,
    kva: "7.5 kVA",
    voltage: 48
  },

  {
    va: 10000,
    kva: "10 kVA",
    voltage: 48
  },

  {
    va: 12000,
    kva: "12 kVA",
    voltage: 48
  },

  {
    va: 15000,
    kva: "15 kVA",
    voltage: 48
  }

];


/*
  CURRENT APPLIANCES SELECTED BY USER
*/

let selectedAppliances = [];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const applianceSelect =
  document.getElementById("applianceSelect");

const addApplianceButton =
  document.getElementById("addAppliance");

const applianceList =
  document.getElementById("applianceList");

const calculateButton =
  document.getElementById("calculateBtn");

const results =
  document.getElementById("results");

const customBox =
  document.getElementById("customApplianceBox");



/* =========================================================
   SHOW / HIDE CUSTOM APPLIANCE
   ========================================================= */

applianceSelect.addEventListener("change", function () {

  if (this.value === "custom") {

    customBox.classList.remove("hidden");

  } else {

    customBox.classList.add("hidden");

  }

});



/* =========================================================
   ADD APPLIANCE
   ========================================================= */

addApplianceButton.addEventListener(
  "click",
  function () {

    const selected =
      applianceSelect.value;


    /*
      No appliance selected
    */

    if (!selected) {

      alert("Please select an appliance.");

      return;

    }


    /*
      CUSTOM APPLIANCE
    */

    if (selected === "custom") {

      const customName =
        document
          .getElementById("customName")
          .value
          .trim();

      const customWatts =
        parseFloat(
          document
            .getElementById("customWatts")
            .value
        );


      if (!customName || isNaN(customWatts) || customWatts <= 0) {

        alert(
          "Enter the appliance name and wattage."
        );

        return;

      }


      selectedAppliances.push({

        id:
          Date.now(),

        name:
          customName,

        watts:
          customWatts,

        surge:
          customWatts * 1.5,

        quantity:
          1

      });

    }


    /*
      STANDARD APPLIANCE
    */

    else {

      const appliance =
        appliances[selected];


      selectedAppliances.push({

        id:
          Date.now(),

        name:
          appliance.name,

        watts:
          appliance.watts,

        surge:
          appliance.surge,

        quantity:
          1

      });

    }


    renderAppliances();


    /*
      Reset selection
    */

    applianceSelect.value = "";

    customBox.classList.add("hidden");

    document
      .getElementById("customName")
      .value = "";

    document
      .getElementById("customWatts")
      .value = "";

  }
);



/* =========================================================
   DISPLAY APPLIANCES
   ========================================================= */

function renderAppliances() {

  applianceList.innerHTML = "";


  if (selectedAppliances.length === 0) {

    applianceList.innerHTML = `

      <tr>

        <td colspan="5">

          No appliances added yet.

        </td>

      </tr>

    `;

    return;

  }


  selectedAppliances.forEach(
    function (item) {

      const row =
        document.createElement("tr");


      row.innerHTML = `

        <td>
          ${escapeHTML(item.name)}
        </td>

        <td>
          ${formatNumber(item.watts)} W
        </td>

        <td>

          <input
            type="number"
            min="1"
            value="${item.quantity}"
            class="quantity-input"
            data-id="${item.id}"
          >

        </td>

        <td>
          <strong>
            ${formatNumber(
              item.watts * item.quantity
            )} W
          </strong>
        </td>

        <td>

          <button
            type="button"
            class="remove-btn"
            data-id="${item.id}">

            Remove

          </button>

        </td>

      `;


      applianceList.appendChild(row);

    }
  );


  /*
    Quantity changes
  */

  document
    .querySelectorAll(".quantity-input")
    .forEach(
      function (input) {

        input.addEventListener(
          "change",
          function () {

            const id =
              Number(this.dataset.id);

            let quantity =
              parseInt(this.value);


            if (
              isNaN(quantity) ||
              quantity < 1
            ) {

              quantity = 1;

              this.value = 1;

            }


            const appliance =
              selectedAppliances.find(
                item => item.id === id
              );


            if (appliance) {

              appliance.quantity =
                quantity;

            }


            renderAppliances();

          }
        );

      }
    );


  /*
    Remove buttons
  */

  document
    .querySelectorAll(".remove-btn")
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              Number(this.dataset.id);


            selectedAppliances =
              selectedAppliances.filter(
                item => item.id !== id
              );


            renderAppliances();

          }
        );

      }
    );

}



/* =========================================================
   CALCULATE SYSTEM
   ========================================================= */

calculateButton.addEventListener(
  "click",
  calculateSystem
);


function calculateSystem() {


  /*
    Customer name
  */

  const customerName =
    document
      .getElementById("customerName")
      .value
      .trim();


  if (!customerName) {

    alert(
      "Please enter your name."
    );

    return;

  }


  /*
    Make sure at least one appliance exists
  */

  if (selectedAppliances.length === 0) {

    alert(
      "Please add at least one appliance."
    );

    return;

  }


  /*
    Backup time
  */

  const backupHours =
    parseFloat(
      document
        .getElementById("backupHours")
        .value
    );


  if (
    isNaN(backupHours) ||
    backupHours <= 0
  ) {

    alert(
      "Please enter your required backup time."
    );

    return;

  }


  /*
    Solar hours
  */

  const solarHours =
    parseFloat(
      document
        .getElementById("solarHours")
        .value
    );


  if (
    isNaN(solarHours) ||
    solarHours <= 0
  ) {

    alert(
      "Please enter estimated peak sun hours."
    );

    return;

  }


  /*
    Battery type
  */

  const batteryType =
    document
      .getElementById("batteryType")
      .value;


  /*
    Panel wattage
  */

  const panelWatts =
    parseFloat(
      document
        .getElementById("panelWatts")
        .value
    );



  /* =======================================================
     STEP 1
     TOTAL RUNNING LOAD
     ======================================================= */

  let totalRunningWatts = 0;


  selectedAppliances.forEach(
    function (item) {

      totalRunningWatts +=
        item.watts * item.quantity;

    }
  );



  /* =======================================================
     STEP 2
     ESTIMATE SURGE LOAD
     ======================================================= */

  let totalSurgeWatts = 0;


  selectedAppliances.forEach(
    function (item) {

      totalSurgeWatts +=
        item.surge * item.quantity;

    }
  );



  /* =======================================================
     STEP 3
     INVERTER SIZE

     We use:

     Running load × 1.25

     This provides a basic operating margin.

     The actual inverter should also be checked
     against appliance surge requirements.
     ======================================================= */

  const requiredInverterVA =
    totalRunningWatts * 1.25 / 0.8;


  /*
    Find next available inverter
  */

  let recommendedInverter =
    inverterSizes.find(
      inverter =>
        inverter.va >= requiredInverterVA
    );


  /*
    If the estimated running requirement is below
    the smallest inverter, use the smallest one.
  */

  if (!recommendedInverter) {

    recommendedInverter =
      inverterSizes[
        inverterSizes.length - 1
      ];

  }


  /*
    Surge warning
  */

  const surgeWarning =
    totalSurgeWatts >
    recommendedInverter.va;



  /* =======================================================
     STEP 4
     BATTERY ENERGY

     Basic:

     Load × backup hours

     Then account for inverter/system losses.
     ======================================================= */

  const energyRequiredWh =
    totalRunningWatts *
    backupHours;


  /*
    Battery usable factors

    Lithium:
    approximately 90%

    Lead acid:
    approximately 50%
  */

  let usableDepth;


  if (batteryType === "lithium") {

    usableDepth = 0.90;

  } else {

    usableDepth = 0.50;

  }


  /*
    Inverter efficiency estimate
  */

  const inverterEfficiency =
    0.92;


  /*
    Required nominal battery energy
  */

  const batteryEnergyWh =
    energyRequiredWh /
    usableDepth /
    inverterEfficiency;



  /* =======================================================
     STEP 5
     SYSTEM VOLTAGE
     ======================================================= */

  let systemVoltage =
    recommendedInverter.voltage;


  /*
    Larger systems should generally use
    higher DC voltage to reduce current.

    Basic recommendation:
  */

  if (
    requiredInverterVA > 3000 &&
    systemVoltage < 48
  ) {

    systemVoltage = 48;

  }



  /* =======================================================
     STEP 6
     BATTERY Ah
     ======================================================= */

  const batteryAh =
    batteryEnergyWh /
    systemVoltage;


  /*
    Round upward to nearest 10Ah
  */

  const roundedBatteryAh =
    Math.ceil(
      batteryAh / 10
    ) * 10;



  /* =======================================================
     STEP 7
     SOLAR PANEL SIZE

     Daily energy requirement:

     Running load × backup hours

     We then divide by:

     Peak sun hours × system efficiency
     ======================================================= */

  const dailyEnergyWh =
    totalRunningWatts *
    backupHours;


  const solarSystemEfficiency =
    0.75;


  const requiredSolarWatts =
    dailyEnergyWh /
    solarHours /
    solarSystemEfficiency;


  /*
    Number of panels
  */

  const panelCount =
    Math.ceil(
      requiredSolarWatts /
      panelWatts
    );


  /*
    Actual installed panel capacity
  */

  const actualSolarCapacity =
    panelCount *
    panelWatts;



  /* =======================================================
     STEP 8
     ESTIMATE MPPT CURRENT

     Approximation:

     Solar watts / battery voltage
     ======================================================= */

  const mpptCurrent =
    actualSolarCapacity /
    systemVoltage;


  /*
    Recommend next common controller size
  */

  const mpptSizes = [
    20,
    30,
    40,
    50,
    60,
    80,
    100,
    120,
    150,
    200
  ];


  let recommendedMPPT =
    mpptSizes.find(
      size =>
        size >= mpptCurrent
    );


  if (!recommendedMPPT) {

    recommendedMPPT =
      "Multiple MPPT/controllers";

  }



  /* =======================================================
     STEP 9
     BATTERY CONFIGURATION EXAMPLE
     ======================================================= */

  let batteryExample = "";


  if (systemVoltage === 12) {

    batteryExample =
      `${Math.ceil(systemVoltage / 12)} × 12V battery bank`;

  }


  else if (systemVoltage === 24) {

    batteryExample =
      `2 × 12V batteries in series for 24V`;

  }


  else if (systemVoltage === 48) {

    batteryExample =
      `4 × 12V batteries in series for 48V`;

  }



  /* =======================================================
     STEP 10
     DISPLAY RESULTS
     ======================================================= */

  results.classList.remove("hidden");


  results.innerHTML = `

    <h3>
      ⚡ ${escapeHTML(customerName)}, Your Estimated System
    </h3>


    <p>
      Based on the appliances and backup time you entered,
      here is your preliminary solar system estimate.
    </p>


    <div class="result-grid">


      <div class="result-box">

        <small>
          Total Running Load
        </small>

        <strong>
          ${formatNumber(totalRunningWatts)} W
        </strong>

      </div>


      <div class="result-box">

        <small>
          Estimated Surge Load
        </small>

        <strong>
          ${formatNumber(totalSurgeWatts)} W
        </strong>

      </div>


      <div class="result-box">

        <small>
          Estimated Inverter Requirement
        </small>

        <strong>
          ${(requiredInverterVA / 1000).toFixed(2)} kVA
        </strong>

      </div>


      <div class="result-box">

        <small>
          Recommended Inverter
        </small>

        <strong>
          ${recommendedInverter.kva}
        </strong>

      </div>


      <div class="result-box">

        <small>
          Recommended Battery Voltage
        </small>

        <strong>
          ${systemVoltage} V
        </strong>

      </div>


      <div class="result-box">

        <small>
          Estimated Battery Capacity
        </small>

        <strong>
          ${formatNumber(roundedBatteryAh)} Ah
        </strong>

      </div>


      <div class="result-box">

        <small>
          Estimated Solar Requirement
        </small>

        <strong>
          ${formatNumber(
            Math.ceil(requiredSolarWatts)
          )} W
        </strong>

      </div>


      <div class="result-box">

        <small>
          Recommended Solar Panels
        </small>

        <strong>
          ${panelCount} × ${panelWatts}W
        </strong>

      </div>


      <div class="result-box">

        <small>
          Total Solar Capacity
        </small>

        <strong>
          ${formatNumber(
            actualSolarCapacity
          )} W
        </strong>

      </div>


      <div class="result-box">

        <small>
          Estimated MPPT Current
        </small>

        <strong>
          ${mpptCurrent.toFixed(1)} A
        </strong>

      </div>


    </div>


    <p>
      <strong>
        Battery configuration example:
      </strong>
      ${batteryExample}
    </p>


    <p>
      <strong>
        Estimated daily energy:
      </strong>
      ${formatNumber(
        dailyEnergyWh
      )} Wh
      (${(
        dailyEnergyWh / 1000
      ).toFixed(2)} kWh)
    </p>


    ${
      surgeWarning
      ?
      `
      <div class="warning">

        ⚠️ <strong>Surge Warning:</strong>

        The estimated appliance starting/surge load
        is higher than the selected inverter capacity.
        A professional design should verify the starting
        requirements of motors, compressors and other
        high-starting-current appliances.

      </div>
      `
      :
      ""
    }


    <div class="warning">

      <strong>
        Important:
      </strong>

      This is an estimation tool, not a final engineering
      design. Actual solar system sizing should verify
      appliance nameplate ratings, inverter surge capability,
      battery specifications, MPPT voltage/current limits,
      panel configuration, cable sizing, protection devices,
      installation conditions and local solar resources.

    </div>


    <a
      href="${createWhatsAppLink(
        customerName,
        totalRunningWatts,
        recommendedInverter.kva,
        systemVoltage,
        roundedBatteryAh,
        panelCount,
        panelWatts
      )}"
      target="_blank"
      rel="noopener"
      class="whatsapp-result">

      💬 Send My Results to FITIWEBS

    </a>

  `;


  /*
    Scroll results into view
  */

  results.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}



/* =========================================================
   WHATSAPP LINK
   ========================================================= */

function createWhatsAppLink(
  name,
  load,
  inverter,
  voltage,
  batteryAh,
  panelCount,
  panelWatts
) {


  const message =

`Hello FITIWEBS,

I used the FITIWEBS Solar & Inverter Calculator.

My name: ${name}

Total Load: ${load}W
Recommended Inverter: ${inverter}
System Voltage: ${voltage}V
Estimated Battery Capacity: ${batteryAh}Ah
Solar Panels: ${panelCount} × ${panelWatts}W

I would like professional advice/design for my solar system.

Thank you.`;


  return (
    "https://wa.me/2349132064109?text=" +
    encodeURIComponent(message)
  );

}



/* =========================================================
   FORMAT NUMBERS
   ========================================================= */

function formatNumber(number) {

  return Number(number)
    .toLocaleString(
      "en-NG",
      {
        maximumFractionDigits: 0
      }
    );

}



/* =========================================================
   BASIC HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}



/* =========================================================
   INITIAL RENDER
   ========================================================= */

renderAppliances();
