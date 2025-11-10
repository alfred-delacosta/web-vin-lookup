import type { CarDetailsInterface } from "../App";

interface ChildProps {
  carDetails: CarDetailsInterface | null
}


export default function CarDetails({ carDetails }: ChildProps) {
    console.log(carDetails);

    function showCarDetails() {
        let elements = [];
        for (const val in carDetails) {
            if (carDetails[val as keyof CarDetailsInterface] !== null) {
                elements.push(<div>
                    {val}: {carDetails[val as keyof CarDetailsInterface]}
                </div>)   
            }
        }
        return elements;
    }
  return (
    <div className="">
        {showCarDetails()}
    </div>
  )
}