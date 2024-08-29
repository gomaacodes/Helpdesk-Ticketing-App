import { Link } from "react-router-dom";

const Home = () => {
    const content = (
        <section className="home">
            <header>
                <h1>Welcome to <span className="nowrap">Techkits!</span></h1>
            </header>
            <main className="home__main">
                <h2>Submit a Ticket</h2>
                <h2>Track a Ticket</h2>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}

export default Home