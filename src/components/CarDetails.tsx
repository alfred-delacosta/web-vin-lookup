import type { CarDetailsInterface } from "../App";
import { Car } from "lucide-react";

interface ChildProps {
  carDetails: CarDetailsInterface | null
}


export default function CarDetails({ carDetails }: ChildProps) {

    function showCarDetails() {
        let elements = [];
        for (const val in carDetails) {
            if (carDetails[val as keyof CarDetailsInterface] !== null) {
                elements.push(
                <div className="card" key={val}>
                    <div className="car-details-item">
                        <p className="title-text">
                            {val}
                        </p>
                        <p>
                            {carDetails[val as keyof CarDetailsInterface]}
                        </p>
                    </div>
                </div>)   
            }
        }
        return elements;
    }
  return (
    <div className="row space-around">
        <h1 className="car-name">{carDetails?.Make} {carDetails?.Model} Info</h1>
        <div className="full-col car-icon-section">
            <Car color="black" size={300} />
        </div>
        {showCarDetails()}
    </div>
  )
}