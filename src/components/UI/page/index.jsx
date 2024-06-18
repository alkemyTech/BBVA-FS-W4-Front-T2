import Header from "../Header";
import Footer from "../Footer";
export default function Page(props) {
    return (
    <>
        <Header/>
        <div style={{height:"10vh"}}></div>
        <main style={{minHeight:"89vh"}}>{props.children}</main>
        <Footer/>
    </>
    );
}