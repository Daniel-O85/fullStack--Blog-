import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./Komponente/Menu/Menu";
import Blog from "./Komponente/Blog/Blog";
import Finden from "./Komponente/Finden/Finden";
import Logout from "./Komponente/Logout/Logout";
import Freunde from "./Komponente/Freunde/Freunde";
import Willkommen from "./Komponente/Willkommen/Willkommen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route path="/" element={<Willkommen />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/finden" element={<Finden />} />
          <Route path="/freunde" element={<Freunde />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
