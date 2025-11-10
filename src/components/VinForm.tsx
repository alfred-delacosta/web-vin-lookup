import { useState } from "react";
import { createEmptyCarDetail, type CarDetailsInterface } from "../App";

interface ApiDataResults {
  Value: string;
  ValueId: string;
  Variable: string;
  VariableId: number;
}

interface ChildProps {
  setCarDetails: React.Dispatch<
    React.SetStateAction<CarDetailsInterface | null>
  >;
}

export default function VinForm({ setCarDetails }: ChildProps) {
  const [vin, setVin] = useState("");
  const [year, setYear] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [errorFromRequest, setErrorFromRequest] = useState("");
  const apiDataVariables = [
    "Active Safety System Note",
    "Adaptive Cruise Control (ACC)",
    "Adaptive Driving Beam (ADB)",
    "Additional Error Text",
    "Anti-lock Braking System (ABS)",
    "Auto-Reverse System for Windows and Sunroofs",
    "Automatic Crash Notification (ACN) / Advanced Automatic Crash Notification (AACN)",
    "Automatic Pedestrian Alerting Sound (for Hybrid and EV only)",
    "Axle Configuration",
    "Axles",
    "Backup Camera",
    "Base Price ($)",
    "Battery Current (Amps) From",
    "Battery Current (Amps) To",
    "Battery Energy (kWh) From",
    "Battery Energy (kWh) To",
    "Battery Type",
    "Battery Voltage (Volts) From",
    "Battery Voltage (Volts) To",
    "Bed Length (inches)",
    "Bed Type",
    "Blind Spot Intervention (BSI)",
    "Blind Spot Warning (BSW)",
    "Body Class",
    "Brake System Description",
    "Brake System Type",
    "Bus Floor Configuration Type",
    "Bus Length (feet)",
    "Bus Type",
    "Cab Type",
    "Charger Level",
    "Charger Power (kW)",
    "Combined Braking System (CBS)",
    "Cooling Type",
    "Crash Imminent Braking (CIB)",
    "Curb Weight (pounds)",
    "Curtain Air Bag Locations",
    "Custom Motorcycle Type",
    "Daytime Running Light (DRL)",
    "Destination Market",
    "Displacement (CC)",
    "Displacement (CI)",
    "Displacement (L)",
    "Doors",
    "Drive Type",
    "Dynamic Brake Support (DBS)",
    "EV Drive Unit",
    "Electrification Level",
    "Electronic Stability Control (ESC)",
    "Engine Brake (hp) From",
    "Engine Brake (hp) To",
    "Engine Configuration",
    "Engine Manufacturer",
    "Engine Model",
    "Engine Number of Cylinders",
    "Engine Power (kW)",
    "Engine Stroke Cycles",
    "Entertainment System",
    "Error Code",
    "Error Text",
    "Event Data Recorder (EDR)",
    "Forward Collision Warning (FCW)",
    "Front Air Bag Locations",
    "Fuel Delivery / Fuel Injection Type",
    "Fuel Type - Primary",
    "Fuel Type - Secondary",
    "Fuel-Tank Material",
    "Fuel-Tank Type",
    "Gross Combination Weight Rating From",
    "Gross Combination Weight Rating To",
    "Gross Vehicle Weight Rating From",
    "Gross Vehicle Weight Rating To",
    "Headlamp Light Source",
    "Keyless Ignition",
    "Knee Air Bag Locations",
    "Lane Centering Assistance",
    "Lane Departure Warning (LDW)",
    "Lane Keeping Assistance (LKA)",
    "Make",
    "Manufacturer Name",
    "Model",
    "Model Year",
    "Motorcycle Chassis Type",
    "Motorcycle Suspension Type",
    "Non-Land Use",
    "Note",
    "Number of Battery Cells per Module",
    "Number of Battery Modules per Pack",
    "Number of Battery Packs per Vehicle",
    "Number of Seat Rows",
    "Number of Seats",
    "Number of Wheels",
    "Other Battery Info",
    "Other Bus Info",
    "Other Engine Info",
    "Other Motorcycle Info",
    "Other Restraint System Info",
    "Other Trailer Info",
    "Parking Assist",
    "Pedestrian Automatic Emergency Braking (PAEB)",
    "Plant City",
    "Plant Company Name",
    "Plant Country",
    "Plant State",
    "Possible Values",
    "Pretensioner",
    "Rear Automatic Emergency Braking",
    "Rear Cross Traffic Alert",
    "SAE Automation Level From",
    "SAE Automation Level To",
    "Seat Belt Type",
    "Seat Cushion Air Bag Locations",
    "Semiautomatic Headlamp Beam Switching",
    "Series",
    "Series2",
    "Side Air Bag Locations",
    "Steering Location",
    "Suggested VIN",
    "Tire Pressure Monitoring System (TPMS) Type",
    "Top Speed (MPH)",
    "Track Width (inches)",
    "Traction Control",
    "Trailer Body Type",
    "Trailer Length (feet)",
    "Trailer Type Connection",
    "Transmission Speeds",
    "Transmission Style",
    "Trim",
    "Trim2",
    "Turbo",
    "Valve Train Design",
    "Vehicle Descriptor",
    "Vehicle Type",
    "Wheel Base (inches) From",
    "Wheel Base (inches) To",
    "Wheel Base Type",
    "Wheel Size Front (inches)",
    "Wheel Size Rear (inches)",
    "Wheelie Mitigation",
    "Windows",
  ];

  function buildApiUrl(): URL {
    return new URL(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json&modelyear=${year}`
    );
  }

  function buildCarDetails(data: ApiDataResults[]) {
    let carDetails = createEmptyCarDetail();

    data.forEach((item) => {
      carDetails[item["Variable"] as keyof CarDetailsInterface] = item["Value"];
    });

    return carDetails;
  }

  async function onSubmit(e: React.FormEvent) {
    setRequestLoading(true);
    setErrorFromRequest("");
    e.preventDefault();
    const apiUrl = buildApiUrl();
    try {
      const results = await fetch(apiUrl);
      if (results.status === 200) {
        const resultsData = await results.json();
        const data: ApiDataResults[] = resultsData["Results"];
        setCarDetails(buildCarDetails(data));
      } else {
        throw new Error(
          `The API returned the following error:\nStatus: ${results.status}\nStatus Text: ${results.statusText}`
        );
      }
    } catch (error: any) {
      setErrorFromRequest(error.message);
    }
    setRequestLoading(false);
  }

  function clearCar(e: React.FormEvent) {
    e.preventDefault();
    setVin("");
    setYear("");
    setCarDetails(null);
  }

  return (
    <div className="vin-form-container">
      <form onSubmit={onSubmit} className="vin-form">
        <div>
          <div className="label-container">
            <label htmlFor="vin">Vin</label>
          </div>
          <input
            type="text"
            name="vin"
            id="vin"
            placeholder="VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            disabled={requestLoading}
            required
          />
        </div>
        <div>
          <div className="label-container">
            <label htmlFor="year">Year</label>
          </div>
          <input
            type="text"
            name="year"
            id="year"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={requestLoading}
          />
        </div>
        <div className="row">
          <button type="submit" className="custom-button" disabled={requestLoading}>
            Search
          </button>
          <button className="custom-button" onClick={clearCar}>Clear Car</button>
        </div>
      </form>
      <section className="full-col">
        {errorFromRequest.length > 0 && (
          <>
            <h3>
              Oh no! It looks like there was an error with the API. See the
              details below.
            </h3>
            <p>{errorFromRequest}</p>
          </>
        )}
      </section>
      <section className="full-col loading-container">{requestLoading && <span className="loader"></span>}</section>
    </div>
  );
}
