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
  const vinRegex = /^(?!.*[IOQ])[A-HJ-NPR-Z0-9]{17}$/;
  // Regex: positions 1–8 and 10–11: valid VIN chars; position 9: valid char or '*'
  const partialVinRegex = /^(?!.*[IOQ])[A-HJ-NPR-Z0-9]{8}[A-HJ-NPR-Z0-9*][A-HJ-NPR-Z0-9]{2}$/;

function checkVin(inputText: string) {
  // Normalize input: uppercase and trim whitespace
  setVin(vin.toUpperCase().replace(/\s/g, ''));
  const vinToCheck = inputText.toUpperCase().replace(/\s/g, '');

  if (!vinRegex.test(vinToCheck)) {
    return false;
  } else {
    return true;
  }
}

function isValidPartialVIN(inputText: string) {
  // Normalize: uppercase, remove whitespace
  setVin(inputText.toUpperCase().replace(/\s/g, ''));
  const vinToCheck = inputText.toUpperCase().replace(/\s/g, '');

  // Must be exactly 11 characters
  if (vinToCheck.length !== 11) {
    return false;
  }

  // Apply regex: positions 1–10: valid VIN chars (no I/O/Q)
  // position 11: valid VIN char or '*'
  return partialVinRegex.test(vinToCheck);
}

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
    // Clear the car
    setCarDetails(null);
    e.preventDefault();
    const apiUrl = buildApiUrl();
    try {
      const isValidVin = checkVin(vin);
      const isValidPartialVin = isValidPartialVIN(vin);

      if (isValidVin || isValidPartialVin) {
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
      } else {
        alert('Invalid VIN format, please enter a valid vin.');
        setRequestLoading(false);
        return; 
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
