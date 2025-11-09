import VinForm from "./components/VinForm"
import Attribution from "./components/Attribution"

function App() {

  return (
    <>
      <header>
        <h1>VIN Lookup</h1>
      </header>
      <section>
        <VinForm />
      </section>
      <Attribution />
    </>
  )
}

export default App
