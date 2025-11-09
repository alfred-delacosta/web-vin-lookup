import VinForm from "./components/VinForm"
import Attribution from "./components/Attribution"

function App() {

  return (
    <div className="container">
      <header className="header flex-item">
        <h1>VIN Lookup</h1>
      </header>
      <section className="vin-form-section flex-item">
        <VinForm />
      </section>
      <Attribution />
    </div>
  )
}

export default App
