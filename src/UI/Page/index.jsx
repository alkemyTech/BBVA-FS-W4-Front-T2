import Header from "../Header";
import Footer from "../Footer";
export default function Page(props) {
    return (
    <>
        <Header/>
        <main style={{minHeight:"89vh"}}>{props.children}</main>
        <Footer/>
    </>
    );
}