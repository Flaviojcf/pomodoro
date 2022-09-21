import { Routes, Route } from "react-router-dom";
import { DeafaultLayout } from "./DefaultLayout/DefaultLayout";
import { History } from "./pages/History/History";
import { Home } from "./pages/Home/Home";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DeafaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        
      </Route>
    </Routes>
  );
}
