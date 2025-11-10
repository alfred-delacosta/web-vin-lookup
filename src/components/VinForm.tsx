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
